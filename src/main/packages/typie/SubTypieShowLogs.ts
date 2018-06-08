import {AbstractTypiePackage, AppGlobal, TypieCore} from "typie-sdk";
import {app, shell} from "electron";
import Path from "path";

export default class SubTypieShowLogs extends AbstractTypiePackage {

    private configDir: string = Path.join(app.getPath("userData"), "/config/");
    private configFile: string = Path.join(this.configDir, "config.yml");

    constructor(win, config, pkgPath) {
        super(win, config, pkgPath);
        this.packageName = "Typie->ShowLogs";
        this.db = "Typie";
        this.typie = new TypieCore(this.packageName, "Typie");
        this.icon = "themes/default/images/icons/icon.png";
    }

    public activate(pkgList, item, cb) {
        const LogPath = AppGlobal.get("logPath");
        const coreLogPath = AppGlobal.get("coreLogPath");
        const action = item.getActions()[0].type;
        if (action === "openDir") {
            shell.showItemInFolder(LogPath);
            shell.showItemInFolder(coreLogPath);
        } else if (action === "openFiles") {
            shell.openItem(LogPath);
            shell.openItem(coreLogPath);
        } else if (action === "openConfigDir") {
            shell.showItemInFolder(this.configDir);
        } else if (action === "openConfigFile") {
            shell.openItem(this.configFile);
        }
        this.win.hide();
    }

    public enterPkg(pkgList, item, cb) {
        this.activate(pkgList, item, cb);
    }
}
