import * as Path from "path";
import AppGlobal from "./AppGlobal";
import {getPath, SearchObject, TypieCore, TypieRowItem} from "./index";

const defaultIcon = "pkg-icon.png";

export default class AbstractTypiePackage {
    protected packageData: any;
    protected packageName: string;
    protected icon: string;
    protected typie: TypieCore;
    protected pkgConfig: any;
    protected win: any;
    protected db: string;
    protected packages: any;

    constructor(win, config, pkgName) {
        this.win = win;
        this.packageData = {name: pkgName, path: __dirname};
        this.packageName = pkgName;
        this.db = pkgName;
        this.pkgConfig = config;
        this.icon = Path.join(this.getFilePackagePath(), defaultIcon);
        this.typie = new TypieCore(this.packageName);
        this.packages = {};
        this.loadConfig();
    }

    public getPackageName(): string {
        return this.packageName;
    }

    public getPackagePath(): string {
        return getPath("packages/" + this.packageName + "/");
    }

    public getFilePackagePath(): string {
        return Path.join(AppGlobal.paths().getPackagesPath(), this.packageName);
    }

    public getDefaultItem(value, description = "", path = "", icon = ""): TypieRowItem {
        const item = new TypieRowItem();
        item.setTitle(value);
        item.setPath(path ? path : value);
        item.setIcon(icon ? icon : this.icon);
        item.setDescription(description ? description : "");
        return item;
    }

    public insert(value, description = "", path = "", icon = "") {
        this.insertItem(this.getDefaultItem(value, description, path, icon));
    }

    public insertItem(item: TypieRowItem) {
        this.typie.insert(item).go()
            .then(data => console.log("insertItem", data))
            .catch(err => console.error(err));
    }

    public search(obj: SearchObject, callback: (data) => void) {
        this.typie.fuzzySearch(obj.value).orderBy("score").desc().go()
            .then(data => callback(data))
            .catch(err => console.log(err));
    }

    public activate(pkgList: string[], item: TypieRowItem, callback: (data) => void) {
        console.info('No override "activate" method found in ' + this.packageName);
    }

    public enterPkg(pkgList: string[], item?: TypieRowItem, callback?: (data) => void) {
        this.getFirstRecords(10);
    }

    public clear(pkgList: string[], callback: (data) => void) {
        this.getFirstRecords(10);
    }

    public remove(pkgList: string[], item: TypieRowItem, callback: (data) => void) {
        console.info('No override "remove" method found in ' + this.packageName);
    }

    public getIcon(icon) {
        return Path.join(this.getFilePackagePath(), icon);
    }

    public getFirstRecords(numOfRecords: number = 10) {
        this.typie.getRows(numOfRecords).orderBy("count").desc().go()
            .then(res => this.win.send("resultList", res))
            .catch(e => console.error("error getting first records", e));
    }

    public loadConfig() {
        // console.log("No override 'loadConfig' method found in " + this.packageName);
        if (this.pkgConfig.shortcut) {
            console.log("registering shortcut " + this.pkgConfig.shortcut + " to " + this.getPackageName());
            this.win.registerKey(this.pkgConfig.shortcut, () => {
                this.win.send("changePackage", [this.getPackageName()]);
                this.win.show();
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
}
