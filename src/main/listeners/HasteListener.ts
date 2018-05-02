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
                    .catch(err => console.error("searching global DB failed", err));
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
        console.log("activating package: " + packageName);
        this.packageLoader.getPackage(packageName)
            .then(pkg => {
                if (isTab === true) {
                    pkg.activateUponTabEntry(pkgList, item);
                } else {
                    console.log("pkg activation", item);
                    if (item) {
                        item.countUp();
                        console.log("count pkg item up", item);
                        new Haste(item.getDB()).setPkg(item.getPackage()).insert(item).go().then().catch();
                    }
                    pkg.activateUponEntry(pkgList, item);
                }
            })
            .catch(err => console.error(err));
    }

    private activateItem(e: Electron.Event, packageName: string, isTab: boolean,
                         pkgList: string[], item: HasteRowItem) {
        console.log("activating item in: " + packageName);
        if (isTab === true) {
            console.log("don't activate -> its a tab operation", item);
        } else {
            this.packageLoader.getPackage(packageName)
                .then(pkg => {
                    pkg.activate(pkgList, item, result => e.sender.send("activatedResult", result));
                    item.countUp();
                    new Haste(item.getDB()).setPkg(item.getPackage()).insert(item).go()
                        .then(res => console.log("updated item countUp: " + item.getTitle() ))
                        .catch(e => console.error("could not update item countUp: " + item.getTitle(), e));
                })
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
