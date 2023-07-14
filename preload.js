const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  sendApplicationId: (id) => {
    ipcRenderer.send("applicationId", id);
  },
});
