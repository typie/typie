import {IAction} from "./IAction";
import {ILabel} from "./ILabel";

export default class TypieRowItem {

    public static create(data): TypieRowItem {
        const item = new TypieRowItem();
        item.setDB(data.db ? data.db : "global");
        item.setPackage(data.t);
        item.setActions(data.a);
        item.setTitle(data.title);
        item.setPath(data.p);
        item.setDescription(data.d);
        item.setIcon(data.i);
        item.setCount(data.c);
        item.setScore(data.score);
        item.setUnixtime(data.u);
        return item;
    }

    public static isPackage(item: TypieRowItem): boolean {
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

    public a?: IAction[];
    public l?: ILabel[];
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

    public setTitle(value: string): TypieRowItem {
        this.title = value;
        return this;
    }

    public getTitle(): string {
        return this.title;
    }

    public setActions(actionList: IAction[]): TypieRowItem {
        this.a = actionList;
        return this;
    }

    public getActions(): IAction[] | undefined {
        return this.a;
    }

    public setLabels(labelList: ILabel[]): TypieRowItem {
        this.l = labelList;
        return this;
    }

    public getLabels(): ILabel[] | undefined {
        return this.l;
    }

    public setPath(value: string): TypieRowItem {
        this.p = value;
        return this;
    }

    public getPath(): string {
        return this.p;
    }

    public setDB(value: string): TypieRowItem {
        this.db = value;
        return this;
    }

    public getDB(): string {
        return this.db;
    }

    public setDescription(value: string): TypieRowItem {
        this.d = value ? value : "";
        return this;
    }

    public getDescription(): string {
        return this.d;
    }

    public setIcon(value: string): TypieRowItem {
        this.i = value;
        return this;
    }

    public getIcon(): string {
        return this.i;
    }

    public setPackage(value: string): TypieRowItem {
        this.t = value;
        return this;
    }

    public getPackage(): string {
        return this.t;
    }

    public setCount(value: number): TypieRowItem {
        this.c = value;
        return this;
    }

    public getCount(): number {
        return this.c;
    }

    public countUp(): TypieRowItem {
        this.c = this.c + 1;
        return this;
    }

    public setUnixtime(value: number | undefined) {
        this.u = value;
        return this;
    }

    public getUnixtime(): number | undefined {
        return this.u;
    }

    public setScore(value: number | undefined): TypieRowItem {
        this.score = value;
        return this;
    }

    public getScore(): number | undefined {
        return this.score;
    }

    public toPayload() {
        return {
            a: this.getActions(),
            c: this.getCount(),
            d: this.getDescription(),
            db: this.getDB(),
            i: this.getIcon(),
            l: this.getLabels(),
            p: this.getPath(),
            t: this.getPackage(),
            title: this.getTitle(),
        };
    }
}
