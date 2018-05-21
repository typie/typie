const {AbstractTypiePackage, AppGlobal, TypieRowItem, Typie} = require('typie-sdk');
const {app, shell} = require('electron');
const Path = require('path');
const axios = require('axios');
const download = require('download-git-repo');
const packagesPath = "static/packages/";
const fs = require('fs-extra');


class SubSystemInstall extends AbstractTypiePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'System->Install';
        this.db = "System";
        this.typie = new Typie(this.packageName, "System");
        this.icon = "themes/default/images/icons/icon.png";
        // Object.assign(this, parent);
    }

    activate(pkgList, item, cb) {
        console.log('activate install', item.getPath());
        this.win.send('listLoading', {data: "Downloading Package...", length: 0, err: 0});
        const pkgDir = Path.join(AppGlobal.get("staticPath"), "packages/" + item.getTitle());
        fs.removeSync(pkgDir);
        download(item.getPath(), pkgDir, (err) => {
            if (err) {
                console.error(err);
            }
            global.PackageLoader.loadPackage(item.getTitle());
            this.win.send('resultList', {data: [], length: 0, err: 0});
        })
    }

    enterPkg(pkgList, item, cb) {
        this.win.send('listLoading', {data: "Loading...", length: 0, err: 0});
        axios.get('https://api.github.com/users/typie/repos')
            .then(res => {
                let repos = res.data;
                let reposToFetch = [];
                for (let repo of repos){
                    if (repo.name.endsWith("-pkg")) {
                        reposToFetch.push(repo);
                    }
                }
                this.fetchAllPkgs(reposToFetch);
            })
            .catch(e => console.log(e));
    }

    async fetchAllPkgs(reposToFetch) {
        let promises = [];
        let availablePkgs = {};
        for (let repo of reposToFetch) {
            const url = "https://raw.githubusercontent.com/"+repo.full_name+"/master/package.json";
            promises.push(axios.get(url));
        }
        axios.all(promises).then((results) => {
            for (let res of results) {
                if (res.status === 200) {
                    availablePkgs[res.data.name] = res.data;
                }
            }
            this.buildResultList(availablePkgs);
        });
    }

    buildResultList(pkgs) {
        let resultList = [];
        for (let pkg in pkgs){
            resultList.push(
                new TypieRowItem(pkgs[pkg].typie.title)
                    .setDB(this.db)
                    .setPackage(this.packageName)
                    .setDescription(pkgs[pkg].typie.description)
                    .setIcon(this.icon)
                    .setPath("typie/" + pkg));
        }
        this.win.send('resultList', {data: resultList, length: resultList.length, err: 0});
        this.typie.multipleInsert(resultList).go().then().catch();
    }
}
module.exports = SubSystemInstall;