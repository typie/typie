import HasteRowItem from "./HasteRowItem";

export interface HastePackageInterface
{
    search(value: string, callback: Function);
    activate(rowItem: HasteRowItem);
    remove(rowItem: HasteRowItem);
}
