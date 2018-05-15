const {AbstractHastePackage, HasteRowItem, Haste} = require('haste-sdk');
const {app, shell} = require('electron');
const Path = require('path');

class SubSystemShowLogs extends AbstractHastePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System->ShowLogs';
        this.db = "System";
        this.haste = new Haste(this.packageName, "System");
    }

    activate(pkgList, item, cb) {
        const logPath = global["typeLogPath"];
        console.log('activate from show logs', logPath);
        shell.openItem(logPath);
        //shell.openItem(item.getPath());
        this.win.hide();
    }

    activateUponEntry(pkgList, item) {
        const logPath = global["typeLogPath"];
        console.log('activate from show logs', logPath);
        // this.activate(pkgList, item, () => { return; });
    }
}
module.exports = SubSystemShowLogs;