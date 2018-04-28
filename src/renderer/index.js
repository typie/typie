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
importElement.setAttribute('href', getRelativeLink('polymer/haste-search.html'));

const hasteSearch=document.createElement('haste-search');

//vueScript.onload = init;
document.head.appendChild(polymer);
document.head.appendChild(importElement);
document.getElementById("app").appendChild(hasteSearch);

hasteSearch.addEventListener('search', (e) => {
    let payload = e.detail;
    ipcRenderer.send('search', {value: payload.val, pkgList: payload.pkgList});
});
hasteSearch.addEventListener('activate', (e) => {
    let payload = e.detail;
    ipcRenderer.send('activate', payload);
});
hasteSearch.addEventListener('escape', (e) => ipcRenderer.send('hide'));
ipcRenderer.on('resultList', (event, data) => hasteSearch.updateList(data));
ipcRenderer.on('listLoading', (event, res) => hasteSearch.listLoading(res.data));
ipcRenderer.on('injectCss', (event, css) => hasteSearch.loadStyles(css));
ipcRenderer.on('changePackage', (event, data) => hasteSearch.changePackage(data));
ipcRenderer.on('focus', (event, data) => hasteSearch.focus());
