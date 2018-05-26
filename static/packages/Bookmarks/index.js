const { shell } = require('electron');
const { AbstractTypiePackage, TypieRowItem } = require('typie-sdk');
const BookmarksWalker = require('./BookmarksWalker');

class Bookmarks extends AbstractTypiePackage {

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.win         = win;
        this.packageName = 'Bookmarks';
        this.bookmarksWalker = new BookmarksWalker(this);
        this.populate();
    }

    populate() {
        this.bookmarksWalker.walk()
            .then(items => {
                this.typie.setPkg(this.packageName).setDB(this.packageName);
                this.typie.multipleInsert(items).go()
                    .then(data => console.info('Bookmarks done adding', data))
                    .catch(err => console.error('Bookmarks insert error', err));
            })
            .catch(e => console.error(e));
    }

    search(obj, callback) {
        this.typie.setPkg(this.packageName).setDB('global');
        super.search(obj, callback);
    }

    enterPkg(pkgList, item, cb) {
        this.typie.setPkg(this.packageName).setDB(this.packageName);
        this.typie.getRows(10).orderBy('count').desc().go()
            .then(res => {
                this.win.send('resultList', res);
                this.win.show();
            })
            .catch(err => console.log(err));
    }
}
module.exports = Bookmarks;

