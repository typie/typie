import {ipcMain} from 'electron';
import PackageLoader from "../services/PackageLoader";
import Haste from "../services/Haste";

class HasteListener
{
    constructor(packageLoader: PackageLoader) {
        ipcMain.on('search', (event, search) => {
            if (search.currentPackage && search.currentPackage !== 'global') {
                packageLoader.getPackage(search.currentPackage)
                    .search(search.value, (result) => {
                        //console.log('res', result);
                        event.sender.send('resultList', result);
                    });
            } else {
                new Haste('global').fuzzySearch(search.value).go()
                    .then(res => event.sender.send('resultList', res))
                    .catch(err => console.error(err))
            }
        });
    }
}
export default HasteListener;