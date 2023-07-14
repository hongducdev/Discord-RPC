const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  applicationIdAPI: {
    sendApplicationId: (id) => {
      console.log("sendApplicationId", id);
      ipcRenderer.send("applicationId", id);
    },
  },
});
