const {AbstractHastePackage, HasteRowItem, Haste} = require('haste-sdk');
const {app, shell} = require('electron');
const Path = require('path');
const axios = require('axios');
const download = require('download-git-repo');
const packagesPath = "static/packages/";
const fs = require('fs-extra');


class SubSystemInstall extends AbstractHastePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System->Install';
        this.db = "System";
        this.haste = new Haste(this.packageName, "System");
    }

    activate(pkgList, item, cb) {
        console.log('activate install', item.getPath());
        this.win.send('listLoading', {data: "Downloading Package...", length: 0, err: 0});
        const pkgDir = packagesPath + item.getTitle();
        fs.removeSync(pkgDir);
        download(item.getPath(), pkgDir, (err) => {
            if (err) {
                console.error(err);
            }
            global.PackageLoader.loadPackage(item.getTitle());
            this.win.send('resultList', {data: [], length: 0, err: 0});
        })
    }

    activateUponEntry(pkgList, item) {
        this.win.send('listLoading', {data: "Loading...", length: 0, err: 0});
        axios.get('https://api.github.com/users/rotemgrim/repos')
            .then(res => {
                let repos = res.data;
                let resultList = [];
                for (let repo of repos){
                    resultList.push(
                        new HasteRowItem(repo.name)
                            .setDB(this.db)
                            .setPackage(this.packageName)
                            .setDescription(repo.description)
                            .setIcon(this.icon)
                            .setPath(repo.full_name));
                }
                this.win.send('resultList', {data: resultList, length: resultList.length, err: 0});
                this.haste.multipleInsert(resultList).go().then().catch();
            })
            .catch(e => console.log(e));
    }
}
module.exports = SubSystemInstall;