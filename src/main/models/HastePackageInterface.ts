import HasteRowItem from "./HasteRowItem";

export interface HastePackageInterface
{
    search(value: string, callback: Function);
    action(rowItem: HasteRowItem);
    remove(rowItem: HasteRowItem);
    saveItem(rowItem: HasteRowItem);
    saveAll(items: HasteRowItem[]);
}
