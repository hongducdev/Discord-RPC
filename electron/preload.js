const { contextBridge, ipcRenderer } = require('electron');

const uuid = () =>
	([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (a) =>
		(a ^ ((Math.random() * 16) >> (a / 4))).toString(16),
	);

contextBridge.exposeInMainWorld('titleBar', {
	minimize: () => {
		ipcRenderer.send('minimize');
	},
	max: () => {
		ipcRenderer.send('max');
	},
	close: () => {
		ipcRenderer.send('close');
	},
});

contextBridge.exposeInMainWorld('RPCStorage', {
	get: (key) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('localStorage', {
				action: 'get',
				key,
				nonce,
			});
			const handler = (event, response) => {
				if (response.nonce === nonce) {
					ipcRenderer.removeListener(
						'localStorage-response',
						handler,
					);
					resolve(response);
				}
			};
			ipcRenderer.on('localStorage-response', handler);
		});
	},
	set: (key, value) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('localStorage', {
				action: 'set',
				key,
				value,
				nonce,
			});
			const handler = (event, response) => {
				if (response.nonce === nonce) {
					ipcRenderer.removeListener(
						'localStorage-response',
						handler,
					);
					resolve(response);
				}
			};
			ipcRenderer.on('localStorage-response', handler);
		});
	},
	delete: (key) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('localStorage', {
				action: 'delete',
				key,
				nonce,
			});
			const handler = (event, response) => {
				if (response.nonce === nonce) {
					ipcRenderer.removeListener(
						'localStorage-response',
						handler,
					);
					resolve(response);
				}
			};
			ipcRenderer.on('localStorage-response', handler);
		});
	},
	has: (key) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('localStorage', {
				action: 'has',
				key,
				nonce,
			});
			const handler = (event, response) => {
				if (response.nonce === nonce) {
					ipcRenderer.removeListener(
						'localStorage-response',
						handler,
					);
					resolve(response);
				}
			};
			ipcRenderer.on('localStorage-response', handler);
		});
	},
	clear: () => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('localStorage', {
				action: 'clear',
				nonce,
			});
			const handler = (event, response) => {
				if (response.nonce === nonce) {
					ipcRenderer.removeListener(
						'localStorage-response',
						handler,
					);
					resolve(response);
				}
			};
			ipcRenderer.on('localStorage-response', handler);
		});
	},
	all: () => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('localStorage', {
				action: 'all',
				nonce,
			});
			const handler = (event, response) => {
				if (response.nonce === nonce) {
					ipcRenderer.removeListener(
						'localStorage-response',
						handler,
					);
					resolve(response);
				}
			};
			ipcRenderer.on('localStorage-response', handler);
		});
	},
});

contextBridge.exposeInMainWorld('electron', {
	getOpenSockets: () => {
		return new Promise((resolve) => {
			ipcRenderer.send('getOpenSockets');
			ipcRenderer.once('getOpenSockets-response', (event, response) => {
				resolve(response);
			});
		});
	},
	login: (socketId, id) => {
		return new Promise((resolve) => {
			if (!/\d{17,19}/.test(id))
				return resolve({
					success: false,
					error: new Error('Invalid ID'),
				});
			const nonce = uuid();
			ipcRenderer.send('login', {
				clientId: id,
				socketId,
				nonce,
			});
			ipcRenderer.once(`login-response-${nonce}`, (event, response) => {
				resolve(response);
			});
		});
	},
	getCurrentUser: (socketId) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('getCurrentUser', {
				socketId,
				nonce,
			});
			ipcRenderer.once(
				`getCurrentUser-response-${nonce}`,
				(event, response) => {
					resolve(response);
				},
			);
		});
	},
	setActivity: (socketId, activity) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('setActivity', {
				socketId,
				activity,
				nonce,
			});
			ipcRenderer.once(`setActivity-response-${nonce}`, (event, response) => {
				resolve(response);
			});
		});
	},
	clearActivity: (socketId) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('clearActivity', {
				socketId,
				nonce,
			});
			ipcRenderer.once(`clearActivity-response-${nonce}`, (event, response) => {
				resolve(response);
			});
		});
	},
	logout: (socketId) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('logout', {
				socketId,
				nonce,
			});
			ipcRenderer.once(`logout-response-${nonce}`, (event, response) => {
				resolve(response);
			});
		});
	},
	getDiscordAppName: (socketId) => {
		return new Promise((resolve) => {
			const nonce = uuid();
			ipcRenderer.send('getDiscordAppName', {
				socketId,
				nonce,
			});
			ipcRenderer.once(`getDiscordAppName-response-${nonce}`, (event, response) => {
				resolve(response);
			});
		});
	},
	listenEvent: (eventName, callback) => {
		if (typeof callback !== 'function') throw new Error('Callback must be a function');
		ipcRenderer.on(eventName, callback);
	},
	sendEventFromClientToMain: (eventName, data) => {
		ipcRenderer.send(eventName, data);
	}
});
