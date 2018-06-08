const {AbstractTypiePackage, Typie, TypieRowItem} = require("typie-sdk");
const {clipboard} = require("electron");
const Path = require("path");

class SubPasswordGenerate extends AbstractTypiePackage {

    constructor(win, config, pkgPath, parent) {
        super(win, config, pkgPath);
        this.packageName = "Password";
        this.db = "Password";
        this.typie = new Typie(this.packageName, "Password");
        this.icon = Path.join(this.getPackagePath(), "icons", "generate-pass.svg");
        this.availabelChars = config.availabelChars;
        this.numOfChars = config.numOfChars;
    }

    activate(pkgList, item, cb) {
        this.win.hide();
        this.lastPaste = item.getPath();
        clipboard.writeText(item.getPath());
        this.typie.pasteText().go();
    }

    enterPkg(pkgList, item, cb) {
        const res = {data: [], length: 0, err: 0};
        for (let i = 0; i < 5; i++) {
            res.data.push(new TypieRowItem(this.generate())
                .setIcon(this.icon)
                .setPath(this.generate())
                .setDescription("Activate to Paste")
                .setDB("null")
                .setPackage(this.packageName).toPayload());
        }
        res.length = res.data.length;
        cb(res);
    }

    generate() {
        let password = "";
        for (let i = 0; i < this.numOfChars; i++) {
            password += this.availabelChars.charAt(Math.floor(Math.random() * this.availabelChars.length));
        }
        return password;
    }
}
module.exports = SubPasswordGenerate;
