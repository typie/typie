/**
 * @module preload
 */

export {sha256sum} from "./nodeCrypto";
export {versions} from "./versions";


const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // listen for ui events and pass them to the main process
    search: (e: CustomEvent) => ipcRenderer.send("search", e.detail),
    activate: (e: CustomEvent) => ipcRenderer.send("activate", e.detail),
    enterPkg: (e: CustomEvent) => ipcRenderer.send("enterPkg", e.detail),
    clear: (e: CustomEvent) => ipcRenderer.send("clear", e.detail),
    delete: (e: CustomEvent) => ipcRenderer.send("delete", e.detail),
    escape: (e: CustomEvent) => ipcRenderer.send("hide"),
    setHeight: (e: CustomEvent) => ipcRenderer.send("setHeight", e.detail),


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
});
