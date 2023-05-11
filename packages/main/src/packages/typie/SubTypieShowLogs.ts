import {AbstractTypiePackage, AppGlobal, TypieCore} from "/@/services/sdk/index";
import {app, shell} from "electron";
import Path from "path";

export default class SubTypieShowLogs extends AbstractTypiePackage {

    private configDir: string = AppGlobal.paths().getConfigDir();
    private configFile: string = AppGlobal.paths().getMainConfigPath();

    constructor(win, config, pkgPath) {
        super(win, config, pkgPath);
        this.packageName = "Typie->ShowLogs";
        this.db = "Typie";
        this.typie = new TypieCore(this.packageName, "Typie");
        this.icon = "themes/default/images/icons/icon.png";
    }

    public activate(pkgList, item, cb) {
        const LogPath = AppGlobal.paths().getLogPath();
        const coreLogPath = Path.join(AppGlobal.paths().getLogsDir(), "go-logger.log");
        const action = item.getActions()[0].type;
        if (action === "openDir") {
            shell.showItemInFolder(LogPath);
            shell.showItemInFolder(coreLogPath);
        } else if (action === "openFiles") {
            shell.openPath(LogPath);
            shell.openPath(coreLogPath);
        } else if (action === "openConfigDir") {
            shell.showItemInFolder(this.configDir);
        } else if (action === "openConfigFile") {
            shell.openPath(this.configFile);
        }
        this.win.hide();
    }

    public enterPkg(pkgList, item, cb) {
        this.activate(pkgList, item, cb);
    }
}
