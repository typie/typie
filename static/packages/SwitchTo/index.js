const { AbstractTypiePackage, TypieRowItem } = require('typie-sdk');
const winctl = require('winctl');


class SwitchTo extends AbstractTypiePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.win         = win;
        this.packageName = 'SwitchTo';
    }

    insert(value, description="", path="", icon="") {
        let item = this.getDefaultItem(value, description, path, icon);
        item.setDescription("Activate to Paste");
        this.insertItem(item);
    }

    activate(pkgList, item, cb) {

    }

    enterPkg(pkgList, item, cb) {
        // winctl.FindWindows(win => win.isVisible() && win.getTitle()).then(windows => {
        //     console.log("Visible windows:");
        //     windows.forEach(window => console.log(" - %s [pid=%d, hwnd=%d, parent=%d]", window.getTitle(), window.getPid(), window.getHwnd(), window.getParent()));
        // });
        // this.typie.getRows(10).orderBy('unixTime').desc().go()
        //     .then(res => {
        //         this.win.send('resultList', res);
        //         this.win.show();
        //     })
        //     .catch(err => console.log(err));
    }
}
module.exports = SwitchTo;

