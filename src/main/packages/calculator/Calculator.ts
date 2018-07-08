import {AbstractTypiePackage, TypieRowItem, SearchObject, getPath} from "typie-sdk";
import {clipboard} from "electron";
import math from "mathjs";

const calcIcon = getPath("themes/default/images/calculator-icon.png");
math.config({predictable: true});

export default class Calculator extends AbstractTypiePackage {

    public static tryMathExpression(res, obj: SearchObject) {
        try {
            const answer = String(math.eval(obj.value));
            const item = new TypieRowItem(answer);
            item.setPackage("Calculator");
            item.setDescription(obj.value + " = " + answer);
            item.setPath(answer);
            item.setDB("Calculator");
            item.setIcon(calcIcon);
            res.data.unshift(item);
            if (res.data.length > 10) {
                res.data.pop();
            }
        } catch (e) {
            // do nothing
        }
        return res;
    }

    constructor(win, config, pkgName) {
        super(win, config, pkgName);
        this.icon = calcIcon;
    }

    public search(obj, callback) {
        this.typie.getRows(10).orderBy("unixTime").desc().go()
            .then(res => {
                res = Calculator.tryMathExpression(res, obj);
                callback(res);
            })
            .catch(e => console.error("error getting first records", e));
    }

    public activate(pkgList: string[], item: TypieRowItem, callback: (data) => void): void {
        if (pkgList[0] !== this.packageName) {
            this.win.send("changePackage", [this.packageName]);
        }
        if (!item.getUnixtime()) {
            this.win.send("clearValue");
        }
        clipboard.writeText(item.getPath());
        this.typie.pasteText().go();
    }

    public enterPkg(pkgList, item, cb) {
        this.typie.getRows(10).orderBy("unixTime").desc().go()
            .then(res => cb(res))
            .catch(e => console.error("error getting first records", e));
    }
}
