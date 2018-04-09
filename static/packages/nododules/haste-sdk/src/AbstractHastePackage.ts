//const MainWindowController = require("../controllers/MainWindowController");
//const {HastePackageInterface} = require("./models/HastePackageInterface");
import HasteRowItem from "./models/HasteRowItem";
import SearchObject from "./models/SearchObject";
import Haste from "./Haste";
import * as Path from "path";
const defaultIcon = 'pkg-icon.png';

export default class AbstractHastePackage
{
    protected packageData: object;
    protected packageName: string;
    protected packagePath: string;
    protected haste: any;
    protected icon: string;
    protected pkgConfig: any;
    protected win: any;

    constructor(win, config, pkgPath) {
        this.win         = win;
        this.packageData = {name: this.constructor.name, path: __dirname};
        this.packageName = this.constructor.name;
        this.pkgConfig   = config;
        this.packagePath = pkgPath;
        this.icon        = Path.join(this.packagePath, defaultIcon);

        /**
         * @type {Haste}
         */
        this.haste = null;
        this.loadConfig();
    }
    getPackageName(): string {
        return this.packageName;
    }

    getDefaultItem(value, description="", path="", icon=""): HasteRowItem {
        let item = new HasteRowItem();
        item.setTitle(value);
        item.setPath(path ? path : value);
        item.setIcon(icon ? icon : this.icon);
        item.setDescription(description ? description : "");
        return item;
    }

    insert(value, description="", path="", icon="") {
        this.insertItem(this.getDefaultItem(value, description, path, icon));
    }

    insertItem(item: HasteRowItem) {
        this.haste.insert(item).go()
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }

    search(searchObj: SearchObject, callback: Function) {
        this.haste.fuzzySearch(searchObj.value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.log(err));
    }

    activate(rowItem: HasteRowItem, callback: Function) {console.error('No override "action" method found in ' + this.packageName)}
    //remove(rowItem: HasteRowItem, callback: Function) {console.error('No override "remove" method found in ' + this.packageName)}

    activateUponEntry() {
        console.log("No override 'activateUponEntry' method found in " + this.packageName)
    }


    getIcon(icon) {
        return Path.join(this.packagePath, icon);
    }

    loadConfig() {
        //console.log("No override 'loadConfig' method found in " + this.packageName);
        if (this.pkgConfig.shortcut) {
            console.log('registering shortcut ' + this.pkgConfig.shortcut + ' to ' + this.getPackageName());
            this.win.registerKey(this.pkgConfig.shortcut, () => {
                this.win.send('changePackage', [this.getPackageName()]);
                this.activateUponEntry();
            });
        }
    }

    destroy() {
        console.log('destroying the package!');
        console.log('unregister', this.pkgConfig);
        if (this.pkgConfig.shortcut) {
            this.win.unregisterKey(this.pkgConfig.shortcut);
        }
    }
}