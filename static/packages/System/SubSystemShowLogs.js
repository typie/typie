const {AbstractHastePackage, AppGlobal, Haste} = require('haste-sdk');
const {shell} = require('electron');

class SubSystemShowLogs extends AbstractHastePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System->ShowLogs';
        this.db = "System";
        this.haste = new Haste(this.packageName, "System");
    }

    activate(pkgList, item, cb) {
        const LogPath = AppGlobal.get("logPath");
        const coreLogPath = AppGlobal.get("coreLogPath");
        shell.openItem(LogPath);
        shell.openItem(coreLogPath);
        this.win.hide();
    }

    enterPkg(pkgList, item, cb) {
        this.activate(pkgList, item, cb);
    }
}
module.exports = SubSystemShowLogs;