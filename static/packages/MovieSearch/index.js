const {shell} = require('electron');
const skullIco = 'themes/default/images/skull.png';
const {AbstractHastePackage, HasteRowItem} = require('haste-sdk');

class MovieSearch extends AbstractHastePackage
{

    constructor(Haste){
        super();
        this.packageName = 'MovieSearch';
        this.haste       = new Haste(this.packageName);
        this.icon        = 'skull.png';

        this.insert('supernatural');
        this.insert('the walking dead');
    }

    insert(value) {
        let item = new HasteRowItem();
        item.title = value;
        item.description = "movie search";
        item.icon = skullIco;
        item.path = "";
        let res = this.haste.insert(item).go()
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    }

    search(value, callback){
        this.haste.fuzzySearch(value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.error(err));
    }

    action(item) {
        this.updateCalled(item);
        let eleet = 'http://1337x.to/sort-search/'+record.path+'/seeders/desc/1/';
        let imdb = 'https://www.imdb.com/find?s=all&q='+record.path+'';
        let youtube = 'https://www.youtube.com/results?search_query='+record.path+'';
        let subscene = 'https://subscene.com/subtitles/title?q='+record.path+'&l=';
        let opensubs = 'https://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-'+record.path+'';
        shell.openItem(opensubs);
        shell.openItem(subscene);
        shell.openItem(youtube);
        shell.openItem(imdb);
        shell.openItem(eleet);
        this.win.send('action', 'hide');
    }

    refresh() {
        let res = this.db.catalog.chain().where((obj)=>obj.t=='MovieSearch').simplesort("$loki", 'desc').limit(10).data();
        return [res, this.db.catalog.data.length];
    }
    searchIt(catalog, searchValue) {
      return catalog.chain()
        .where(function (obj) {
          let score = obj.title.score(searchValue, 0.5) * 1000
          if (score > 200) {
            obj.score = obj.called ? (score + (obj.called) * 200) : score
            return true
          }
          return false
        })
        .simplesort('score', 'desc')
        .limit(10)
        .data()
    }
}
module.exports = MovieSearch;

