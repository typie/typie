const {shell, clipboard} = require('electron');
const {AbstractHastePackage, HasteRowItem, SearchObject} = require('haste-sdk');

class Clipboard extends AbstractHastePackage
{

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.win         = win;
        this.packageName = 'Clipboard';
        this.intervalTime  = 250; // milliseconds
        this.watchInterval = null;
        this.startWatch();
    }

    insert(value, description="", path="", icon="") {
        let item = this.getDefaultItem(value, description, path, icon);
        item.setDescription("Activate to Paste");
        this.insertItem(item);
    }

    activate(item, cb) {
        this.win.hide();
        clipboard.writeText(item.getPath());
        this.haste.updateCalled(item).go()
            .then(()=>{
                this.haste.pasteText().go();
            })
            .catch(()=>{});
    }

    activateUponEntry() {
        this.haste.getRows(10).orderBy('unixTime').desc().go()
            .then(res => {
                console.log('retured from unixTime fetch', res);
                this.win.send('resultList', res);
                this.win.show();
            })
            .catch(err => console.log(err));
    }

    startWatch() {
        let lastContent = "";
        this.watchInterval = setInterval(() => {
            let content = clipboard.readText();
            if (lastContent !== content) {
                lastContent = content;
                this.insert(content);
            }
        }, this.intervalTime);
    }

    destroy() {
        super.destroy();
        clearInterval(this.watchInterval);
    }
}
module.exports = Clipboard;

