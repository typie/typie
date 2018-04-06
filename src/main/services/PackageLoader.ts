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
        this.loadPackages();
        fs.watch(packagesPath, (event, dirPath) => {
            console.log("Detect package '"+event+"', reloading '"+dirPath+"'");
            this.loadPackage(dirPath);
        });
    }

    public getPackage(pkg: string): AbstractHastePackage | null {
        if (this.packages[pkg]) {
            return this.packages[pkg];
        } else {
            console.error('did not find and package with that name: ' + pkg);
            return null;
        }
    }

    public loadPackages() {
        let packagesDirs = PackageLoader.getDirectories(packagesPath);
        console.log(packagesDirs);
        packagesDirs.forEach((dirName) => {
            this.loadPackage(dirName);
        });
    }

    public loadPackage(packageName) {
        let absPath = path.join(packagesPath, packageName);
        if (!fs.existsSync(path.join(absPath, 'index.js'))) {
            console.log('Did not found any index.js at ' + absPath);
            return;
        }

        if (this.packages[packageName]) {
            console.log("package '" + packageName + "' already exist...");
            this.packages[packageName].destroy();
            this.packages[packageName] = null;
        }

        absPath = path.relative(__static, absPath);
        absPath = absPath.replace(/\\/g, '/');
        let packagePath = '../../static/' + absPath + '/index.js';
        console.log('Loading package from ' + packagePath);

        let tmp = new Haste(packageName);
        tmp.addCollection().go()
            .then((data) => {
                console.log(data);
                /**
                 * @type {AbstractHastePackage}
                 */
                let Package = eval("require('"+packagePath+"')");
                this.packages[packageName] = new Package(Haste, this.win, absPath);
                console.log("Loaded package '" + packageName + "'");

                let item = new HasteRowItem();
                item.setDB("global");
                item.setDescription("Package");
                item.setIcon(this.packages[packageName].icon);
                item.setTitle(packageName);
                new Haste('global').insert(item, false).go()
                    .then(res => {
                        if (res.err === 0) {
                            console.log("Package '"+packageName+"' is now searchable.");
                        }
                    })
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