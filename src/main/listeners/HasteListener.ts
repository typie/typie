import {ipcMain} from 'electron';
import PackageLoader from "../services/PackageLoader";
import {Haste, HasteRowItem} from "haste-sdk";

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

        ipcMain.on('activate', (event, data) => {
            console.log('activate', data);
            let pkg = "global";
            let item = HasteRowItem.create(data.item);
            if (data.currentPackage !== 'global') {
                pkg = data.currentPackage;
            } else {
                pkg = data.item.t;
            }
            if (pkg === 'global') {
                item.countUp();
                new Haste('global').insert(item).go()
                    .then(data => {
                        let plugin = packageLoader.getPackage(item.getTitle());
                        if (plugin) {
                            plugin.activateUponEntry();
                        }
                    })
                    .catch(err => console.error(err));
            } else {
                packageLoader.getPackage(pkg).activate(item, (result) => {
                    event.sender.send('activatedResult', result);
                });
            }
        });
    }
}
export default HasteListener;