export default class HasteRowItem {

    public static create(data): HasteRowItem {
        const item = new HasteRowItem();
        item.setDB(data.db);
        item.setPackage(data.t);
        item.setTitle(data.title);
        item.setPath(data.p);
        item.setDescription(data.d);
        item.setIcon(data.i);
        item.setCount(data.c);
        item.setScore(data.score);
        item.setUnixtime(data.u);
        return item;
    }

    public static isPackage(item: HasteRowItem): boolean {
        return item.d === "Package"
            || item.d === "SubPackage"
            || item.p === "Package"
            || item.p.startsWith("SubPackage|");
    }

    public db: string;
    public d: string;
    public i: string;
    public t: string;
    public p: string;
    public title: string;
    public c: number;

    public score?: number;
    public u?: number;

    constructor(title?: string) {
        this.db = "";
        this.d = "";
        this.i = "";
        this.t = "";
        this.p = "";
        this.title = title ? title : "";
        this.c = 0;
    }

    public setTitle(value: string): HasteRowItem {
        this.title = value;
        return this;
    }

    public getTitle(): string {
        return this.title;
    }

    public setPath(value: string): HasteRowItem {
        this.p = value;
        return this;
    }

    public getPath(): string {
        return this.p;
    }

    public setDB(value: string): HasteRowItem {
        this.db = value;
        return this;
    }

    public getDB(): string {
        return this.db;
    }

    public setDescription(value: string): HasteRowItem {
        this.d = value ? value : "";
        return this;
    }

    public getDescription(): string {
        return this.d;
    }

    public setIcon(value: string): HasteRowItem {
        this.i = value;
        return this;
    }

    public getIcon(): string {
        return this.i;
    }

    public setPackage(value: string): HasteRowItem {
        this.t = value;
        return this;
    }

    public getPackage(): string {
        return this.t;
    }

    public setCount(value: number): HasteRowItem {
        this.c = value;
        return this;
    }

    public getCount(): number {
        return this.c;
    }

    public countUp(): HasteRowItem {
        this.c = this.c + 1;
        return this;
    }

    public setUnixtime(value: number | undefined) {
        this.u = value;
    }

    public getUnixtime(): number | undefined {
        return this.u;
    }

    public setScore(value: number | undefined): HasteRowItem {
        this.score = value;
        return this;
    }

    public getScore(): number | undefined {
        return this.score;
    }

    public toPayload() {
        return {
            c: this.getCount(),
            d: this.getDescription(),
            db: this.getDB(),
            i: this.getIcon(),
            p: this.getPath(),
            t: this.getPackage(),
            title: this.getTitle(),
        };
    }
}
