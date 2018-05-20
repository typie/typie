const {AbstractTypiePackage, AppGlobal, Typie} = require('typie-sdk');
const {shell} = require('electron');

class SubSystemShowLogs extends AbstractTypiePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System->ShowLogs';
        this.db = "System";
        this.typie = new Typie(this.packageName, "System");
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