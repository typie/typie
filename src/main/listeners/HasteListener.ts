import {ipcMain} from 'electron';
import PackageLoader from "../services/PackageLoader";
import {Haste, HasteRowItem, SearchObject} from "haste-sdk";

class HasteListener
{
    constructor(packageLoader: PackageLoader) {

        this.packageLoader = packageLoader;

        ipcMain.on('search', (event, obj: SearchObject) => {
            if (!isGlobal(obj)) {
                packageLoader.getPackage(obj.pkgList[0])
                    .then(pkg => pkg.search(obj, res => event.sender.send('resultList', res)))
                    .catch(err => console.error(err));
            } else {
                new Haste('global').fuzzySearch(obj.value).go()
                    .then(res => event.sender.send('resultList', res))
                    .catch(err => console.error(err))
            }
        });

        ipcMain.on('activate', (event, obj) => {
            console.log('activate', obj);
            let item = HasteRowItem.create(obj.item);
            if (isGlobal(obj)) {
                if (isPackage(item)) {
                    this.activatePackage(item.getTitle(), item, obj.isTab);
                } else {
                    this.activateItem(item.getPackage(), item);
                }
            } else {
                this.activateItem(obj.pkgList[0], item);
            }
        });
    }

    private activatePackage(packageName: string, item: HasteRowItem, isTab: boolean) {
        this.packageLoader.getPackage(packageName)
            .then(pkg => {
                if (isTab === true) {
                    pkg.activateUponTabEntry();
                } else {
                    item.countUp();
                    new Haste('global').insert(item).go().then().catch();
                    pkg.activateUponEntry();
                }
            })
            .catch(err => console.error(err));
    }

    private activateItem(packageName: string, item: HasteRowItem) {
        this.packageLoader.getPackage(packageName)
            .then(pkg => pkg.activate(item, result => event.sender.send('activatedResult', result)))
            .catch(err => console.error(err));
    }
}
export default HasteListener;


let isGlobal = (obj) => {
    return !(obj.pkgList && obj.pkgList.length > 0);
};

let isPackage = (item: HasteRowItem) => {
    return item.getDescription() === "Package";
};