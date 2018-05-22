import {AbstractTypiePackage, TypieRowItem, Typie, getPath} from "typie-sdk";
import {app, shell} from "electron";
import Path from "path";

import SubSystemConfigure from "./SubSystemConfigure";
import SubSystemShowLogs from "./SubSystemShowLogs";
import SubSystemInstall from "./SubSystemInstall";

export default class System extends AbstractTypiePackage {

    constructor(win, config, pkgName) {
        super(win, config, pkgName);
        this.packages = {
            Configure: new SubSystemConfigure(win, config, "System->Configure"),
            Install: new SubSystemInstall(win, config, "System->Install"),
            ShowLogs: new SubSystemShowLogs(win, config, "System->ShowLogs"),
        };
        this.icon = getPath("themes/default/images/icons/icon.png");
        this.populate();
    }

    public activate(pkgList, item, cb) {
        console.log(item);
    }

    // public enterPkg(pkgList, item, cb) {
    //
    // }

    public populate() {
        const itemsArray: any = [];

        itemsArray.push(
            new TypieRowItem("Configure")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Open and edit packages configuration")
                .setIcon(this.icon)
                .setPath("SubPackage|System->Configure"));

        itemsArray.push(
            new TypieRowItem("Install")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Download and install typie packages")
                .setIcon(this.icon)
                .setPath("SubPackage|System->Install"));

        itemsArray.push(
            new TypieRowItem("Show Logs")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Open global log files")
                .setIcon(this.icon)
                .setPath("SubPackage|System->ShowLogs")
                .setActions([{type: "openDir", description: "Open Logs Directory"},
                        {type: "openFiles", description: "Open Logs"}]));

        itemsArray.push(
            new TypieRowItem("Open config file")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Click to open global config file")
                .setIcon(this.icon)
                .setPath(Path.join(app.getPath("userData"), "/config/config.yml")));

        itemsArray.push(
            new TypieRowItem("Open config folder")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Click to open global config file")
                .setIcon(this.icon)
                .setPath(Path.join(app.getPath("userData"), "/config")));

        this.typie.multipleInsert(itemsArray).go()
            .then(data => console.info("System plugin done adding", data))
            .catch(err => console.error("System plugin insert error", err));
    }
}
