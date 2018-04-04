import MainWindowController from "../controllers/MainWindowController";
declare const __static: any;
import * as fs from "fs";
import * as path from "path";
import {AbstractHastePackage, HasteRowItem, Haste} from "haste-sdk";

const packagesPath = path.join(__static, '/packages');

export default class PackageLoader
{
    private packages: Object;
    private win: MainWindowController;

    constructor(win: MainWindowController) {
        this.win = win;
        this.packages = {};
        fs.watch(packagesPath, (event, path) => {
            console.log('packages changed', event, path);
        });

        this.loadPackages();
    }
    public getPackage(pkg: string) {
        if (this.packages[pkg]) {
            return this.packages[pkg];
        } else {
            console.error('did not find and package with that name: ' + pkg);
        }
    }

    public loadPackages() {
        let packagesDirs = PackageLoader.getDirectories(packagesPath);
        console.log(packagesDirs);
        packagesDirs.forEach((dirName) => {
            let absPath = path.join(packagesPath, dirName);
            console.log('absPath', absPath);
            if (fs.existsSync(path.join(absPath, 'index.js'))) {
                this.loadPackage(dirName, absPath);
            }
        });
    }

    public loadPackage(packageName, absPath) {
        absPath = path.relative(__static, absPath);
        absPath = absPath.replace(/\\/g, '/');
        let packagePath = '../../static/' + absPath + '/index.js';
        console.log('trying to load package from1 ' + packagePath);

        let tmp = new Haste(packageName);
        tmp.addCollection().go()
            .then((data) => {
                console.log(data);
                /**
                 * @type {AbstractHastePackage}
                 */
                let Package = eval("require('"+packagePath+"')");
                this.packages[packageName] = new Package(Haste, this.win);
                console.log("Loaded package " + packageName + " from " + packagePath);

                let item = new HasteRowItem();
                item.description = "Plugin";
                item.icon = absPath + '/' + this.packages[packageName].icon;
                item.title = packageName;
                new Haste('global').insert(item, false).go()
                    .then(res => console.log(res))
                    .catch(err => console.error(err))
            })
            .catch((err) => console.error('cannot load package from: '+packagePath, err));
    }

    public static getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path+'/'+file).isDirectory();
        });
    }
}