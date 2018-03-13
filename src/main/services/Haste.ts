import GoDispatcher from "./GoDispatcher";
import Packet from "../models/Packet";
import SearchPayload from "../models/SearchPayload";
import AbstractHastePackage from "../models/AbstractHastePackage";

export default class Haste
{
    private search: SearchPayload = new SearchPayload;

    constructor(hastePackage: AbstractHastePackage) {
        this.search.packageName = hastePackage.packageName;
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
