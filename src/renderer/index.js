'use strict';
const {remote, ipcRenderer} = require('electron');
const MainRendererWindow = require('./MainRendererWindow');
const polymer=document.createElement('script');
polymer.setAttribute('type','text/javascript');
polymer.setAttribute('src','polymer/bower_components/webcomponentsjs/webcomponents-loader.js');

const importElement=document.createElement('link');
importElement.setAttribute('rel','import');
importElement.setAttribute('href','polymer/haste-search.html');

const hasteSearch=document.createElement('haste-search');

//vueScript.onload = init;
document.head.appendChild(polymer);
document.head.appendChild(importElement);
document.getElementById("app").appendChild(hasteSearch);

let win = new MainRendererWindow(remote.getCurrentWindow());

hasteSearch.addEventListener('search', (e) => {
    let payload = e.detail;
    ipcRenderer.send('search', {value: payload.val, pkgList: payload.pkgList});
});
hasteSearch.addEventListener('activate', (e) => {
    let payload = e.detail;
    ipcRenderer.send('activate', payload);
});
hasteSearch.addEventListener('escape', (e) => {
    ipcRenderer.send('hide');
});
ipcRenderer.on('resultList', (event, data) => {
    hasteSearch.updateList(data);
});
ipcRenderer.on('injectCss', (event, css) => {
    hasteSearch.removeStyles();
    hasteSearch.loadStyles(css);
});
ipcRenderer.on('changePackage', (event, data) => {
    hasteSearch.changePackage(data);
});
ipcRenderer.on('focus', (event, data) => {
    hasteSearch.focus();
});