const {shell} = require('electron');
const {AbstractHastePackage, HasteRowItem} = require('haste-sdk');
const skullIco = 'packages/Files/skull.png';


function randomStr() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 100; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

class Files extends AbstractHastePackage
{

    constructor(Haste){
        super();
        this.packageName = 'Files';
        this.haste       = new Haste(this.packageName, 'global');
        this.icon        = 'skull.png';

        // for (let i = 0; i < 100000; i++) {
        //     this.insert(randomStr());
        // }
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

    search(value){
        let startTime = Date.now();
        let res = this.haste.fuzzySearch(value).orderBy('score').desc().go()
            .then((data) => {
                console.log('returned', data);
                console.log('time:', (Date.now() - startTime));
            })
            .catch((data) => {
                console.log('error', data);
            });

        let newSearch = [{title: value, icon: skullIco, d:'files', t: 'Files', path: value}];
        if (res.length > 0 && res[0].path === value) {
          return res
        }
        return newSearch.concat(res)
    }

}
module.exports = Files;

