declare const __static: any;
import * as fs from "fs";
import * as path from "path";
import Haste from "./Haste";
import AbstractHastePackage from "../../../src/main/models/AbstractHastePackage";
import HasteRowItem from "../models/HasteRowItem";


const packagesPath = path.join(__static, '/packages');
const packages = {};

export default class PackageLoader
{
    public static init() {
        fs.watch(packagesPath, (event, path) => {
            console.log('packages changed', event, path);
        });
        PackageLoader.loadPackages();
    }

    public static loadPackages() {
        let packagesDirs = PackageLoader.getDirectories(packagesPath);
        console.log(packagesDirs);
        packagesDirs.forEach((dirName) => {
            let absPath = path.join(packagesPath, dirName);
            //console.log('absPath', absPath);
            if (fs.existsSync(absPath + '\\index.js')) {
                PackageLoader.loadPackage(dirName, absPath);
            }
        });
    }

    public static loadPackage(packageName, absPath) {
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
                packages[packageName] = new Package(Haste);
                console.log("Loaded package " + packageName + " from " + packagePath);

                let item = new HasteRowItem();
                item.description = "Plugin";
                item.icon = absPath + '/' +packages[packageName].icon;
                item.title = packageName;
                new Haste('global').insert(item).go().then(res => console.log(res))
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