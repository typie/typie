
//const MainWindowController = require("../controllers/MainWindowController");
//const {HastePackageInterface} = require("./models/HastePackageInterface");
import HasteRowItem from "./models/HasteRowItem";
import Haste from "./Haste";
import * as Path from "path";
const defaultIcon = 'pkg-icon.png';

export default class AbstractHastePackage
{
    protected packageData: object;
    protected packageName: string;
    protected haste: any;
    protected icon: string;
    constructor(pkgPath) {
        this.packageData = {name: this.constructor.name, path: __dirname};
        this.packageName = this.constructor.name;
        this.icon        = Path.join(pkgPath, defaultIcon);

        /**
         * @type {Haste}
         */
        this.haste = null;
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

    search(value: string, callback: Function) {
        this.haste.fuzzySearch(value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.log(err));
    }

    activate(rowItem: HasteRowItem, callback: Function) {console.error('No override "action" method found in ' + this.packageName)}
    //remove(rowItem: HasteRowItem, callback: Function) {console.error('No override "remove" method found in ' + this.packageName)}

    destroy() {
        console.log('destroying the package!');
    }
}