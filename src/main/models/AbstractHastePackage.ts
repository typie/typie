
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
    search(value: string) {console.error('No override "search" method found in ' + this.packageName)}
    action(rowItem: HasteRowItem) {console.error('No override "action" method found in ' + this.packageName)}
    remove(rowItem: HasteRowItem) {console.error('No override "remove" method found in ' + this.packageName)}
    saveItem(rowItem: HasteRowItem) {console.error('No override "saveItem" method found in ' + this.packageName)}
    saveAll(items: HasteRowItem[]) {console.error('No override "saveAll" method found in ' + this.packageName)}
}
