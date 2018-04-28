const {AbstractHastePackage, HasteRowItem, SearchObject, getPath} = require('haste-sdk');
const {shell} = require('electron');
const Path = require('path');
const ini = require('node-ini');

class WebSearch extends AbstractHastePackage
{

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.cfg = ini.parseSync(Path.join(__dirname, 'WebSearch.ini'));
        this.iconPath = getPath(this.packagePath + 'icons/');
        this.populate();
    }

    search(obj, callback) {
        console.log('got to search', obj);
        if (obj.pkgList.length > 1) {
            let pkg = obj.pkgList.join('->');
            this.haste.setPkg(pkg).setDB('WebSearch');
            this.haste.fuzzySearch(obj.value).orderBy('score').desc().go()
                .then(data => {
                    if (data.data.length === 0 || data.data[0].score !== 1000) {
                        let firstItem = new HasteRowItem(obj.value);
                        let url = this.cfg[obj.pkgList[1]].url.replace(/%s/g, obj.value);
                        firstItem.setIcon(this.getIcon(obj.pkgList[1]));
                        firstItem.setPath(url);
                        data.data.unshift(firstItem.toPayload());
                    }
                    callback(data);
                })
                .catch(err => console.error(err));
        } else {
            this.haste.setPkg('WebSearch').setDB('global');
            super.search(obj, callback);
        }
    }

    activate(pkgList, item, cb) {
        item.countUp();
        this.insertItem(item);
        if (item.getPackage() !== 'WebSearch') {
            shell.openItem(item.getPath());
            this.win.hide();
        }
    }

    populate(){
        let itemsArray = [];
        Object.keys(this.cfg).map((siteName, i) => {
            let item = new HasteRowItem(siteName + ': WebSearch');
            item.setIcon(this.getIcon(siteName));
            item.setDescription(this.cfg[siteName].url);
            item.setPackage('WebSearch');
            item.setPath('SubPackage|WebSearch->'+siteName);
            item.setDB('global');
            itemsArray.push(item);
        });
        this.haste.multipleInsert(itemsArray).go()
            .then(data => console.info('WebSearch done adding', data))
            .catch(err => console.error('WebSearch insert error', err));
    }

    getIcon(siteName) {
        return this.cfg[siteName].icon ?  this.iconPath + this.cfg[siteName].icon : defaultUrlIco
    }
}
module.exports = WebSearch;


const defaultUrlIco = 'data:image/png;base64,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'