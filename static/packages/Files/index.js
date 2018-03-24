const {app, shell} = require('electron');
const path = require('path');
const {AbstractHastePackage, HasteRowItem} = require('haste-sdk');
const skullIco = 'packages/Files/skull.png';
const Walker = require('./walker.js');

const pathList = [
    path.join(app.getPath('home'), 'Desktop'),
    "C:\\Windows\\System32"
];

const fileExtensions = ['.exe', '.lnk', '.url', '.mkv', '.mp4'];



class Files extends AbstractHastePackage
{

    constructor(Haste){
        super();
        this.packageName = 'Files';
        this.db          = 'global';
        this.haste       = new Haste(this.packageName, this.db);
        this.icon        = 'skull.png';

        // Example
        // this.insert('some file');
        // this.insert('another file');

        for (let dir of pathList) {
            Walker.run(dir, fileExtensions, this.haste)
                .then(res => this.insertAll(res));
        }
    }

    insertAll(objectsArray) {
        let countComplete = 0;
        for (let o of objectsArray) {
            let item = new HasteRowItem();
            item.title = o.title;
            item.description = o.description;
            item.icon = o.icon;
            item.path = o.path;
            this.haste.insert(item).go()
                .then(() => {
                    countComplete++;
                    //if (countComplete >= objectsArray.length) {
                        //console.log('done ' + countComplete + ' out of ' + objectsArray.length);
                    //}
                });
        }
    }

    search(value, callback){
        this.haste.fuzzySearch(value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.log(err));
    }

}
module.exports = Files;

