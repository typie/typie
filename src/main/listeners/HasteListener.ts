import {ipcMain} from "electron";
import {Haste, HasteRowItem, SearchObject} from "haste-sdk";
import PackageLoader from "../services/PackageLoader";
import AbstractHastePackage from "haste-sdk/dist/AbstractHastePackage";

class HasteListener {
    private packageLoader: PackageLoader;

    constructor(packageLoader: PackageLoader) {
        this.packageLoader = packageLoader;
        ipcMain.on("search",    (e: Electron.Event, obj: SearchObject) => this.search(e, obj));
        ipcMain.on("activate",  (e: Electron.Event, obj) => this.activate(e, obj));
        ipcMain.on("enterPkg",  (e: Electron.Event, obj) => this.enterPkg(e, obj));
        ipcMain.on("clear",     (e: Electron.Event, obj) => this.clear(e, obj));
        ipcMain.on("delete",    (e: Electron.Event, obj) => this.remove(e, obj));
    }

    private search(e: Electron.Event, obj: SearchObject) {
        if (!isGlobal(obj)) {
            this.packageLoader.getPackage(obj.pkgList[0])
                .then(pkg => pkg.search(obj, res => e.sender.send("resultList", res)))
                .catch(err => console.error(err));
        } else {
            new Haste("global").fuzzySearch(obj.value).go()
                .then(res => e.sender.send("resultList", res))
                .catch(err => console.error("searching global DB failed", err));
        }
    }

    private activate(e: Electron.Event, obj) {
        const item = HasteRowItem.create(obj.item);
        this.getPackage(obj, item).then(pkg => {
            item.countUp();
            this.update(item);
            try {
                console.log("activate item:" + item.getTitle());
                pkg.activate(obj.pkgList, item, res => e.sender.send("activatedResult", res));
            } catch (err) {
                console.error("error while activating item:", item, err);
            }
        }).catch(err => console.error(err));
    }

    private enterPkg(e: Electron.Event, obj) {
        const item = HasteRowItem.create(obj.item);
        this.getPackage(obj, item)
            .then(pkg => {
                if (obj.countUp === true) {
                    item.countUp();
                    this.update(item);
                }
                try {
                    console.log("entering package: " + item.getTitle());
                    pkg.enterPkg(obj.pkgList, item, res => e.sender.send("activatedResult", res));
                } catch (err) {
                    console.error("error while entering package:" + pkg.getPackageName(), err);
                }
            })
            .catch(err => console.error(err));
    }

    private clear(e: Electron.Event, obj) {
        const pkgName = obj.pkgList[0];
        this.packageLoader.getPackage(pkgName)
            .then(pkg => {
                try {
                    console.log("clear package: " + pkgName);
                    pkg.clear(obj.pkgList, res => e.sender.send("activatedResult", res));
                } catch (err) {
                    console.error("error while clearing package:" + pkgName, err);
                }
            })
            .catch(err => console.error(err));
    }

    private remove(e: Electron.Event, obj) {
        const item = HasteRowItem.create(obj.item);
        const pkgName = obj.pkgList[0];
        this.packageLoader.getPackage(pkgName)
            .then(pkg => {
                try {
                    console.log("remove item: " + item.getTitle());
                    pkg.remove(obj.pkgList, item, res => e.sender.send("activatedResult", res));
                } catch (err) {
                    console.error("error while removing item:" + item.getTitle(), err);
                }
            })
            .catch(err => console.error(err));
    }

    private getPackage(obj, item): Promise<AbstractHastePackage> {
        let pkgName = obj.pkgList[0];
        if (isGlobal(obj)) {
            pkgName = item.getPackage();
        }
        return new Promise((resolve, reject) => {
            this.packageLoader.getPackage(pkgName)
                .then(pkg => resolve(pkg))
                .catch(err => reject(err));
        });
    }

    private update(item: HasteRowItem): void {
        new Haste(item.getDB()).setPkg(item.getPackage()).insert(item).go().then()
            .catch(err => console.warn("did not update item: " + item.getTitle(), err));
    }
}
export default HasteListener;

const isGlobal = (obj) => {
    return !(obj.pkgList && obj.pkgList.length > 0);
};

const isPackage = (item: HasteRowItem) => {
    return HasteRowItem.isPackage(item);
};
