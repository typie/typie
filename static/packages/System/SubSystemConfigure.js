const {AbstractTypiePackage, TypieRowItem, Typie} = require('typie-sdk');
const {app, shell} = require('electron');
const Path = require('path');

class SubSystemConfigure extends AbstractTypiePackage {

    constructor(win, config, pkgPath, parent){
        super(win, config, pkgPath);
        this.packageName = 'System->Configure';
        this.db = "System";
        this.typie = new Typie(this.packageName, "System");
        // Object.assign(this, parent);
    }

    activate(pkgList, item, cb) {
        console.log('activate from configure');
        shell.openItem(item.getPath());
        this.win.hide();
    }

    enterPkg(pkgList, item, cb) {
        let pkgs = Object.keys(global.PackageLoader.packages);
        let resultList = [];
        for (let pkg of pkgs) {
            resultList.push(
                new TypieRowItem(pkg)
                    .setDB(this.db)
                    .setPackage(this.packageName)
                    .setDescription("Open " + pkg + " configuration")
                    .setIcon(this.icon)
                    .setPath(Path.join(global.Settings.configDir, pkg + ".yml")));
        }
        this.win.send('resultList', {data: resultList, length: resultList.length, err: 0});
        this.typie.multipleInsert(resultList).go().then().catch();
    }
}
module.exports = SubSystemConfigure;