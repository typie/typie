const {AbstractTypiePackage, AppGlobal, Typie} = require('typie-sdk');
const {shell} = require('electron');

class SubSystemShowLogs extends AbstractTypiePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System->ShowLogs';
        this.db = "System";
        this.typie = new Typie(this.packageName, "System");
        this.icon = "themes/default/images/icons/icon.png";
    }

    activate(pkgList, item, cb) {
        const LogPath = AppGlobal.get("logPath");
        const coreLogPath = AppGlobal.get("coreLogPath");
        const action = item.getActions()[0].type;
        if (action === "openDir") {
            shell.showItemInFolder(LogPath);
            shell.showItemInFolder(coreLogPath);
        } else if (action === "openFiles") {
            shell.openItem(LogPath);
            shell.openItem(coreLogPath);
        }
        this.win.hide();
    }

    enterPkg(pkgList, item, cb) {
        this.activate(pkgList, item, cb);
    }
}
module.exports = SubSystemShowLogs;