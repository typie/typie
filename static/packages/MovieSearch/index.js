const {shell, globalShortcut} = require('electron');
const {AbstractHastePackage, HasteRowItem, SearchObject} = require('haste-sdk');

class MovieSearch extends AbstractHastePackage
{

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.win         = win;
        this.packageName = 'MovieSearch';

        // Example
        this.insert('supernatural');
        this.insert('the walking dead');
    }

    insert(value, description="", path="", icon="") {
        let item = this.getDefaultItem(value, description, path, icon);
        item.setDescription("Activate to search");
        this.insertItem(item);
    }

    /**
     * @param {SearchObject} obj
     * @param callback
     */
    search(obj, callback) {
        this.haste.fuzzySearch(obj.value).orderBy('score').desc().go()
            .then(data => {
                if (data.data.length > 0 && data.data[0].score !== 1000) {
                    let firstItem = new HasteRowItem(obj.value);
                    firstItem.setDescription("create a new search");
                    firstItem.setIcon(this.getIcon("go-arrow.png"));
                    data.data.unshift(firstItem.toPayload());
                }
                callback(data);
            })
            .catch(err => console.log(err));
    }

    activate(pkgList, item, cb) {
        console.log("activate from movie search pkg: " + item.getTitle(), item);
        let eleet = 'http://1337x.to/sort-search/'+item.getTitle()+'/seeders/desc/1/';
        let imdb = 'https://www.imdb.com/find?s=all&q='+item.getTitle()+'';
        let youtube = 'https://www.youtube.com/results?search_query='+item.getTitle()+'';
        let subscene = 'https://subscene.com/subtitles/title?q='+item.getTitle()+'&l=';
        let opensubs = 'https://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-'+item.getTitle()+'';
        shell.openExternal(opensubs);
        shell.openExternal(subscene);
        shell.openExternal(youtube);
        shell.openExternal(imdb);
        shell.openExternal(eleet);
        this.win.hide();
    }
}
module.exports = MovieSearch;

