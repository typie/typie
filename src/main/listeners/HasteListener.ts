import {ipcMain} from 'electron';
import PackageLoader from "../services/PackageLoader";
import {Haste, HasteRowItem, SearchObject} from "haste-sdk";

class HasteListener
{
    private packageLoader: PackageLoader;

    constructor(packageLoader: PackageLoader) {

        this.packageLoader = packageLoader;

        ipcMain.on('search', (e: Electron.Event, obj: SearchObject) => {
            if (!isGlobal(obj)) {
                packageLoader.getPackage(obj.pkgList[0])
                    .then(pkg => pkg.search(obj, res => e.sender.send('resultList', res)))
                    .catch(err => console.error(err));
            } else {
                new Haste('global').fuzzySearch(obj.value).go()
                    .then(res => e.sender.send('resultList', res))
                    .catch(err => console.error(err))
            }
        });

        ipcMain.on('activate', (e: Electron.Event, obj) => {
            console.log('activate', obj);
            let item = HasteRowItem.create(obj.item);
            if (isGlobal(obj)) {
                if (isPackage(item)) {
                    this.activatePackage(item.getTitle(), item, obj.isTab);
                } else {
                    this.activateItem(e, item.getPackage(), item);
                }
            } else {
                this.activateItem(e, obj.pkgList[0], item);
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

    private activateItem(e: Electron.Event, packageName: string, item: HasteRowItem) {
        this.packageLoader.getPackage(packageName)
            .then(pkg => pkg.activate(item, result => e.sender.send('activatedResult', result)))
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