const {AbstractHastePackage, HasteRowItem, Haste} = require('haste-sdk');
const {app, shell} = require('electron');
const Path = require('path');

class SubSystemConfigure extends AbstractHastePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System->Configure';
        this.db = "System";
        this.haste = new Haste(this.packageName, "System");
    }

    activate(pkgList, item, cb) {
        console.log('activate from configure');
        shell.openItem(item.getPath());
        this.win.hide();
    }

    activateUponEntry(pkgList, item) {
        let pkgs = Object.keys(global.PackageLoader.packages);
        let resultList = [];
        for (let pkg of pkgs) {
            resultList.push(
                new HasteRowItem(pkg)
                    .setDB(this.db)
                    .setPackage(this.packageName)
                    .setDescription("Open " + pkg + " configuration")
                    .setIcon(this.icon)
                    .setPath(Path.join(global.Settings.configDir, pkg + ".yml")));
        }
        this.win.send('resultList', {data: resultList, length: resultList.length, err: 0});
        this.haste.multipleInsert(resultList).go().then().catch();
    }
}
module.exports = SubSystemConfigure;