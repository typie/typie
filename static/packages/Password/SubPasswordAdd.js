const {AbstractTypiePackage, Typie, TypieRowItem} = require("typie-sdk");
const {clipboard} = require("electron");
const Path = require("path");
const crypto = require('crypto');

class SubPasswordAdd extends AbstractTypiePackage {

    constructor(win, config, pkgPath, parent) {
        super(win, config, pkgPath);
        this.packageName = "Password";
        this.db = "Password";
        this.typie = new Typie(this.packageName, "Password");
        this.icon = parent.icon;
        this.addKeyIcon = Path.join(this.getPackagePath(), "icons", "add-key.svg");
        this.infoIcon = Path.join(this.getPackagePath(), "icons", "forgot-pass.svg");
        this.keyIcon = Path.join(this.getPackagePath(), "icons", "key.svg");

        this.algorithm = "aes-256-ctr";
        this.salt = config.salt;
    }

    activate(pkgList, item, cb) {
        if (item.getPath() !== "name|password") {
            console.log("do somthing");
            this.typie.insert(new TypieRowItem(item.getPackage())
                .setPath(item.getPath())
                .setDescription("Activate to Paste")
                .setIcon(this.keyIcon)).go()
                .then(() => {
                    this.win.hide();
                })
                .catch(e => console.error(e));
        }
    }

    search(obj, cb) {
        const res = {data: [], length: 1, err: 0};
        if (obj.value && obj.value.includes("|")) {
            let splited = obj.value.match(/([^|]*)\|(.*)/);
            res.data.push(new TypieRowItem()
                .setTitle("store " + this.capitalize(splited[1]) + " -> with pass: " + splited[2])
                .setIcon(this.addKeyIcon)
                .setPath(this.encrypt(splited[2]))
                .setDescription("Activate to Store")
                .setDB("null")
                .setPackage(splited[1]).toPayload());
        }
        res.data.push(new TypieRowItem("name|password")
            .setIcon(this.infoIcon)
            .setPath("name|password")
            .setDescription("Provide name and password separated by | to store")
            .setDB("null")
            .setPackage(this.packageName).toPayload());
        cb(res);
    }

    enterPkg(pkgList, item, cb) {
        this.search(pkgList, cb);
    }

    clear(pkgList, cb) {
        this.search(pkgList, cb);
    }

    encrypt(text) {
        const cipher = crypto.createCipher(this.algorithm, this.salt);
        let crypted = cipher.update(text,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    hideChars(str) {
        let res = "";
        for (let i = 0; i < str.length; i++) {
            res += "*";
        }
        return res;
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
module.exports = SubPasswordAdd;
