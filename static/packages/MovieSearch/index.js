const {shell, globalShortcut} = require('electron');
const skullIco = 'themes/default/images/skull.png';
const {AbstractHastePackage, HasteRowItem, SearchObject} = require('haste-sdk');

class MovieSearch extends AbstractHastePackage
{

    constructor(Haste, win, config){
        super(win, config);
        this.packageName = 'MovieSearch';
        this.haste       = new Haste(this.packageName);

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
        console.log('list of pkgs', obj.pkgList, obj.value);
        this.haste.fuzzySearch(obj.value).orderBy('score').desc().go()
            .then(data => {
                if (data.data[0].score !== 1000) {
                    let firstItem = new HasteRowItem(obj.value);
                    firstItem.setDescription("create a new search");
                    firstItem.setIcon(this.getIcon("go-arrow.png"));
                    data.data.unshift(firstItem.toPayload());
                }
                callback(data);
            })
            .catch(err => console.log(err));
    }

    activate(item, cb) {
        let eleet = 'http://1337x.to/sort-search/'+item.getTitle()+'/seeders/desc/1/';
        let imdb = 'https://www.imdb.com/find?s=all&q='+item.getTitle()+'';
        let youtube = 'https://www.youtube.com/results?search_query='+item.getTitle()+'';
        let subscene = 'https://subscene.com/subtitles/title?q='+item.getTitle()+'&l=';
        let opensubs = 'https://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-'+item.getTitle()+'';
        //shell.openItem(opensubs);
        //shell.openItem(subscene);
        //shell.openItem(youtube);
        //shell.openItem(imdb);
        shell.openItem(eleet);
        item.countUp();
        this.insert(item.getTitle());
        //this.win.send('action', 'hide');
    }

    loadConfig(config) {
        if (config.shortcut) {
            console.log('registering shortcut ' + config.shortcut + ' to ' + this.getPackageName());
            globalShortcut.register(config.shortcut, () => {
                this.win.send('changePackage', [this.getPackageName()]);
            });
        }
    }
}
module.exports = MovieSearch;

