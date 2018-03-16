import GoDispatcher from "./GoDispatcher";
import Packet from "../models/Packet";
import SearchPayload from "../models/SearchPayload";
import AbstractHastePackage from "../models/AbstractHastePackage";
import HasteRowItem from "../models/HasteRowItem";

export default class Haste
{
    private _search: SearchPayload = new SearchPayload;
    private db: string;
    private packageName: string;

    private command: string;
    private payload: object;

    constructor(hastePackage: AbstractHastePackage) {
        this.db = hastePackage.getPackageName();
        this.packageName = hastePackage.getPackageName();
        this.command = '';
        this.payload = {};
    }

    insert(item: HasteRowItem) {
        item.db = this.db;
        item.packageName = this.packageName;
        this.command = 'insert';
        this.payload = item;
        return this;
    }

    fuzzySearch(value: string) {
        this._search.value = value;
        this._search.type = 'fuzzy';
        this._search.db = this.db;
        this._search.packageName = this.packageName;
        this.command = 'search';
        this.payload = this._search;
        return this;
    }

    orderBy(field: string) {
        this._search.direction = 'asc';
        this._search.orderBy = field;
        return this;
    }

    asc() {
        this._search.direction = 'asc';
        return this;
    }

    desc() {
        this._search.direction = 'desc';
        return this;
    }

    go() {
        let packet = new Packet(this.command, this.payload);
        return GoDispatcher.send(packet);
    }

}
