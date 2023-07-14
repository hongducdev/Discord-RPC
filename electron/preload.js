const { contextBridge, ipcRenderer } = require('electron');

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

contextBridge.exposeInMainWorld('electron', {
	login: (id) => {
		return new Promise((resolve) => {
			if (!/\d{17,19}/.test(id))
				return resolve({
					success: false,
					error: new Error('Invalid ID'),
				});
			ipcRenderer.send('login', id);
			ipcRenderer.once('login-response', (event, response) => {
				resolve(response);
			});
		});
	},
});
