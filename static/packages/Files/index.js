const {app, shell} = require('electron');
const path = require('path');
const {AbstractHastePackage, HasteRowItem, Haste} = require('haste-sdk');
const skullIco = 'packages/Files/skull.png';

const is = require('electron-is');

let Walker;
let pathList = [];
let fileExtensions = [];

if (is.windows()) {
    Walker = require('./walker.js');
    fileExtensions = ['.exe', '.lnk', '.url', '.mkv', '.mp4'];
    pathList = [
        path.join(app.getPath('home'), 'Desktop'),
        "C:\\Windows\\System32"
    ];
} else if (is.osx()) {
    Walker = require('./walker-osx.js');
    fileExtensions = ['.exe', '.app', '.url'];
    pathList = [
        //path.join(app.getPath('home'), 'Desktop/'),
        path.normalize("/Applications/")
    ];
}



class Files extends AbstractHastePackage
{

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.win         = win;
        this.packageName = 'Files';
        this.db          = 'global';
        this.haste       = new Haste(this.packageName, this.db);
        this.icon        = 'skull.png';

        // Example
        // this.insert('some file');
        // this.insert('another file');

        Walker.run(pathList, fileExtensions, this.haste)
            .then(res => this.insertAll(res))
            .catch(err => console.error(err));

    }

    insertAll(objectsArray) {
        this.haste.multipleInsert(objectsArray).go()
            .then(data => console.info('Files done adding', data))
            .catch((err) => console.error('Files insert error', err));

    }

    search(obj, callback) {
        this.haste.fuzzySearch(obj.value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.error(err));
    }

    activate(pkgList, item, cb) {
        this.haste.updateCalled(item).go()
           .then(()=>{})
           .catch(()=>{});
        console.log("open in files", item);
        shell.openItem(item.getPath());
        this.win.hide();
    }
}
module.exports = Files;

