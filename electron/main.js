const path = require('path');
const {
	app,
	BrowserWindow,
	shell,
	ipcMain,
	screen,
	nativeImage,
	Tray,
	Menu,
	Notification,
} = require('electron');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const RPC = require('discord-rpc');
const ElectronDevtool = require('electron-extension-installer');
const appData = new Store();

const APP_NAME = 'NyanRPC';

log.info('App starting...');

const iconPath = path.join(__dirname, 'Icon.png');

let clientRPC = new RPC.Client({
	transport: 'ipc',
});

function createTray(win, port) {
	const tray = new Tray(
		nativeImage.createFromPath(iconPath).resize({ width: 16 }),
	);
	tray.setToolTip(APP_NAME);
	tray.on('click', () => {
		win.show();
	});
	const menu = Menu.buildFromTemplate([
		{
			label: APP_NAME,
			icon: nativeImage.createFromPath(iconPath).resize({ width: 16 }),
			enabled: false,
		},
		{
			type: 'separator',
		},
		{
			label: 'Check for Updates...',
			type: 'normal',
			visible: process.platform !== 'darwin',
			click: () => {},
		},
		{
			label: 'Github Repository',
			type: 'normal',
			visible: process.platform !== 'darwin',
			click: () => shell.openExternal('https://github.com/aiko-chan-ai/'),
		},
		{
			type: 'separator',
		},
		{
			label: 'Reload',
			click: () => {
				win.reload();
			},
		},
		{
			label: 'Toggle Developer Tools',
			click: () => {
				win.webContents.toggleDevTools();
			},
		},
		{
			type: 'separator',
		},
		{
			label: 'Quit',
			role: 'quit',
		},
	]);
	tray.setContextMenu(menu);
	return tray;
}

function parseRawToActivity(raw) {
	return {
		state: raw.state,
		details: raw.details,
		startTimestamp: raw.timestamps?.start,
		endTimestamp: raw.timestamps?.end,
		largeImageKey: raw.assets?.large_image,
		largeImageText: raw.assets?.large_text,
		smallImageKey: raw.assets?.small_image,
		smallImageText: raw.assets?.small_text,
		instance: true,
		partyId: raw.party?.id,
		partySize: raw.party?.size[0],
		partyMax: raw.party?.size[1],
		buttons: raw.buttons?.map((key, index) => {
			return {
				label: key,
				url: raw.metadata?.button_urls[index],
			};
		}),
	};
}

function createNotification(
	title,
	description,
	icon,
	silent = false,
	callbackWhenClick = () => {},
) {
	const n = new Notification({
		title,
		body: description,
		icon,
		silent,
	});
	n.once('click', (e) => {
		e.preventDefault();
		typeof callbackWhenClick == 'function' && callbackWhenClick();
		n.close();
	});
	n.show();
}

async function createWindow() {
	const primaryDisplay = screen.getPrimaryDisplay();
	const { width, height } = primaryDisplay.workAreaSize;
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: width * 0.9,
		height: height * 0.9,
		minWidth: 800,
		minHeight: 600,
		icon: nativeImage.createFromPath(iconPath).resize({ width: 128 }),
		webPreferences: {
			webSecurity: false,
			nodeIntegration: false,
			enableRemoteModule: false,
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
		},
		frame: false,
		backgroundColor: '#36393f',
		title: 'NyanRPC',
	});

	createTray(mainWindow);

	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`,
	);
	mainWindow.maximize();
	mainWindow.setMenu(null);

	mainWindow.webContents.on('will-navigate', (event, url) => {
		if (
			url ===
			(isDev
				? 'http://localhost:3000/'
				: `file://${path.join(__dirname, '../build/index.html')}`)
		)
			return;
		console.log(url);
		event.preventDefault();
		shell.openExternal(url);
	});

	if (isDev) {
		const devTools = new BrowserWindow();
		mainWindow.webContents.setDevToolsWebContents(devTools.webContents);
		mainWindow.webContents.openDevTools({ mode: 'detach' });
	}

	mainWindow.on('hide', function (e) {
		e.preventDefault();
		createNotification(
			APP_NAME + ' is running in background',
			'You can close the application in the taskbar',
		);
	});

	// IPC Events (Title Bar)
	ipcMain.on('minimize', (event) => {
		mainWindow.minimize();
	});

	ipcMain.on('max', (event) => {
		if (mainWindow.isMaximized()) {
			mainWindow.restore();
		} else {
			mainWindow.maximize();
		}
	});

	ipcMain.on('close', (event) => {
		mainWindow.hide();
	});

	// IPC Events (Discord RPC)
	ipcMain.on('login', (event, args) => {
		if (clientRPC.ready) {
			mainWindow.webContents.send('login-response', {
				success: false,
				error: new Error('Already logged in'),
			});
		} else {
			clientRPC
				.login({ clientId: args })
				.then(() => {
					mainWindow.webContents.send('login-response', {
						success: true,
						user: clientRPC.user,
					});
					clientRPC.ready = true;
				})
				.catch((err) => {
					mainWindow.webContents.send('login-response', {
						success: false,
						error: err,
					});
				});
		}
	});

	ipcMain.on('getCurrentUser', (event) => {
		if (clientRPC.ready) {
			mainWindow.webContents.send('getCurrentUser-response', {
				success: true,
				user: clientRPC.user,
			});
		} else {
			mainWindow.webContents.send('getCurrentUser-response', {
				success: false,
				error: new Error('Discord RPC is not ready'),
			});
		}
	});

	ipcMain.on('getActivity', (event) => {
		if (clientRPC.ready) {
			mainWindow.webContents.send('getActivity-response', {
				success: true,
				activity: parseRawToActivity(clientRPC.activity),
			});
		} else {
			mainWindow.webContents.send('getActivity-response', {
				success: false,
				error: new Error('Discord RPC is not ready'),
			});
		}
	});

	ipcMain.on('setActivity', (event, args) => {
		if (clientRPC.ready) {
			clientRPC
				.setActivity(args)
				.then((res) => {
					clientRPC.activity = res;
					mainWindow.webContents.send('setActivity-response', {
						success: true,
						result: parseRawToActivity(res),
					});
				})
				.catch((err) => {
					mainWindow.webContents.send('setActivity-response', {
						success: false,
						error: err,
					});
				});
		} else {
			mainWindow.webContents.send('setActivity-response', {
				success: false,
				error: new Error('Discord RPC is not ready'),
			});
		}
	});

	ipcMain.on('clearActivity', (event) => {
		if (clientRPC.ready) {
			clientRPC
				.clearActivity()
				.then((res) => {
					clientRPC.activity = undefined;
					mainWindow.webContents.send('clearActivity-response', {
						success: true,
						result: res,
					});
				})
				.catch((err) => {
					mainWindow.webContents.send('clearActivity-response', {
						success: false,
						error: err,
					});
				});
		} else {
			mainWindow.webContents.send('clearActivity-response', {
				success: false,
				error: new Error('Discord RPC is not ready'),
			});
		}
	});

	ipcMain.on('logout', (event) => {
		if (clientRPC.ready) {
			clientRPC.destroy().then((res) => {
				mainWindow.webContents.send('logout-response', {
					success: true,
					result: res,
				});
				// Reinitialize clientRPC
				clientRPC = new RPC.Client({
					transport: 'ipc',
				});
			});
		} else {
			mainWindow.webContents.send('logout-response', {
				success: false,
				error: new Error('Discord RPC is not ready'),
			});
		}
	});
}

app.whenReady().then(() => {;
	ElectronDevtool.installExtension(ElectronDevtool.REACT_DEVELOPER_TOOLS, {
		loadExtensionOptions: {
			allowFileAccess: true,
		}
	})
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err))
		.finally(createWindow);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on('before-quit', () => {
	log.info('App closing...');
});
