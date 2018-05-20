const {AbstractHastePackage, HasteRowItem, Haste} = require('haste-sdk');
const {app, shell} = require('electron');
const Path = require('path');

const SubSystemConfigure = require('./SubSystemConfigure');
const SubSystemShowLogs = require('./SubSystemShowLogs');
const SubSystemInstall = require('./SubSystemInstall');

class System extends AbstractHastePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System';
        this.packages = {
            Configure: new SubSystemConfigure(win, config, pkgPath, this),
            ShowLogs: new SubSystemShowLogs(win, config, pkgPath, this),
            Install: new SubSystemInstall(win, config, pkgPath, this),
        };
        this.populate();
    }

    activate(pkgList, item, cb) {
        console.log(item);
        //shell.openItem(item.getPath());
        //this.win.hide();
    }

    enterPkg(pkgList, item, cb) {
        let asd = new HasteRowItem("Rotem");
            asd.setDB("global");
            asd.setPackage(this.packageName);
            asd.setDescription("Open global log files");
            asd.setIcon(this.icon);
            asd.setPath('Rotem');
            asd.setActions([{type: "openDir", description: "Open Logs Directory"}, {type: "openFiles", description: "Open Logs"}]);

        this.haste.insert(asd, true).go();
    }

    populate(){
        let itemsArray = [];

        itemsArray.push(
            new HasteRowItem("Configure")
                .setDB("global")
                .setPackage(this.packageName)
                .setDescription("Open and edit packages configuration")
                .setIcon(this.icon)
                .setPath('SubPackage|System->Configure'));

        itemsArray.push(
            new HasteRowItem("Install")
                .setDB("global")
                .setPackage(this.packageName)
                .setDescription("Download and install haste packages")
                .setIcon(this.icon)
                .setPath('SubPackage|System->Install'));

        itemsArray.push(
            new HasteRowItem("Show Logs")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Open global log files")
                .setIcon(this.icon)
                .setPath('SubPackage|System->ShowLogs')
                .setActions([{type: "openDir", description: "Open Logs Directory"},
                             {type: "openFiles", description: "Open Logs"}]));

        itemsArray.push(
            new HasteRowItem("Open config file")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Click to open global config file")
                .setIcon(this.icon)
                .setPath(Path.join(app.getPath("userData"), "/config/config.yml")));

        itemsArray.push(
            new HasteRowItem("Open config folder")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Click to open global config file")
                .setIcon(this.icon)
                .setPath(Path.join(app.getPath("userData"), "/config")));

        this.haste.multipleInsert(itemsArray).go()
            .then(data => console.info('System plugin done adding', data))
            .catch(err => console.error('System plugin insert error', err));
    }
}
module.exports = System;