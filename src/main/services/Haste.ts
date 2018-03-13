

import GoDispatcher from "./GoDispatcher";

class Packet
{
    private command: string = '';
    private payload: object = {};
    constructor(command: string, payload: object) {
        this.command = command;
        this.payload = payload;
    }
}
class SearchPayload
{
    public type: string = 'fuzzy';   // can be 'fuzzy' | '' |
    public value: string = '';  // the actual search valu
    public orderBy: string = 'score'; // the name of the field to be ordered by
    public direction: string = 'desc';
    public package: string = '';
}

export default class Haste
{
    private search: SearchPayload = new SearchPayload;

    constructor() {
        this.search.packageName = 'caller';
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
