/**
 * @module preload
 */

// export {sha256sum} from "./nodeCrypto";
// export {versions} from "./versions";


const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // listen for ui events and pass them to the main process
    search: (e: any) => ipcRenderer.send("search", e),
    activate: (e: any) => ipcRenderer.send("activate", e),
    enterPkg: (e: any) => ipcRenderer.send("enterPkg", e),
    clear: (e: any) => ipcRenderer.send("clear", e),
    delete: (e: any) => ipcRenderer.send("delete", e),
    escape: () => ipcRenderer.send("hide"),
    setHeight: (e: any) => ipcRenderer.send("setHeight", e),


    // listen for main process events and pass them to the ui
    resultList: (callback: any) => ipcRenderer.on("resultList", callback),
    listLoading: (callback: any) => ipcRenderer.on("listLoading", callback),
    resultMsg: (callback: any) => ipcRenderer.on("resultMsg", callback),
    injectCss: (callback: any) => ipcRenderer.on("injectCss", callback),
    changePackage: (callback: any) => ipcRenderer.on("changePackage", callback),
    deleteItem: (callback: any) => ipcRenderer.on("deleteItem", callback),
    focus: (callback: any) => ipcRenderer.on("focus", callback),
    clearValue: (callback: any) => ipcRenderer.on("clearValue", callback),
    hideCss: (callback: any) => ipcRenderer.on("hideCss", callback),
    showCss: (callback: any) => ipcRenderer.on("showCss", callback),

    // listen for main process events on notifications
    notification: (callback: any) => ipcRenderer.on("notification", callback),
});
