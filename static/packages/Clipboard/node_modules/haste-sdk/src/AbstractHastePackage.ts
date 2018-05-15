import * as Path from "path";

import {getPath, Haste, HasteRowItem, SearchObject} from "./index";

const defaultIcon = "pkg-icon.png";

export default class AbstractHastePackage {
    protected packageData: any;
    protected packageName: string;
    protected packagePath: string;
    protected icon: string;
    protected haste: Haste;
    protected pkgConfig: any;
    protected win: any;
    protected subPackages: any;

    constructor(win, config, pkgPath) {
        this.win = win;
        this.packageData = {name: this.constructor.name, path: __dirname};
        this.packageName = this.constructor.name;
        this.pkgConfig = config;
        this.packagePath = pkgPath;
        this.icon = getPath(pkgPath + defaultIcon);
        this.haste = new Haste(this.packageName);
        this.subPackages = {};
        this.loadConfig();
    }

    public getPackageName(): string {
        return this.packageName;
    }

    public getDefaultItem(value, description = "", path = "", icon = ""): HasteRowItem {
        const item = new HasteRowItem();
        item.setTitle(value);
        item.setPath(path ? path : value);
        item.setIcon(icon ? icon : this.icon);
        item.setDescription(description ? description : "");
        return item;
    }

    public insert(value, description = "", path = "", icon = "") {
        this.insertItem(this.getDefaultItem(value, description, path, icon));
    }

    public insertItem(item: HasteRowItem) {
        this.haste.insert(item).go()
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }

    public search(obj: SearchObject, callback: (data) => void) {
        this.runSearch(obj, callback);
    }

    public searchWithSubPkgs(obj: SearchObject, defaultDb: string, callback: (data) => void) {
        if (obj.pkgList.length > 1) {
            const pkg = obj.pkgList.join("->");
            console.log("search in pkg: " + pkg);
            this.haste.setPkg(pkg).setDB(this.packageName);
            this.runSearch(obj, callback);
        } else {
            this.haste.setPkg(this.packageName).setDB(defaultDb);
            this.runSearch(obj, callback);
        }
    }

    public activate(pkgList: string[], rowItem: HasteRowItem, callback: (data) => void) {
        this.runActivate(pkgList, rowItem, callback);
    }

    public activateWithSubPkgs(pkgList: string[], rowItem: HasteRowItem, callback: (data) => void) {
        if (pkgList && pkgList.length > 1) {
            const subPkgName = "Sub" + pkgList.join("");
            try {
                this.subPackages[subPkgName].activate(pkgList, rowItem, callback);
            } catch (e) {
                console.error("no sub package found for '" + subPkgName + "'", Object.keys(this.subPackages), e);
            }
            return;
        } else {
            this.runActivate(pkgList, rowItem, callback);
        }
    }
    // remove(rowItem: HasteRowItem, callback: Function) {
    // console.error('No override "remove" method found in ' + this.packageName)
    // }

    public activateUponEntry(pkgList?: string[], item?: HasteRowItem) {
        this.runActivateUponEntry(pkgList, item);
    }

    public activateUponTabEntry(pkgList?: string[], item?: HasteRowItem) {
        this.runActivateUponTabEntry(pkgList, item);
    }

    public activateUponEntryWithSubPkgs(pkgList?: string[], item?: HasteRowItem, cb?: () => void) {
        if (pkgList && pkgList.length > 1) {
            const subPkgName = "Sub" + pkgList.join("");
            try {
                this.subPackages[subPkgName].activateUponTabEntry(pkgList, item);
            } catch (e) {
                console.error("no sub package found upon entry '" + subPkgName + "'", Object.keys(this.subPackages), e);
            }
            return;
        } else if (pkgList && pkgList.length === 0) {
            this.haste.setDB(this.packageName).setPkg(this.packageName);
        } else if (pkgList && pkgList.length === 1) {
            this.haste.setDB(this.packageName).setPkg(pkgList[0]);
        }
        if (cb) {
            cb();
        } else {
            this.getFirstRecords(10);
        }
    }

    public getIcon(icon) {
        return Path.join(this.packagePath, icon);
    }

    public getFirstRecords(numOfRecords: number = 10) {
        this.haste.getRows(numOfRecords).orderBy("unixTime").asc().go()
            .then(res => this.win.send("resultList", res))
            .catch(e => console.error("error getting first records", e));
    }

    public loadConfig() {
        // console.log("No override 'loadConfig' method found in " + this.packageName);
        if (this.pkgConfig.shortcut) {
            console.log("registering shortcut " + this.pkgConfig.shortcut + " to " + this.getPackageName());
            this.win.registerKey(this.pkgConfig.shortcut, () => {
                this.win.send("changePackage", [this.getPackageName()]);
                this.activateUponTabEntry();
            });
        }
    }

    public destroy() {
        console.log("destroying the package!");
        console.log("unregister", this.pkgConfig);
        if (this.pkgConfig.shortcut) {
            this.win.unregisterKey(this.pkgConfig.shortcut);
        }
    }

    protected runSearch(obj: SearchObject, callback: (data) => void) {
        if (obj.value.length === 0) {
            this.activateUponTabEntry(obj.pkgList);
        } else {
            this.haste.fuzzySearch(obj.value).orderBy("score").desc().go()
                .then(data => callback(data))
                .catch(err => console.log(err));
        }
    }

    protected runActivate(pkgList: string[], rowItem: HasteRowItem, callback: (data) => void) {
        console.error("No override 'action' method found in " + this.packageName, callback);
    }

    protected runActivateUponEntry(pkgList?: string[], item?: HasteRowItem) {
        console.log("No override 'activateUponEntry' method found in " + this.packageName);
    }

    protected runActivateUponTabEntry(pkgList?: string[], item?: HasteRowItem) {
        console.log("No override 'activateUponTabEntry' method found in " + this.packageName);
        this.activateUponEntry(pkgList, item);
    }
}
