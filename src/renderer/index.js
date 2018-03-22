const path = require('path');

// just some stuff for playing - feel free to delete
'use strict';

// const styles=document.createElement('style');
// styles.innerText=`@import url(https://unpkg.com/spectre.css/dist/spectre.min.css);
// .empty{display:flex;flex-direction:column;justify-content:center;height:100vh;position:relative}.footer{bottom:0;font-size:13px;left:50%;opacity:.9;position:absolute;transform:translateX(-50%);width:100%}`;

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


document.body.appendChild(hasteSearch);


