import {AbstractTypiePackage, AppGlobal, TypieRowItem, TypieCore, getPath} from "typie-sdk";
import {app, shell} from "electron";
import Path from "path";

export default class SubTypieConfigure extends AbstractTypiePackage {

    constructor(win, config, pkgPath) {
        super(win, config, pkgPath);
        this.packageName = "Typie->Configure";
        this.db = "Typie";
        this.typie = new TypieCore(this.packageName, "Typie");
        this.icon = getPath("themes/default/images/icons/icon.png");
        // Object.assign(this, parent);
    }

    public activate(pkgList, item, cb) {
        console.log("activate from configure");
        shell.openItem(item.getPath());
        this.win.hide();
    }

    public enterPkg(pkgList, item, cb) {
        const pkgs = Object.keys(AppGlobal.get("PackageLoader").packages);
        const resultList: TypieRowItem[] = [];
        for (const pkg of pkgs) {
            resultList.push(
                new TypieRowItem(pkg)
                    .setDB(this.db)
                    .setPackage(this.packageName)
                    .setDescription("Open " + pkg + " configuration")
                    .setIcon(this.icon)
                    .setPath(Path.join(AppGlobal.get("Settings").configDir, pkg + ".yml")));
        }
        this.win.send("resultList", {data: resultList, length: resultList.length, err: 0});
        this.typie.multipleInsert(resultList).go().then().catch();
    }
}
