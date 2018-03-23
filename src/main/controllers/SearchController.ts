
import Haste from "../services/Haste";
export default class SearchController
{
    public static search(event, search): void {
        if (search.currentPackage !== 'global') {
            new Haste(search.currentPackage).fuzzySearch(search.value).go()
                .then(data => console.log(data))
                .catch(err => console.error(err))
        } else {
            new Haste('global').fuzzySearch(search.value).go()
                .then(res => {
                    event.sender.send('resultList', res);
                })
                .catch(err => console.error(err))
        }
    }
}
