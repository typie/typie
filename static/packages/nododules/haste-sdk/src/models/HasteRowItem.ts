
export default class HasteRowItem
{
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

    setTitle(value: string){
        this.title = value;
    }
    getTitle(): string {
        return this.title;
    }

    setPath(value: string){
        this.p = value;
    }
    getPath(): string {
        return this.p;
    }

    setDB(value: string){
        this.db = value;
    }
    getDB(): string {
        return this.db;
    }

    setDescription(value: string){
        this.d = value ? value : "";
    }
    getDescription(): string {
        return this.d;
    }

    setIcon(value: string){
        this.i = value;
    }
    getIcon(): string {
        return this.i;
    }

    setPackage(value: string){
        this.t = value;
    }
    getPackage(): string {
        return this.t;
    }

    setCount(value: number){
        this.c = value;
    }
    getCount(): number {
        return this.c;
    }
    countUp(): void {
        this.c = this.c + 1;
    }

    setUnixtime(value: number | undefined){
        this.u = value;
    }
    getUnixtime(): number | undefined {
        return this.u;
    }

    setScore(value: number | undefined){
        this.score = value;
    }
    getScore(): number | undefined {
        return this.score;
    }

    static create(data): HasteRowItem {
        let item = new HasteRowItem();
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

    toPayload() {
        return {
            db: this.getDB(),
            t: this.getPackage(),
            title: this.getTitle(),
            p: this.getPath(),
            d: this.getDescription(),
            i: this.getIcon(),
            c: this.getCount(),
        };
    }
}