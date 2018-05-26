const {ipcRenderer} = require('electron');
const Path = require('path');
require('@webcomponents/webcomponentsjs/webcomponents-loader.js');
require('./typie-search');

const typieSearch=document.createElement('typie-search');
document.getElementById("app").appendChild(typieSearch);
document.body.style.margin = 0;

// listen for ui events and pass them to the main process
typieSearch.addEventListener('search', e => ipcRenderer.send('search', e.detail));
typieSearch.addEventListener('activate', e => ipcRenderer.send('activate', e.detail));
typieSearch.addEventListener('enterPkg', e => ipcRenderer.send('enterPkg', e.detail));
typieSearch.addEventListener('clear', e => ipcRenderer.send('clear', e.detail));
typieSearch.addEventListener('delete', e => ipcRenderer.send('delete', e.detail));
typieSearch.addEventListener('escape', e => ipcRenderer.send('hide'));
typieSearch.addEventListener('setHeight', e => ipcRenderer.send('setHeight', e.detail));

// listen for main process events and pass them to the ui
ipcRenderer.on('resultList', (event, data) => typieSearch.updateList(data));
ipcRenderer.on('listLoading', (event, res) => typieSearch.listLoading(res.data));
ipcRenderer.on('resultMsg', (event, res) => typieSearch.setResultMsg(res.data));
ipcRenderer.on('injectCss', (event, css) => typieSearch.loadStyles(css));
ipcRenderer.on('changePackage', (event, data) => typieSearch.changePackage(data));
ipcRenderer.on('deleteItem', (event, data) => typieSearch.deleteItem(data));
ipcRenderer.on('focus', (event, data) => typieSearch.focus());
