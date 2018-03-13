import HasteRowItem from "./HasteRowItem";

export interface HastePackageInterface
{
    search(value: string);
    action(rowItem: HasteRowItem);
    remove(rowItem: HasteRowItem);
    saveItem(rowItem: HasteRowItem);
    saveAll(items: HasteRowItem[]);
}
