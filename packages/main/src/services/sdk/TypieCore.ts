import GoDispatcher from "./GoDispatcher";
import Packet from "./models/Packet";
import SearchPayload from "./models/SearchPayload";
import TypieRowItem from "./models/TypieRowItem";

// this is a little hack to use the global variable in TypeScript
// it is used to get the go dispatcher from the main process we need it as a singleton
const globalAny: any = global;

export default class TypieCore {
    private search: SearchPayload = new SearchPayload();
    private db: string;
    private packageName: string;
    private command: string;
    private payload: any;
    private goDispatcher: GoDispatcher;

    constructor(packageName: string, db?: string) {
        this.goDispatcher = globalAny.GoDispatcher;
        this.db = db ? db : packageName;
        this.packageName = packageName;
        this.command = "";
        this.payload = {};
    }

    public setCustomCommand(command: string) {
        this.command = command;
        return this;
    }

    public setCustomPayload(payload: any) {
        this.payload = payload;
        return this;
    }

    public pasteText() {
        this.command = "pasteText";
        this.payload = {};
        return this;
    }

    public generateSwitchList() {
        this.command = "generateSwitchList";
        this.payload = {};
        return this;
    }

    public switchTo(item: TypieRowItem) {
        item.setDB(item.getDB());
        item.setPackage(item.getPackage());
        this.command = "switchTo";
        this.payload = item.toPayload();
        return this;
    }

    public addCollection() {
        this.command = "addCollection";
        this.payload = {name: this.packageName};
        return this;
    }

    public updateCalled(item) {
        item.countUp();
        return this.insert(item, true);
    }

    public multipleInsert(itemList) {
        this.command = "multipleInsert";
        this.payload = itemList;
        return this;
    }

    public insert(item: TypieRowItem, persist = true) {
        item.setDB(this.db);
        item.setPackage(this.packageName);
        this.command = persist ? "insertPersist" : "insert";
        this.payload = item.toPayload();
        return this;
    }

    public remove(item: TypieRowItem) {
        item.setDB(item.getDB());
        item.setPackage(item.getPackage());
        this.command = "remove";
        this.payload = item.toPayload();
        return this;
    }

    public getKey(value: string) {
        this.payload.value = value;
        this.payload.db = this.db;
        this.payload.packageName = this.packageName;
        this.command = "getKey";
        return this;
    }

    public getFilesList(allowedExt: string[], dirList: string[]) {
        this.payload.db = this.db;
        this.payload.packageName = this.packageName;
        this.payload.allowedExt = allowedExt;
        this.payload.dirList = dirList;
        this.command = "getExecList";
        return this;
    }

    public fuzzySearch(value: string) {
        this.search.value = value;
        this.search.type = "fuzzy";
        this.search.db = this.db;
        this.search.packageName = this.packageName;
        this.command = "search";
        this.payload = this.search;
        return this;
    }

    public getRows(limit: number) {
        this.search.limit = limit;
        this.search.type = "getRows";
        this.search.db = this.db;
        this.search.packageName = this.packageName;
        this.command = "search";
        this.payload = this.search;
        return this;
    }

    public setPkg(name: string) {
        this.packageName = name;
        return this;
    }

    public setDB(name: string) {
        this.db = name;
        return this;
    }

    public orderBy(field: string) {
        this.search.direction = "asc";
        this.search.orderBy = field;
        return this;
    }

    public asc() {
        this.search.direction = "asc";
        return this;
    }

    public desc() {
        this.search.direction = "desc";
        return this;
    }

    public go(): Promise<any> {
        return this.goDispatcher.send(new Packet(this.command, this.payload));
    }
}
