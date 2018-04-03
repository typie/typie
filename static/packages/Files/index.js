const {app, shell} = require('electron');
const path = require('path');
const {AbstractHastePackage, HasteRowItem} = require('haste-sdk');
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

    constructor(Haste, win){
        super();
        this.win         = win;
        this.packageName = 'Files';
        this.db          = 'global';
        this.haste       = new Haste(this.packageName, this.db);
        this.icon        = 'skull.png';

        // Example
        // this.insert('some file');
        // this.insert('another file');

        //Walker.run(pathList, fileExtensions, this.haste)
        //    .then(res => this.insertAll(res))
        //    .catch(err => console.log(err));

    }

    insertAll(objectsArray) {
        this.haste.multipleInsert(objectsArray).go()
            .then((data) => {
                console.log('multi', data);
            }).catch((err) => console.log('insertAll error', err));

    }

    search(value, callback) {
        this.haste.fuzzySearch(value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.log(err));
    }

    activate(item, cb) {
        // this.haste.pasteText().go()
        //     .then((res)=>console.log(res))
        //     .catch(()=>{});
        this.haste.updateCalled(item).go()
           .then(()=>{})
           .catch(()=>{});
        console.log("open in files", item);
        shell.openItem(item.path);
        this.win.hide();
    }
}
module.exports = Files;

