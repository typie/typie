import {ipcMain} from "electron";
import {Haste, HasteRowItem, SearchObject} from "haste-sdk";
import PackageLoader from "../services/PackageLoader";

class HasteListener {
    private packageLoader: PackageLoader;

    constructor(packageLoader: PackageLoader) {

        this.packageLoader = packageLoader;

        ipcMain.on("search", (e: Electron.Event, obj: SearchObject) => {
            if (!isGlobal(obj)) {
                packageLoader.getPackage(obj.pkgList[0])
                    .then(pkg => pkg.search(obj, res => e.sender.send("resultList", res)))
                    .catch(err => console.error(err));
            } else {
                new Haste("global").fuzzySearch(obj.value).go()
                    .then(res => e.sender.send("resultList", res))
                    .catch(err => console.error(err));
            }
        });

        ipcMain.on("activate", (e: Electron.Event, obj) => {
            console.log("activate event", obj);
            if (!obj.item) {
                this.activatePackage(obj.pkgList[0], obj.isTab, obj.pkgList);
                return;
            }
            const item = HasteRowItem.create(obj.item);
            let pkg = obj.pkgList[0];
            if (isGlobal(obj)) {
                if (isPackage(item)) {
                    pkg = item.getTitle();
                } else {
                    pkg = item.getPackage();
                }
            }
            if (isPackage(item)) {
                this.activatePackage(pkg, obj.isTab, obj.pkgList, item);
            } else {
                this.activateItem(e, pkg, obj.isTab, obj.pkgList, item);
            }
        });
    }

    private activatePackage(packageName: string, isTab: boolean, pkgList: string[], item?: HasteRowItem) {
        this.packageLoader.getPackage(packageName)
            .then(pkg => {
                if (isTab === true) {
                    pkg.activateUponTabEntry(pkgList, item);
                } else {
                    if (item) {
                        item.countUp();
                        new Haste("global").insert(item).go().then().catch();
                    }
                    pkg.activateUponEntry(pkgList, item);
                }
            })
            .catch(err => console.error(err));
    }

    private activateItem(e: Electron.Event, packageName: string, isTab: boolean,
                         pkgList: string[], item: HasteRowItem) {
        if (isTab === true) {
            console.log("don't activate -> its a tab operation", item);
        } else {
            this.packageLoader.getPackage(packageName)
                .then(pkg => pkg.activate(item, result => e.sender.send("activatedResult", result)))
                .catch(err => console.error(err));
        }
    }
}
export default HasteListener;

const isGlobal = (obj) => {
    return !(obj.pkgList && obj.pkgList.length > 0);
};

const isPackage = (item: HasteRowItem) => {
    return HasteRowItem.isPackage(item);
};
