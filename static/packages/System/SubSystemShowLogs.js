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
        const LogPath = global["logPath"];
        const coreLogPath = global["coreLogPath"];
        console.log('activate from show logs', logPath);
        shell.openItem(LogPath);
        shell.openItem(coreLogPath);
        this.win.hide();
    }

    activateUponEntry(pkgList, item) {
        this.activate(pkgList, item, () => { return; });
    }
}
module.exports = SubSystemShowLogs;