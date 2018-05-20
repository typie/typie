'use strict';
const {ipcRenderer} = require('electron');
const Path = require('path');

const getRelativeLink = function(dir) {
    let relPath = dir; //Path.join(__static, dir);
    if (__dirname.endsWith('asar')) {
        relPath = '../static/' + relPath;
    }
    relPath = relPath.replace(/\\/g, '/');
    console.log(relPath);
    return relPath;
};

const polymer=document.createElement('script');
polymer.setAttribute('type','text/javascript');
polymer.setAttribute('src', getRelativeLink('polymer/bower_components/webcomponentsjs/webcomponents-loader.js'));

const importElement=document.createElement('link');
importElement.setAttribute('rel','import');
importElement.setAttribute('href', getRelativeLink('polymer/typie-search.html'));

const typieSearch=document.createElement('typie-search');

//vueScript.onload = init;
document.head.appendChild(polymer);
document.head.appendChild(importElement);
document.getElementById("app").appendChild(typieSearch);

// listen for ui events and pass them to the main process
typieSearch.addEventListener('search', e => ipcRenderer.send('search', e.detail));
typieSearch.addEventListener('activate', e => ipcRenderer.send('activate', e.detail));
typieSearch.addEventListener('enterPkg', e => ipcRenderer.send('enterPkg', e.detail));
typieSearch.addEventListener('clear', e => ipcRenderer.send('clear', e.detail));
typieSearch.addEventListener('delete', e => ipcRenderer.send('delete', e.detail));
typieSearch.addEventListener('escape', e => ipcRenderer.send('hide'));

// listen for main process events and pass them to the ui
ipcRenderer.on('resultList', (event, data) => typieSearch.updateList(data));
ipcRenderer.on('listLoading', (event, res) => typieSearch.listLoading(res.data));
ipcRenderer.on('injectCss', (event, css) => typieSearch.loadStyles(css));
ipcRenderer.on('changePackage', (event, data) => typieSearch.changePackage(data));
ipcRenderer.on('focus', (event, data) => typieSearch.focus());
