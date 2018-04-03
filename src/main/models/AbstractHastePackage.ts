
import MainWindowController from "../controllers/MainWindowController";
import {HastePackageInterface} from "./HastePackageInterface";
import HasteRowItem from "./HasteRowItem";

export default class AbstractHastePackage implements HastePackageInterface
{
    protected packageData: object;
    protected packageName: string;
    constructor() {
        this.packageData = {name: this.constructor.name, path: __dirname};
        this.packageName = this.constructor.name;
    }
    getPackageName(): string {
        return this.packageName;
    }
    search(value: string, callback: Function) {console.error('No override "search" method found in ' + this.packageName)}
    activate(rowItem: HasteRowItem, callback: Function) {console.error('No override "action" method found in ' + this.packageName)}
    //remove(rowItem: HasteRowItem, callback: Function) {console.error('No override "remove" method found in ' + this.packageName)}
}
