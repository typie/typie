import {AbstractTypiePackage, TypieRowItem, TypieCore, getPath} from "typie-sdk";
import {app, shell} from "electron";

import SubTypieConfigure from "./SubTypieConfigure";
import SubTypieInstall from "./SubTypieInstall";
import SubTypieShowLogs from "./SubTypieShowLogs";

export default class Typie extends AbstractTypiePackage {

    constructor(win, config, pkgName) {
        super(win, config, pkgName);
        this.packages = {
            Configure: new SubTypieConfigure(win, config, "Typie->Configure"),
            Install: new SubTypieInstall(win, config, "Typie->Install"),
            ShowLogs: new SubTypieShowLogs(win, config, "Typie->ShowLogs"),
        };
        this.icon = getPath("themes/default/images/icons/icon.png");
        this.populate();
    }

    public activate(pkgList, item, cb) {
        const path = item.getPath();
        switch (path) {
            case "quit":
                app.quit();
                break;
            default:
                shell.openItem(item.getPath());
                break;
        }
        this.win.hide();
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
                .setPath("SubPackage|Typie->Configure"));

        itemsArray.push(
            new TypieRowItem("Install")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Download and install typie packages")
                .setIcon(this.icon)
                .setPath("SubPackage|Typie->Install"));

        itemsArray.push(
            new TypieRowItem("Show Logs")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Open global log files")
                .setIcon(this.icon)
                .setPath("SubPackage|Typie->ShowLogs")
                .setActions([{type: "openDir", description: "Open Logs Directory"},
                        {type: "openFiles", description: "Open Logs"}]));

        itemsArray.push(
            new TypieRowItem("Open Config")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setIcon(this.icon)
                .setPath("SubPackage|Typie->ShowLogs")
                .setActions([{type: "openConfigDir", description: "Open Config Directory"},
                    {type: "openConfigFile", description: "Open Config for editing"}]));

        itemsArray.push(
            new TypieRowItem("Quit / Exit")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Close and exit Typie")
                .setIcon(this.icon)
                .setPath("quit")
                .setActions([{type: "openConfigDir", description: "Open Config Directory"}]));

        this.typie.multipleInsert(itemsArray).go()
            .then(data => console.info("Typie plugin done adding", data))
            .catch(err => console.error("Typie plugin insert error", err));
    }
}
