const electron = require('electron');
const {
	app,
	BrowserWindow,
	Menu,
	nativeImage,
	Tray,
	dialog,
	Notification,
} = electron;

const packageData = require('./package.json');

const path = require('path');
const fs = require('fs');

let tray = null;
let lang;
let mainWindow;
let notification = false;

function sleep(miliseconds) {
	return new Promise((r) => setTimeout(r, miliseconds));
}

function createTray(minimize = false) {
	const icon = path.resolve('.', 'src', 'Assets', 'icon.ico');
	const trayicon = nativeImage.createFromPath(icon);
	tray ? tray : (tray = new Tray(trayicon.resize({ width: 16 })));
	const contextMenu = Menu.buildFromTemplate([
		!minimize
			? {
					label: lang.tray.hide,
					click: () => {
						mainWindow.minimize();
					},
			  }
			: {
					label: lang.tray.show,
					click: () => {
						mainWindow.show();
					},
			  },
		{
			label: lang.tray.exit,
			click: () => {
				app.quit();
			},
		},
	]);

	tray.setContextMenu(contextMenu);
}

function loadFile(devMode, writeData) {
	console.log(app.getPath('userData'));
	devMode = !app.isPackaged;
	const pathFolder = path.resolve(app.getPath('userData'), 'NyanRPCdata');
	// if no folder => make folder
	if (!fs.existsSync(pathFolder) && !devMode) {
		fs.mkdirSync(pathFolder);
	}
	const pathFile = devMode
		? path.resolve('.', 'data.json')
		: path.resolve(pathFolder, 'data.json');
	//
	let defaultData = {
		language: 'en',
		profile: [],
		devtool: true,
		background: null,
		check_for_update: true,
	};
	// if no file => make file
	if (!fs.existsSync(pathFile)) {
		fs.writeFileSync(pathFile, JSON.stringify(defaultData, null, 2));
	} else {
		// read file
		defaultData = JSON.parse(fs.readFileSync(pathFile));
	}
	if (writeData && writeData instanceof Object) {
		const newData = Object.assign(defaultData, writeData);
		fs.writeFileSync(pathFile, JSON.stringify(newData, null, 2));
	}
	// dev
	return JSON.parse(fs.readFileSync(pathFile));
}

function loadLanguage(code) {
	return require(`./src/Language/${code}.json`);
}

async function start() {
	const data_ = loadFile(!app.isPackaged);
	const indexApp = await import('./src/index.js');
    const function_ = (await import('./src/Utils/functions.js'));
	const nyanRPC = new indexApp.NyanRPC(app.isPackaged);
    //
	lang = loadLanguage(data_.language);
	if (!tray) {
		createTray();
	}
	console.log('Check Package: ', app.isPackaged);
	mainWindow = new BrowserWindow({
		width: 1300,
		height: 750,
		minWidth: 1200,
		minHeight: 750,
		movable: true,
		resizable: true,
		title: 'Starting ...',
		autoHideMenuBar: true,
		icon: path.resolve('.', 'src', 'Assets', 'icon.ico'),
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: true,
			enableRemoteModule: true,
			devTools: !app.isPackaged ? true : data_?.devtool || false,
			preload: path.resolve(app.getAppPath(), 'preload.cjs'),
		},
	});
	await nyanRPC.start();
    //
    nyanRPC.app.io.on('connection', (socket) => {
		console.log('Loaded SocketIO');
		// Load Event
		function_.default.loadEvent(
			{
				nyan: nyanRPC,
				eval: (await_ = true, command) => {
					return eval(
						await_ ? `(async() => {${command}} )()` : command,
					);
				},
			},
			socket,
			'SocketIO',
			true,
			app.isPackaged,
		);
		socket.emit('ready');
	});
	mainWindow.loadURL('http://localhost:' + nyanRPC.port + '/rpc');
	if (!app.isPackaged) mainWindow.webContents.openDevTools();
	mainWindow.on('close', function (e) {
		const response = dialog.showMessageBoxSync(this, {
			type: 'question',
			buttons: lang.exit.buttons,
			title: lang.exit.title,
			message: lang.exit.message,
		});
		console.log('Respond', response);
		if (response == 1) e.preventDefault();
		else mainWindow = null;
	});
	mainWindow.on('minimize', function (e) {
		e.preventDefault();
		mainWindow.hide();
		createTray(true);
		app.setAppUserModelId('NyanRPC');
		if (notification) return;
		notification = true;
		new Notification({
			title: lang.minimize.title,
			body: lang.minimize.body,
		}).show();
	});
	mainWindow.on('restore', function (e) {
		e.preventDefault();
		mainWindow.show();
		createTray(false);
	});

	tray.on('click', () => {
		if (mainWindow.isMinimized()) mainWindow.show();
	});

	mainWindow.webContents.on('will-navigate', function (e, url) {
		if (
			url == `${'http://localhost:' + nyanRPC.port + '/dino'}` ||
			url == `${'http://localhost:' + nyanRPC.port + '/rpc'}`
		)
			return mainWindow.loadURL(url);
		e.preventDefault();
		electron.shell.openExternal(url);
	});

	tray.setToolTip('[NyanRPC] v' + packageData.version);
}

app.on('ready', async () => {
	await start();
});

app.on('window-all-closed', function () {
	app.quit();
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});
