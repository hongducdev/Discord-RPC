/**
 * TODO:
 *  * Support Windows, Mac, Linux
 *  * Support custom profiles
 *  * Support Selfbot
 */

import app from './Express/index.js';
import functions from './Utils/functions.js';
import RPC from 'discord-rpc';
import * as Discord from 'discord.js-selfbot-v13';

export class NyanRPC {
	constructor() {
		// Object.defineProperty(this, 'electron', { value: electron });
		this.port = functions.random(4500, 5000);
		this.app = app;
		this._rpcClient = new RPC.Client({ transport: 'ipc' });
		this._selfClient = new Discord.Client();
	}
	// Load event
	_loadNodeEvent() {
		functions.loadEvent(this, process, 'Nodejs', false);
	}
	// Start port
	_testPort(i = 0) {
		return new Promise(resolve => {
			this.app.http.listen(this.port + i, async (error) => {
				if (error) {
					await this._testPort(i + 1);
				} else {
					this.port = this.port + i;
					resolve(this);
					console.log(`Webserver start (port: ${this.port})`);
				}
			});
		})
	}

	start() {
		this._loadNodeEvent();
		return this._testPort();
	}
}
