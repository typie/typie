import GoDispatcher from "./GoDispatcher";
import Packet from "./models/Packet";
import SearchPayload from "./models/SearchPayload";
import HasteRowItem from "./models/HasteRowItem";

export default class Haste
{
    private _search: SearchPayload = new SearchPayload;
    private db: string;
    private packageName: string;

    private command: string;
    private payload: any;

    constructor(packageName: string, db?: string) {
        this.db = db ? db : packageName;
        this.packageName = packageName;
        this.command = '';
        this.payload = {};
    }

    pasteText() {
        this.command = 'pasteText';
        this.payload = {};
        return this;
    }

    addCollection() {
        this.command = 'addCollection';
        this.payload = {name: this.packageName};
        return this;
    }

    updateCalled(item) {
        item.countUp();
        return this.insert(item, true);
    }

    multipleInsert(itemList) {
        this.command = 'multipleInsert';
        this.payload = itemList;
        return this;
    }

    insert(item: HasteRowItem, persist: boolean = true) {
        item.setDB(this.db);
        item.setPackage(this.packageName);
        this.command = persist ? 'insertPersist' : 'insert';
        this.payload = item.toPayload();
        return this;
    }

    getKey(value: string) {
        this.payload.value = value;
        this.payload.db = this.db;
        this.payload.packageName = this.packageName;
        this.command = 'getKey';
        return this;
    }

    getExecList() {
        this.payload.db = this.db;
        this.payload.packageName = this.packageName;
        this.command = 'getExecList';
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

    getRows(limit: number) {
        this._search.limit = limit;
        this._search.type = 'getRows';
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

    mouse() {
        return {
            up() {
                GoDispatcher.send(new Packet("mouseMovement", {direction: "up"})).then().catch();
            },
            down() {
                GoDispatcher.send(new Packet("mouseMovement", {direction: "down"})).then().catch();
            },
            left() {
                GoDispatcher.send(new Packet("mouseMovement", {direction: "left"})).then().catch();
            },
            right() {
                GoDispatcher.send(new Packet("mouseMovement", {direction: "right"})).then().catch();
            }
        }
    }
}