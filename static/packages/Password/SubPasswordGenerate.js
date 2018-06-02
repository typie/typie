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
        this.availabelChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        this.numOfChars = 8;
    }

    activate(pkgList, item, cb) {
        this.win.hide();
        this.lastPaste = item.getPath();
        clipboard.writeText(item.getPath());
        this.typie.updateCalled(item).go()
            .then(()=>{
                this.typie.pasteText().go();
            })
            .catch(()=>{});
    }

    enterPkg(pkgList, item, cb) {
        const res = {data: [], length: 0, err: 0};
        for (let i = 0; i < 5; i++) {
            res.data.push(new TypieRowItem(this.generate())
                .setIcon(this.icon)
                .setPath(this.generate())
                .setDescription("Activate to Paste")
                .setDB(this.packageName)
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
