import net from 'net';
import EventEmitter from 'events';
import { uuid4122 as uuid } from '../util';
import Client from '../client';
import { Presence, RawPresence, User } from '../interface';
import fetch from 'node-fetch';

const OPCodes = {
	HANDSHAKE: 0,
	FRAME: 1,
	CLOSE: 2,
	PING: 3,
	PONG: 4,
};

function getIPCPath(id: number): string {
	if (process.platform === 'win32') {
		return `\\\\?\\pipe\\discord-ipc-${id}`;
	}
	const {
		env: { XDG_RUNTIME_DIR, TMPDIR, TMP, TEMP },
	} = process;
	const prefix = XDG_RUNTIME_DIR || TMPDIR || TMP || TEMP || '/tmp';
	return `${prefix.replace(/\/$/, '')}/discord-ipc-${id}`;
}

function getIPC(id = 0, auto = true): Promise<{
	id: number;
	sock: net.Socket;
}> {
	return new Promise((resolve, reject) => {
		const path = getIPCPath(id);
		const onerror = () => {
			if (id < 10 && auto) {
				resolve(getIPC(id + 1, auto));
			} else {
				reject(new Error('Could not connect'));
			}
		};
		const sock = net.createConnection(path, () => {
			sock.removeListener('error', onerror);
			resolve({
				id,
				sock,
			});
		});
		sock.once('error', onerror);
	});
}

function encode(op: number, data: object | string): Buffer {
	const dataStr = JSON.stringify(data);
	const len = Buffer.byteLength(dataStr);
	const packet = Buffer.alloc(8 + len);
	packet.writeInt32LE(op, 0);
	packet.writeInt32LE(len, 4);
	packet.write(dataStr, 8, len);
	return packet;
}

const working = {
	full: '',
	op: undefined as number | undefined,
};

function decode(
	socket: net.Socket,
	callback: (message: { op?: number; data: any }) => void,
): void {
	const packet = socket.read();
	if (!packet) {
		return;
	}

	let { op } = working;
	let raw: string;
	if (working.full === '') {
		op = working.op = packet.readInt32LE(0);
		const len = packet.readInt32LE(4);
		raw = packet.slice(8, len + 8).toString();
	} else {
		raw = packet.toString();
	}

	try {
		const data = JSON.parse(working.full + raw);
		callback({ op, data });
		working.full = '';
		working.op = undefined;
	} catch (err) {
		working.full += raw;
	}

	decode(socket, callback);
}

class IPCTransport extends EventEmitter {
	client: Client;
	socket: net.Socket | null;
	ipcId: number;
	_expecting: Map<any, any> = new Map();
	clientId!: string;
	user!: User;
	activity?: RawPresence;
	assets?: {
		id: string;
		type: number;
		name: string;
	}[];

	constructor(client: Client) {
		super();
		this.client = client;
		this.socket = null;
		this.ipcId = 0;
	}

	async connect(ipcId?: number): Promise<void> {
		const data = await getIPC(ipcId ?? this.ipcId, ipcId ? false : true);
		this.ipcId = data.id;
		const socket = (this.socket = data.sock);
		socket.on('close', this.onClose.bind(this));
		socket.on('error', this.onClose.bind(this));
		this.emit('open');
		socket.write(
			encode(OPCodes.HANDSHAKE, {
				v: 1,
				client_id: this.clientId,
			}),
		);
		socket.pause();
		socket.on('readable', () => {
			decode(socket, ({ op, data }) => {
				switch (op) {
					case OPCodes.PING:
						this.send(data, OPCodes.PONG);
						break;
					case OPCodes.FRAME:
						if (!data) {
							return;
						}
						this.emit('message', data);
						break;
					case OPCodes.CLOSE:
						this.emit('close', data);
						break;
					default:
						break;
				}
			});
		});
	}

	fetchAssets(): Promise<this> {
		return new Promise((resolve, reject) => {
			fetch(
				`https://discord.com/api/v9/oauth2/applications/${this.clientId}/assets`,
			)
				.then((r) => {
					if (r.ok) {
						r.json().then((assets: any) => {
							this.assets = assets;
							resolve(this);
						});
					} else {
						reject(r);
					}
				})
				.catch(reject);
		});
	}

	parseImageAnyToAsset(image?: string) {
		if (!image) {
			return null;
		}
		if (/\d{17,19}/.test(image)) {
			const asset = this.assets?.find((a) => a.id == image);
			if (asset) {
				return asset.name;
			} else {
				return null;
			}
		}
		if (image.startsWith('mp:external') && image.includes('/https/')) {
			return 'https://' + image.split('/https/')[1];
		}
		if (image.startsWith('mp:')) {
			return image.replace('mp:', 'https://media.discordapp.net/');
		}
		return image;
	}

	getActivity(): Presence | null {
		if (!this.activity) {
			return null;
		}
		const data = {
			state: this.activity.state,
			details: this.activity.details,
			startTimestamp: this.activity.timestamps?.start,
			endTimestamp: this.activity.timestamps?.end,
			largeImageKey: this.parseImageAnyToAsset(
				this.activity.assets?.large_image,
			),
			largeImageText: this.activity.assets?.large_text,
			smallImageKey: this.parseImageAnyToAsset(
				this.activity.assets?.small_image,
			),
			smallImageText: this.activity.assets?.small_text,
			instance: this.activity.flags == 1 ? true : false,
			partyId: this.activity.party?.id,
			partySize: this.activity.party?.size?.[0],
			partyMax: this.activity.party?.size?.[1],
			buttons: this.activity.buttons?.map((name, index) => ({
				label: name,
				url: this.activity?.metadata?.button_urls?.[index],
			})),
			raw: this.activity,
		} as Presence;
		return data;
	}

	onClose(e: any): void {
		this.emit('close', e);
	}

	send(data: object | string, op = OPCodes.FRAME): void {
		if (this.socket) {
			this.socket.write(encode(op, data));
		}
	}

	close(): Promise<void> {
		return new Promise((r) => {
			this.once('close', r);
			this.send({}, OPCodes.CLOSE);
			if (this.socket) {
				this.socket.end();
			}
		});
	}

	ping(): void {
		this.send(uuid(), OPCodes.PING);
	}

	setActivity(args: Presence, pid?: number): Promise<RawPresence> {
		return this.client.setActivity(args, pid, this.ipcId);
	}

	clearActivity(pid?: number): Promise<any> {
		return this.client.clearActivity(pid, this.ipcId);
	}
}

export default IPCTransport;
export { encode, decode };
