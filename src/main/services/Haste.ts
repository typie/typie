import GoDispatcher from "./GoDispatcher";
import Packet from "../models/Packet";
import SearchPayload from "../models/SearchPayload";
import AbstractHastePackage from "../models/AbstractHastePackage";
import InsertPayload from "../models/InsertPayload";
import HasteRowItem from "../models/HasteRowItem";

export default class Haste
{
    private search: SearchPayload = new SearchPayload;
    private insert: InsertPayload = new InsertPayload;

    constructor(hastePackage: AbstractHastePackage) {
        this.search.packageName = hastePackage.packageName;
        this.insert.packageName = hastePackage.packageName;
    }

    insert(item: HasteRowItem) {
        this.insert.title = item.title;
        this.insert.description = item.description;
        this.insert.icon = item.icon;
        this.insert.path = item.path;
        let packet = new Packet('insert', this.insert);
        return GoDispatcher.send(packet);
    }

    fuzzySearch(value: string) {
        this.search.value = value;
        this.search.type = 'fuzzy';
        return this;
    }

    orderBy(field: string) {
        this.search.direction = 'asc';
        this.search.orderBy = field;
        return this;
    }

    asc() {
        this.search.direction = 'asc';
        return this;
    }

    desc() {
        this.search.direction = 'desc';
        return this;
    }

    go() {
        let packet = new Packet('search', this.search);
        return GoDispatcher.send(packet);
    }

}
