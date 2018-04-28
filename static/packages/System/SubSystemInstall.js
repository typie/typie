const {AbstractHastePackage, HasteRowItem, Haste} = require('haste-sdk');
const {app, shell} = require('electron');
const Path = require('path');
const axios = require('axios');

class SubSystemInstall extends AbstractHastePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System->Install';
        this.db = "System";
        this.haste = new Haste(this.packageName, "System");
    }

    activate(item, cb) {
        item.countUp();
        this.insertItem(item);
        shell.openItem(item.getPath());
        this.win.hide();
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
                            .setPath(repo.url));
                }
                this.win.send('resultList', {data: resultList, length: resultList.length, err: 0});
                this.haste.multipleInsert(resultList).go().then().catch();
            })
            .catch(e => console.log(e));
    }
}
module.exports = SubSystemInstall;