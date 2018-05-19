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
        shell.openItem(LogPath);
        shell.openItem(coreLogPath);
        this.win.hide();
    }
}
module.exports = SubSystemShowLogs;