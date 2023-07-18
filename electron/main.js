const path = require("path");
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
} = require("electron");
const log = require("electron-log");
const isDev = require("electron-is-dev");
const Store = require("electron-store");
const RPC = require("./dist/index");
const ElectronDevtool = require("electron-extension-installer");
const appData = new Store();
require("./contextMenu");

const APP_NAME = "NyanRPC";

log.info("App starting...");

const iconPath = path.join(__dirname, "Icon.png");

const clientRPC = new RPC.Client();

function createTray(win) {
  const tray = new Tray(
    nativeImage.createFromPath(iconPath).resize({ width: 16 })
  );
  tray.setToolTip(APP_NAME);
  tray.on("click", () => {
    win.show();
  });
  const menu = Menu.buildFromTemplate([
    {
      label: APP_NAME,
      icon: nativeImage.createFromPath(iconPath).resize({ width: 16 }),
      enabled: false,
    },
    {
      type: "separator",
    },
    {
      label: "Check for Updates...",
      type: "normal",
      visible: process.platform !== "darwin",
      click: () => {},
    },
    {
      label: "Github Repository",
      type: "normal",
      visible: process.platform !== "darwin",
      click: () => shell.openExternal("https://github.com/aiko-chan-ai/"),
    },
    {
      type: "separator",
    },
    {
      label: "Reload",
      click: () => {
        win.reload();
      },
    },
    {
      label: "Toggle Developer Tools",
      click: () => {
        win.webContents.toggleDevTools();
      },
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      role: "quit",
    },
  ]);
  tray.setContextMenu(menu);
  return tray;
}

function getDiscordAppFromAPI(api) {
  if (api.includes("ptb.")) return "Discord PTB";
  if (api.includes("canary.")) return "Discord Canary";
  return "Discord Stable";
}

function createNotification(
  title,
  description,
  icon,
  silent = false,
  callbackWhenClick = () => {}
) {
  const n = new Notification({
    title,
    body: description,
    icon,
    silent,
  });
  n.once("click", (e) => {
    e.preventDefault();
    typeof callbackWhenClick == "function" && callbackWhenClick();
    n.close();
  });
  n.show();
}

async function createWindow() {
  let allSockets = await clientRPC.fetchOpenSocket();

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
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    frame: false,
    backgroundColor: "#36393f",
    title: "NyanRPC",
  });

  createTray(mainWindow);

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.maximize();
  mainWindow.setMenu(null);

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (
      url ===
      (isDev
        ? "http://localhost:3000/"
        : `file://${path.join(__dirname, "../build/index.html")}`)
    )
      return;
    console.log(url);
    event.preventDefault();
    shell.openExternal(url);
  });

  if (isDev) {
    const devTools = new BrowserWindow();
    mainWindow.webContents.setDevToolsWebContents(devTools.webContents);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.on("hide", function (e) {
    e.preventDefault();
    createNotification(
      APP_NAME + " is running in background",
      "You can close the application in the taskbar"
    );
  });

  // IPC Events (Title Bar)
  ipcMain.on("minimize", (event) => {
    mainWindow.minimize();
  });

  ipcMain.on("max", (event) => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close", (event) => {
    mainWindow.hide();
  });

  // IPC Events (Local Storage)
  ipcMain.on("localStorage", (event, args) => {
    switch (args.action) {
      case "get":
        return mainWindow.webContents.send("localStorage-response", {
          nonce: args.nonce,
          success: true,
          value: appData.get(args.key),
        });
      case "set":
        appData.set(args.key, args.value);
        return mainWindow.webContents.send("localStorage-response", {
          nonce: args.nonce,
          success: true,
          value: appData.get(args.key),
        });
      case "delete":
        appData.delete(args.key);
        return mainWindow.webContents.send("localStorage-response", {
          nonce: args.nonce,
          success: true,
          value: appData.get(args.key),
        });
      case "has":
        return mainWindow.webContents.send("localStorage-response", {
          nonce: args.nonce,
          success: true,
          value: appData.has(args.key),
        });
      case "clear":
        return mainWindow.webContents.send("localStorage-response", {
          nonce: args.nonce,
          success: true,
          value: appData.clear(),
        });
      case "all":
        return mainWindow.webContents.send("localStorage-response", {
          nonce: args.nonce,
          success: true,
          value: appData.store,
        });
      default:
        return mainWindow.webContents.send("localStorage-response", {
          nonce: args.nonce,
          success: false,
          error: new Error("Invalid action: " + args.action),
        });
    }
  });

  // IPC Events (Discord RPC)
  ipcMain.on("getOpenSockets", () => {
    mainWindow.webContents.send("getOpenSockets-response", {
      success: true,
      ports: allSockets,
    });
  });

  ipcMain.on("login", (event, args) => {
    const { clientId, socketId, nonce } = args;
    if (clientRPC.transports.get(socketId)) {
      mainWindow.webContents.send(`login-response-${nonce}`, {
        success: false,
        error: new Error("Already logged in"),
      });
    } else {
      clientRPC
        .login({ clientId, ipcId: socketId })
        .then((trans) => {
          mainWindow.webContents.send(`login-response-${nonce}`, {
            success: true,
            user: trans.user,
            ipcId: trans.ipcId,
            application: trans.application,
          });
        })
        .catch((err) => {
          mainWindow.webContents.send(`login-response-${nonce}`, {
            success: false,
            error: err,
          });
        });
    }
  });

  ipcMain.on("getCurrentUser", (event, args) => {
    const { socketId, nonce } = args;
    const trans = clientRPC.transports.get(socketId);
    if (!trans) {
      return mainWindow.webContents.send(`getCurrentUser-response-${nonce}`, {
        success: false,
        error: new Error("Not logged in"),
      });
    }
    return mainWindow.webContents.send(`getCurrentUser-response-${nonce}`, {
      success: true,
      activity: trans.getActivity(),
      ipcId: trans.ipcId,
      application: trans.application,
      user: trans.user,
    });
  });

  ipcMain.on("setActivity", (event, args) => {
    const { activity, socketId, nonce } = args;
    const trans = clientRPC.transports.get(socketId);
    if (!trans) {
      return mainWindow.webContents.send(`setActivity-response-${nonce}`, {
        success: false,
        error: new Error("Not logged in"),
      });
    }
    trans
      .setActivity(activity)
      .then(() => {
        return mainWindow.webContents.send(`setActivity-response-${nonce}`, {
          success: true,
          ipcId: trans.ipcId,
          activity: trans.getActivity(),
        });
      })
      .catch((err) => {
        return mainWindow.webContents.send(`setActivity-response-${nonce}`, {
          success: false,
          error: err,
          ipcId: trans.ipcId,
        });
      });
  });

  ipcMain.on("clearActivity", (event, args) => {
    const { socketId, nonce } = args;
    const trans = clientRPC.transports.get(socketId);
    if (!trans) {
      return mainWindow.webContents.send(`clearActivity-response-${nonce}`, {
        success: false,
        error: new Error("Not logged in"),
      });
    }
    trans
      .clearActivity()
      .then(() => {
        mainWindow.webContents.send(`clearActivity-response-${nonce}`, {
          success: true,
          activity: null,
          ipcId: trans.ipcId,
        });
      })
      .catch((err) => {
        mainWindow.webContents.send(`clearActivity-response-${nonce}`, {
          success: false,
          error: err,
          ipcId: trans.ipcId,
        });
      });
  });

  ipcMain.on("logout", async (event, args) => {
    const { socketId, nonce } = args;
    const trans = clientRPC.transports.get(socketId);
    if (!trans) {
      return mainWindow.webContents.send(`logout-response-${nonce}`, {
        success: false,
        error: new Error("Not logged in"),
      });
    }
    await trans.close();
    mainWindow.webContents.send(`logout-response-${nonce}`, {
      success: true,
      user: null,
      ipcId: trans.ipcId,
    });
    clientRPC.transports.delete(socketId);
  });

  ipcMain.on("getDiscordAppName", (event, args) => {
    const { socketId, nonce } = args;
    const trans = clientRPC.transports.get(socketId);
    if (!trans) {
      return mainWindow.webContents.send(
        `getDiscordAppName-response-${nonce}`,
        {
          success: false,
          error: new Error("Not logged in"),
        }
      );
    }
    mainWindow.webContents.send(`getDiscordAppName-response-${nonce}`, {
      success: true,
      discord: getDiscordAppFromAPI(trans.config.api_endpoint),
      ipcId: trans.ipcId,
    });
  });
}

app.whenReady().then(() => {
  ElectronDevtool.installExtension(ElectronDevtool.REACT_DEVELOPER_TOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true,
    },
  })
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err))
    .finally(createWindow);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  log.info("App closing...");
});
