
import MainWindowController from "../controllers/MainWindowController";
import {HastePackageInterface} from "./HastePackageInterface";
import HasteRowItem from "./HasteRowItem";

export default class AbstractHastePackage implements HastePackageInterface
{
    public packageData: object;
    public packageName: string;
    protected win: MainWindowController;
    constructor(win) {
        this.packageData = {name: this.constructor.name, path: __dirname};
        this.packageName = this.constructor.name;
        this.win = win;
    }
    search(value: string) {console.error('No override "search" method found in ' + this.packageName)}
    action(rowItem: HasteRowItem) {console.error('No override "action" method found in ' + this.packageName)}
    remove(rowItem: HasteRowItem) {console.error('No override "remove" method found in ' + this.packageName)}
    saveItem(rowItem: HasteRowItem) {console.error('No override "saveItem" method found in ' + this.packageName)}
    saveAll(items: HasteRowItem[]) {console.error('No override "saveAll" method found in ' + this.packageName)}
}
