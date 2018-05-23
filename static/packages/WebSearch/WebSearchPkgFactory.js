const {AbstractTypiePackage, TypieRowItem, Typie, getPath} = require('typie-sdk');
const {app, shell} = require('electron');
const Path = require('path');

class WebSearchPkgFactory extends AbstractTypiePackage {

    constructor(win, config, pkgPath, options){
        super(win, config, pkgPath);
        this.packageName = options.pkgName;
        this.db = options.db;
        this.typie = new Typie(this.packageName, this.db);
        this.iconPath = getPath('packages/WebSearch/icons/');
    }

    search(obj, callback) {
        this.typie.fuzzySearch(obj.value).orderBy('score').desc().go()
            .then(data => {
                if (data.data.length === 0 || data.data[0].score !== 1000) {
                    let firstItem = new TypieRowItem(obj.value);
                    let url = this.pkgConfig.url.replace(/%s/g, obj.value);
                    firstItem.setIcon(this.getIcon(this.packageName));
                    firstItem.setPath(url);
                    firstItem.setDB(this.db);
                    firstItem.setPackage(this.packageName);
                    data.data.unshift(firstItem.toPayload());
                }
                callback(data);
            })
            .catch(err => console.error(err));
    }

    activate(pkgList, item, cb) {
        shell.openExternal(item.getPath());
        this.win.hide();
    }

    getIcon(siteName) {
        return this.pkgConfig.icon ?  this.iconPath + this.pkgConfig.icon : defaultUrlIco
    }
}
module.exports = WebSearchPkgFactory;