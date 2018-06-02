const { clipboard } = require('electron');
const { AbstractTypiePackage, TypieRowItem } = require('typie-sdk');
const crypto = require('crypto');

const SubPasswordGenerate = require("./SubPasswordGenerate");
const SubPasswordAdd = require("./SubPasswordAdd");

class Password extends AbstractTypiePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.win         = win;
        this.packages = {
            Generate: new SubPasswordGenerate(win, config, "Password->Generate", this),
            Add: new SubPasswordAdd(win, config, "Password->Add", this),
        };
        this.packageName = 'Password';
        this.algorithm = "aes-256-ctr";
        this.salt = config.salt;
        this.populate();
    }

    activate(pkgList, item, cb) {
        this.win.hide();
        this.lastPaste = item.getPath();
        clipboard.writeText(this.decrypt(item.getPath()));
        this.typie.updateCalled(item).go()
            .then(()=>{
                this.typie.pasteText().go();
            })
            .catch(()=>{});
    }

    enterPkg(pkgList, item, cb) {
        this.typie.getRows(10).orderBy('count').desc().go()
            .then(res => {
                this.win.send('resultList', res);
            })
            .catch(err => console.log(err));
    }

    remove(pkgList, item, cb) {
        if (!TypieRowItem.isPackage(item)) {
            this.typie.remove(item).go()
                .then(data => this.win.send("deleteItem", item))
                .catch(e => console.error(e));
        }
    }

    populate() {
        const itemsArray = [];

        itemsArray.push(
            new TypieRowItem("Generate")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Auto Generate passwords")
                .setIcon(this.icon)
                .setPath("SubPackage|Password->Generate"));

        itemsArray.push(
            new TypieRowItem("Add")
                .setDB(this.packageName)
                .setPackage(this.packageName)
                .setDescription("Add New Password record to DB")
                .setIcon(this.icon)
                .setPath("SubPackage|Password->Add"));

        this.typie.multipleInsert(itemsArray).go()
            .then(data => console.info("Password plugin done adding", data))
            .catch(err => console.error("Password plugin insert error", err));
    }

    decrypt(text){
        const decipher = crypto.createDecipher(this.algorithm, this.salt);
        let dec = decipher.update(text,'hex','utf8');
        dec += decipher.final('utf8');
        return dec;
    }
}
module.exports = Password;

