// import {createApp} from "vue";
// import App from "/@/App.vue";

// createApp(App).mount("#app");

import "./typie-search";
const typieSearch= document.createElement("typie-search");
document.getElementById("app")?.appendChild(typieSearch);
document.body.style.margin = "0";

declare global {
    interface Window {
        electronAPI: any;
    }
}

// listen for ui events and pass them to the main process
typieSearch.addEventListener("search", (e: CustomEvent) => window.electronAPI.search(e.detail));
typieSearch.addEventListener("activate", (e: CustomEvent) => window.electronAPI.activate(e.detail));
typieSearch.addEventListener("enterPkg", (e: CustomEvent) => window.electronAPI.enterPkg(e.detail));
typieSearch.addEventListener("clear", (e: CustomEvent) => window.electronAPI.clear(e.detail));
typieSearch.addEventListener("delete", (e: CustomEvent) => window.electronAPI.delete(e.detail));
typieSearch.addEventListener("escape", (e: CustomEvent) => window.electronAPI.escape());
typieSearch.addEventListener("setHeight", (e: CustomEvent) => window.electronAPI.setHeight(e.detail));

// // listen for main process events and pass them to the ui

window.electronAPI.resultList((event, data) => typieSearch.updateList(data));
window.electronAPI.listLoading((event, res) => typieSearch.listLoading(res.data));
window.electronAPI.resultMsg((event, res) => typieSearch.setResultMsg(res.data));
window.electronAPI.injectCss((event, css) => typieSearch.loadStyles(css));
window.electronAPI.changePackage((event, data) => typieSearch.changePackage(data));
window.electronAPI.deleteItem((event, data) => typieSearch.deleteItem(data));
window.electronAPI.focus((event, data) => typieSearch.focus());
window.electronAPI.clearValue((event, data) => typieSearch.clearValue());
window.electronAPI.hideCss((event, data) => document.body.style.opacity = "0");
window.electronAPI.showCss((event, data) => document.body.style.opacity = "1");

