const {shell} = require('electron');
const {AbstractHastePackage, HasteRowItem} = require('haste-sdk');
const skullIco = 'packages/Files/skull.png';


class Files extends AbstractHastePackage
{

    constructor(Haste){
        super();
        this.packageName = 'Files';
        this.db          = 'global';
        this.haste       = new Haste(this.packageName, this.db);
        this.icon        = 'skull.png';

        // for (let i = 0; i < 1000; i++) {
        //     this.insert(randomStr());
        // }
        this.insert('some file');
        this.insert('another file');
    }

    insert(value) {
        let item = new HasteRowItem();
        item.title = value;
        item.description = "file";
        item.icon = skullIco;
        item.path = "";
        let res = this.haste.insert(item).go()
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    }

    search(value, callback){
        this.haste.fuzzySearch(value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.error(err));
    }

}
module.exports = Files;

