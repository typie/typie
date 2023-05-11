import {ipcMain} from "electron";
import type { SearchObject} from "/@/services/sdk/index";
import {TypieCore, TypieRowItem, getPath} from "/@/services/sdk/index";
import type PackageLoader from "../services/PackageLoader";
import type AbstractTypiePackage from "/@/services/sdk/index/AbstractTypiePackage";
import Calculator from "../packages/calculator/Calculator";

export default class TypieListener {

    private static sendList(e, obj, res) {
        e.sender.send("resultList", res);
    }
    private static isGlobal(obj) { return !(obj.pkgList && obj.pkgList.length > 0); }
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
        if (!TypieListener.isGlobal(obj)) {
            this.packageLoader.getPackageFromList(obj.pkgList)
                .then(pkg => pkg.search(obj, res => TypieListener.sendList(e, obj, res)))
                .catch(err => console.error("searching package failed", obj.pkgList, err));
        } else {
            new TypieCore("global").fuzzySearch(obj.value).go()
                .then(res => {
                    Calculator.tryMathExpression(res, obj);
                    TypieListener.sendList(e, obj, res);
                })
                .catch(err => console.error("searching global DB failed", err));
        }
    }

    private activate(e: Electron.Event, obj) {
        const item = TypieRowItem.create(obj.item);
        this.getPackage(obj, item).then(pkg => {
            if (item.getDB() !== "null") {
                item.countUp();
                this.update(item);
            }
            try {
                console.info("activate item: " + item.getTitle());
                pkg.activate(obj.pkgList, item, res => TypieListener.sendList(e, obj, res));
            } catch (err) {
                console.error("error while activating item: ", item, err);
            }
        }).catch(err => console.warn(err));
    }

    private enterPkg(e: Electron.Event, obj) {
        if (!obj || !obj.item) {
            this.packageLoader.getPackage(obj.pkgList).then(pkg => {
                pkg.enterPkg(obj.pkgList, undefined, res => TypieListener.sendList(e, obj, res));
            }).catch(er => console.error(er));
            return;
        }
        const item = TypieRowItem.create(obj.item);
        this.getPackage(obj, item)
            .then(pkg => {
                if (obj.countUp === true) {
                    item.countUp();
                    this.update(item);
                }
                try {
                    console.info("entering package: " + item.getTitle());
                    pkg.enterPkg(obj.pkgList, item, res => TypieListener.sendList(e, obj, res));
                } catch (err) {
                    console.error("error while entering package: ", pkg, err);
                }
            })
            .catch(err => console.warn(err));
    }

    private clear(e: Electron.Event, obj) {
        this.packageLoader.getPackageFromList(obj.pkgList)
            .then(pkg => {
                try {
                    console.info("clear package: " + pkg.getPackageName());
                    pkg.clear(obj.pkgList, res => TypieListener.sendList(e, obj, res));
                } catch (err) {
                    console.error("error while clearing package: " + pkg.getPackageName(), err);
                }
            })
            .catch(err => console.warn(err));
    }

    private remove(e: Electron.Event, obj) {
        if (!obj || !obj.item) {
            return;
        }
        const item = TypieRowItem.create(obj.item);
        this.getPackage(obj, item)
            .then(pkg => {
                try {
                    console.info("remove item: " + item.getTitle());
                    pkg.remove(obj.pkgList, item, res => TypieListener.sendList(e, obj, res));
                } catch (err) {
                    console.error("error while removing item: " + item.getTitle(), err);
                }
            })
            .catch(err => console.warn(err));
    }

    private getPackage(obj, item): Promise<AbstractTypiePackage> {
        let pkgList = obj.pkgList;
        if (TypieListener.isGlobal(obj)) {
            pkgList = [item.getPackage()];
        }
        return new Promise((resolve, reject) => {
            this.packageLoader.getPackageFromList(pkgList)
                .then(pkg => resolve(pkg))
                .catch(err => reject(err));
        });
    }

    private update(item: TypieRowItem): void {
        new TypieCore(item.getDB()).setPkg(item.getPackage()).insert(item).go().then()
            .catch(err => console.warn("did not update item: " + item.getTitle(), err));
    }
}
