const {AbstractHastePackage, HasteRowItem, Haste} = require('haste-sdk');
const {app, shell} = require('electron');
const Path = require('path');

class System extends AbstractHastePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System';
        this.populate();
    }

    activate(item, cb) {
        item.countUp();
        this.insertItem(item);


        shell.openItem(item.getPath());
        this.win.hide();

    }

    activateUponEntry(item) {
        console.log("activate upon entry", item);
        if (item && item.getTitle() === "Configure") {
            this.sendConfigureRows();
        } else {
            this.haste.getRows(15).orderBy('unixTime').asc().go()
                .then(res => this.win.send('resultList', res))
                .catch(e => console.error(e));
        }
    }

    search(searchObj, callback) {
        this.searchWithSubPkgs(searchObj, this.packageName, callback);
    }

    populate(){
        let itemsArray = [];
        itemsArray.push(
            new HasteRowItem("Configure")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Open and edit packages configuration")
                .setIcon(this.icon)
                .setPath('SubPackage|System->Configure'));

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

    sendConfigureRows() {
        let pkgs = Object.keys(global.PackageLoader.packages);
        console.log(pkgs);
        let resultList = [];
        for (let pkg of pkgs) {
            resultList.push(
                new HasteRowItem(pkg)
                    .setDB(this.packageName)
                    .setPackage(this.packageName)
                    .setDescription("Open " + pkg + " configuration")
                    .setIcon(this.icon)
                    .setPath(Path.join(global.Settings.configDir, pkg + ".yml")));
        }
        this.win.send('resultList', {data: resultList, length: resultList.length, err: 0});
    }
}
module.exports = System;