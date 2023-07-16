import { EventEmitter } from 'events';
import { setTimeout, clearTimeout } from 'timers';
import { RPCCommands, RPCEvents } from './constants';
import { pid as getPid, uuid4122 as uuid } from './util';
import { Snowflake, Presence, RawPresence } from './interface';
import IPCTransport from './transports/ipc';

declare interface RPCClient {
	on(event: 'ready', listener: (transport: IPCTransport) => void): this;
	on(event: 'connected', listener: (transport: IPCTransport) => void): this;
	on(
		event: 'disconnected',
		listener: (transport: IPCTransport) => void,
	): this;
	on(event: string, listener: Function): this;
}

class RPCClient extends EventEmitter {
	transports: Map<number, IPCTransport> = new Map();

	constructor() {
		super();
	}

	connect(
		clientId: Snowflake,
		id: number | undefined = this.transports.size,
	): Promise<IPCTransport> {
		const promise = new Promise((resolve, reject) => {
			const transport = new IPCTransport(this);
			transport.clientId = clientId;
			function handleMessage(this: IPCTransport, message: any) {
				if (
					message.cmd === RPCCommands.DISPATCH &&
					message.evt === RPCEvents.READY
				) {
					if (message.data.user) {
						this.user = message.data.user;
					}
					this.fetchAssets().then(() => {
						this.client.emit('connected', this);
					});
				} else if (this._expecting.has(message.nonce)) {
					const { resolve, reject } = this._expecting.get(
						message.nonce,
					);
					if (message.evt === 'ERROR') {
						const e = new Error(message.data.message) as any;
						e.code = message.data.code;
						e.data = message.data;
						reject(e);
					} else {
						if (message.cmd === RPCEvents.SET_ACTIVITY) {
							this.activity = message.data;
						}
						resolve(message.data);
					}
					this._expecting.delete(message.nonce);
				} else {
					this.client.emit(message.evt, message.data);
				}
			}
			transport.on('message', handleMessage.bind(transport));
			const timeout = setTimeout(
				() => reject(new Error('RPC_CONNECTION_TIMEOUT')),
				10e3,
			);
			timeout.unref();
			function handleConnected(
				this: RPCClient,
				transport_: IPCTransport,
			) {
				if (transport.ipcId === transport_.ipcId) {
					clearTimeout(timeout);
					this.transports.set(transport.ipcId, transport);
					resolve(transport);
					this.removeListener('connected', handleConnected);
				}
			}
			this.on('connected', handleConnected.bind(this));
			transport.once('close', () => {
				transport._expecting.forEach((e) => {
					e.reject(new Error('connection closed'));
				});
				this.emit('disconnected', transport);
				reject(new Error('connection closed'));
			});
			transport.connect(id).catch(reject);
		});
		return promise as Promise<IPCTransport>;
	}

	async login(
		{ clientId, ipcId } = {} as { clientId: Snowflake; ipcId?: number },
	) {
		const transport = await this.connect(clientId, ipcId);
		this.emit('ready', transport);
		return transport;
	}

	private request(ipcId = 0, cmd: string, args: object): Promise<any> {
		return new Promise((resolve, reject) => {
			const nonce = uuid();
			const transport = this.transports.get(ipcId);
			if (!transport) {
				return reject(new Error(`ID ${ipcId} is not connected`));
			}
			if (cmd == RPCCommands.SET_ACTIVITY) {
				// @ts-ignore
				if (args.activity && args.activity.assets) {
					// @ts-ignore
					args.activity.assets = {
						large_image: transport.parseImageAnyToAsset(
							// @ts-ignore
							args.activity.assets.large_image,
						),
						// @ts-ignore
						large_text: args.activity.assets.large_text,
						small_image: transport.parseImageAnyToAsset(
							// @ts-ignore
							args.activity.assets.small_image,
						),
						// @ts-ignore
						small_text: args.activity.assets.small_text,
					};
				}
			}
			transport.send({ cmd, args, evt: undefined, nonce });
			transport._expecting.set(nonce, { resolve, reject });
		});
	}

	setActivity(
		args = {} as Presence,
		pid = getPid(),
		ipcId = 0,
	): Promise<RawPresence> {
		let timestamps;
		let assets;
		let party;
		let secrets;
		if (args.startTimestamp || args.endTimestamp) {
			timestamps = {
				start: args.startTimestamp,
				end: args.endTimestamp,
			};
			if (timestamps.start instanceof Date) {
				timestamps.start = Math.round(timestamps.start.getTime());
			}
			if (timestamps.end instanceof Date) {
				timestamps.end = Math.round(timestamps.end.getTime());
			}
			if ((timestamps.start as number) > 2147483647000) {
				throw new RangeError(
					'timestamps.start must fit into a unix timestamp',
				);
			}
			if ((timestamps.end as number) > 2147483647000) {
				throw new RangeError(
					'timestamps.end must fit into a unix timestamp',
				);
			}
		}

		if (
			args.largeImageKey ||
			args.largeImageText ||
			args.smallImageKey ||
			args.smallImageText
		) {
			assets = {
				large_image: args.largeImageKey,
				large_text: args.largeImageText,
				small_image: args.smallImageKey,
				small_text: args.smallImageText,
			};
		}

		if (args.partySize || args.partyId || args.partyMax) {
			party = { id: args.partyId } as {
				id?: string;
				size?: number[];
			};
			if (!party.id) {
				party.id = uuid();
			}
			if (args.partySize || args.partyMax) {
				party.size = [
					args.partySize as number,
					args.partyMax as number,
				];
			}
		}

		if (args.matchSecret || args.joinSecret || args.spectateSecret) {
			secrets = {
				match: args.matchSecret,
				join: args.joinSecret,
				spectate: args.spectateSecret,
			};
		}

		return this.request(ipcId, RPCCommands.SET_ACTIVITY, {
			pid,
			activity: {
				type: 0, // Playing
				state: args.state,
				details: args.details,
				timestamps,
				assets,
				party,
				secrets,
				buttons: args.buttons,
				instance: !!args.instance,
			},
		});
	}

	clearActivity(pid = getPid(), ipcId = 0) {
		return this.request(ipcId, RPCCommands.SET_ACTIVITY, {
			pid,
		});
	}

	async destroy() {
		await Promise.all(
			Array.from(this.transports.values()).map((t) => t.close()),
		);
	}

	async fetchOpenSocket() {
		const opens: number[] = []
		for (let i = 0; i < 10; i++) {
			const trans = new IPCTransport(this);
			opens.push(i);
			await trans.connect(i).catch(() => {
				opens.pop();
			});
			trans.close();
		}
		return opens;
	}
}

export default RPCClient;
