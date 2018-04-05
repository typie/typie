
//const MainWindowController = require("../controllers/MainWindowController");
//const {HastePackageInterface} = require("./models/HastePackageInterface");
import HasteRowItem from "./models/HasteRowItem";
import Haste from "./Haste";
const defaultIcon = 'themes/default/images/skull.png';

export default class AbstractHastePackage
{
    protected packageData: object;
    protected packageName: string;
    protected haste: any;
    protected icon: string;
    constructor() {
        this.packageData = {name: this.constructor.name, path: __dirname};
        this.packageName = this.constructor.name;
        this.icon        = defaultIcon;

        /**
         * @type {Haste}
         */
        this.haste = null;
    }
    getPackageName(): string {
        return this.packageName;
    }

    insert(value, description="", path="", icon="") {
        let item = new HasteRowItem();
        item.title = value;
        item.path = path ? path : value;
        item.icon = icon ? icon : this.icon;
        item.description = description ? description : "";
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
}