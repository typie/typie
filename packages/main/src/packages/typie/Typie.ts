import {AbstractTypiePackage, AppGlobal, TypieRowItem, TypieCore, getPath} from "/@/services/sdk/index";
import {app, shell} from "electron";
import Path from "path";
import SubTypieConfigure from "./SubTypieConfigure";
import SubTypieInstall from "./SubTypieInstall";
import SubTypieShowLogs from "./SubTypieShowLogs";
import dgram from "node:dgram";

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
            case "test-notification":
                demoNotify();
                break;
            default:
                shell.openPath(item.getPath());
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
                .setActions([{type: "openDir", description: "Show Directory"},
                        {type: "openFiles", description: "Open Logs"}]));

        itemsArray.push(
            new TypieRowItem("Open Config")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setIcon(this.icon)
                .setPath("SubPackage|Typie->ShowLogs")
                .setActions([{type: "openConfigDir", description: "Show Directory"},
                    {type: "openConfigFile", description: "Edit config"}]));

        itemsArray.push(
            new TypieRowItem("Quit / Exit")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Close and exit Typie")
                .setIcon(this.icon)
                .setPath("quit"));

        itemsArray.push(
            new TypieRowItem("Edit Theme")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Close and exit Typie")
                .setIcon(this.icon)
                .setPath(AppGlobal.paths().getSelectedThemePath()));

        itemsArray.push(
            new TypieRowItem("Test notification")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("send demo notification")
                .setIcon(this.icon)
                .setPath("test-notification"));

        this.typie.multipleInsert(itemsArray).go()
            .then(data => console.info("Typie plugin done adding", data))
            .catch(err => console.error("Typie plugin insert error", err));
    }
}

function demoNotify() {
    const payload = Buffer.from(JSON.stringify({
        msg: "<span><span style='color: #ea8484'>Typie</span> <span style='color: #18b195'>is ready</span></span> ✅",
    }));
    const client = dgram.createSocket("udp4");
    client.send(payload, 41234, "localhost", function(err, bytes) {
        client.close();
    });
}
