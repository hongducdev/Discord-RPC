const contextMenu = require("electron-context-menu");

contextMenu({
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: "Copy",
      visible: params.selectionText.trim().length > 0,
      click: () => {
        browserWindow.webContents.copy();
      },
    },
    {
      label: "Paste",
      role: "paste",
      visible: params.editFlags.canPaste,
      click: () => {
        browserWindow.webContents.paste();
      },
    },
  ],
});
