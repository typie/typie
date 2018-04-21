const {AbstractHastePackage, HasteRowItem, Haste} = require('haste-sdk');
const {app, shell} = require('electron');
const Path = require('path');

const SubSystemConfigure = require('./SubSystemConfigure');

class System extends AbstractHastePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System';
        this.subPackages = {
            SubSystemConfigure: new SubSystemConfigure(win, config, pkgPath)
        };
        this.populate();
    }

    activate(item, cb) {
        item.countUp();
        this.insertItem(item);
        shell.openItem(item.getPath());
        this.win.hide();
    }

    activateUponEntry(pkgList, item) {
        console.log("activate upon entry in system", pkgList, item);
        if (pkgList && pkgList.length > 1) {
            let subPkgName = "Sub" + pkgList.join("");
            try {
                this.subPackages[subPkgName].activateUponTabEntry(pkgList, item);
            } catch (e) {
                console.error("no sub package found for '" + subPkgName + "'");
            }
            return;
        } else if (pkgList && pkgList.length === 0) {
            this.haste.setDB(this.packageName).setPkg(this.packageName);
        } else if (pkgList && pkgList.length === 1) {
            this.haste.setDB(this.packageName).setPkg(pkgList[0]);
        }
        this.haste.getRows(15).orderBy('unixTime').asc().go()
            .then(res => this.win.send('resultList', res))
            .catch(e => console.error(e));
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
            new HasteRowItem("Install")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Download and install haste packages")
                .setIcon(this.icon)
                .setPath('SubPackage|System->Install'));

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