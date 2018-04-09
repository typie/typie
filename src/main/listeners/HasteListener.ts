import {ipcMain} from 'electron';
import PackageLoader from "../services/PackageLoader";
import {Haste, HasteRowItem, SearchObject} from "haste-sdk";

class HasteListener
{
    constructor(packageLoader: PackageLoader) {
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
                    item.countUp();
                    new Haste('global').insert(item).go().then().catch();
                    packageLoader.getPackage(item.getTitle())
                        .then(pkg => pkg.activateUponEntry())
                        .catch(err => console.error(err));
                } else {
                    packageLoader.getPackage(item.getPackage())
                        .then(pkg => pkg.activate(item, result => event.sender.send('activatedResult', result)))
                        .catch(err => console.error(err));
                }
            } else {
                packageLoader.getPackage(obj.pkgList[0])
                    .then(pkg => pkg.activate(item, result => event.sender.send('activatedResult', result)))
                    .catch(err => console.error(err));
            }
        });
    }
}
export default HasteListener;


function isGlobal(obj) {
    return !(obj.pkgList && obj.pkgList.length > 0);
}

function isPackage(item: HasteRowItem) {
    return item.getDescription() === "Package";
}