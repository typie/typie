// just some stuff for playing - feel free to delete
'use strict';
const styles=document.createElement('style');
styles.innerText=`@import url(https://unpkg.com/spectre.css/dist/spectre.min.css);
.empty{display:flex;flex-direction:column;justify-content:center;height:100vh;position:relative}.footer{bottom:0;font-size:13px;left:50%;opacity:.9;position:absolute;transform:translateX(-50%);width:100%}`;

const vueScript=document.createElement('script');
vueScript.setAttribute('type','text/javascript');
vueScript.setAttribute('src','https://unpkg.com/vue');
//vueScript.onload = init;
document.head.appendChild(vueScript);
document.head.appendChild(styles);

const {remote, ipcRenderer} = require('electron');
const round = require('vue-round-filter');
const Vue = require('vue/dist/vue.common');
const MainRendererWindow = require('./MainRendererWindow');


let packages = {};
let win = new MainRendererWindow(remote.getCurrentWindow());

function init(){
    Vue.config.devtools = false;
    Vue.config.productionTip = false;

    let mainVue = new Vue({
        el: 'body',
        data: {
            defaultPackage: 'Files',
            searchVal: '',
            list: [],
            selected: null,
            currentPackage: 'Files',
            total: 0,
            workers: 0,
            pkgs: packages,
            visible: true
        },
        watch: {
            'searchVal': function (val, oldVal) {
                // console.log('searching')
                this.searchIt(val);
            },
            'package': function (val, oldVal) {
                this.list = [];
                this.searchVal = '';
                this.selected = 0;
                this.refreshList();
            },
            'list': function () {
                this.selected = 0;
                win.resize();
            }
        },
        methods: {
            searchIt: function (val) {
                if (val !== '') {
                    // this.selected = null
                    ipcRenderer.send('search', val);
                } else {
                    this.refreshList();
                }
            },
            keyEventTest: function (event) {
                // console.log(event)
            },
            down: function (event) {
                if (this.selected < this.list.length - 1) {
                    this.selected++;
                }
            },
            up: function (event) {
                if (this.selected > 0) {
                    this.selected--;
                }
            },
            enter: function (e) {
                let row = this.list[this.selected];
                if (row !== undefined) {
                    let newPackage = row.title;
                    ipcRenderer.send('activateRow', {
                        newPackage: newPackage,
                        selectedRow: row,
                        pressedKey: e.code
                    })
                }
            },
            click: function (item) {
                ipcRenderer.send('activateRow', {
                    newPackage: item.title,
                    selectedRow: item,
                    pressedKey: 'Click'
                })
                win.focus()
            },
            tab: function (e) {
                this.enter(e)
            },
            backspace: function (event) {
                ipcRenderer.send('backspace', {
                    key: event.key,
                    searchVal: this.searchVal,
                    selectedRow: this.list[this.selected]
                })
            },
            esc: function () {
                this.currentPackage = this.defaultPackage;
                this.searchVal = '';
                win.hide();
            },
            close: function () {
                this.esc()
                // win.close()
            },
            refreshList: function () {
                ipcRenderer.send('refreshList');
            }
        },
        filters: {
            round
        }
        //  components: { App }
    }); // .$mount('#app')

    ipcRenderer.on('resultList', (event, arg) => {
        mainVue.list = arg.reverse()
        if (mainVue.selected === null && mainVue.list.length > 0) {
            mainVue.selected = 0
        }
    });
    ipcRenderer.on('changePackage', (event, arg) => {
        mainVue.currentPackage = arg
        mainVue.searchVal = ''
        mainVue.refreshList()
    });
    ipcRenderer.on('refreshList', (event, arg) => {
        mainVue.list = arg[0]
        mainVue.total = arg[1]
    });
    ipcRenderer.on('console', (event, arg) => {
        console.log(arg)
    });
    win.win.on('blur', (e, cmd) => {
        win.hide()
    });
    win.win.on('show', (e, cmd) => {
        setTimeout(function () {
            mainVue.visible = true;
            document.getElementById('inputField').focus()
        }, 10)
    });
    win.setVue(mainVue);
    win.registerEvents();
    win.registerListeningEvents();
    ipcRenderer.send('refreshList');

    new Vue({
        data: {
            versions: {
                electron: process.versions.electron,
                electronWebpack: require('electron-webpack/package.json').version
            }
        },
        methods: {
            open(b){
                require('electron').shell.openExternal(b)
            }
        },
        template: `<div>
        <div class="icon"></div>
        <div class="search">
            <span class="prefix" v-if="currentPackage!=defaultPackage">{{currentPackage}}</span>
            <input autofocus id="inputField" type="text"
                   v-model="searchVal"
                   @keydown.stop.down.prevent="down"
                   @keydown.stop.up.prevent="up"
                   @keyup.stop.enter.prevent="enter"
                   @keydown.stop.tab.prevent="tab"
                   @keyup.stop.space="tab"
    
                   @keydown.delete="backspace"
                   @keydown.esc="esc"
                   @keydown="keyEventTest"
                   placeholder=""/>
            <div class="close" v-on:click="close">x</div>
        </div>
        <ul class="results" v-bind:class="{empty: !list.length}">
            <li v-for="(index, item) in list" v-bind:class="{selected: selected===index}" v-on:click="click(item)">
                <img v-bind:src="item.icon" v-if="item.icon">
                <div class="texts">
                    <span>{{ item.title }}</span>
                    <p v-if="item.d !== undefined">{{item.d}}</p>
                    <p v-else>{{item.path}}</p>
                </div>
                <div class="score">
                    {{item.score | round}}<span v-if="item.called"> + {{item.called}}</span>
                </div>
            </li>
        </ul>
        <div class="footer">
            <div class="handle">· · · ·</div>
            <div class="status"><span v-if="workers > 0">{{workers}} workers · </span>{{total}} items in Catalog · Haste 1.0
            </div>
        </div>
        </div>`
    }).$mount('#app')}
