const {shell, globalShortcut} = require('electron');
const skullIco = 'themes/default/images/skull.png';
const {AbstractHastePackage, HasteRowItem} = require('haste-sdk');
const ioHook = require('iohook');

class Mouse extends AbstractHastePackage
{

    constructor(Haste){
        super();
        this.packageName = 'Mouse';
        this.haste       = new Haste(this.packageName);
        this.icon        = 'skull.png';

        // Example
        this.insert('start listen for keys');
    }

    insert(value) {
        let item = new HasteRowItem();
        item.title = value;
        item.description = "action";
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

    activate() {
        ioHook.on("mousemove", event => {
            console.log(event);
        });
    }
}
module.exports = Mouse;

