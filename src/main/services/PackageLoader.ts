import MainWindowController from "../controllers/MainWindowController";
declare const __static: any;
import * as fs from "fs";
import * as path from "path";
import Settings from "./Settings";
import {AbstractHastePackage, HasteRowItem, Haste} from "haste-sdk";

const packagesPath = path.join(__static, '/packages');

export default class PackageLoader
{
    private packages: Object;
    private win: MainWindowController;
    private config: Settings;

    constructor(win: MainWindowController, config: Settings) {
        this.win = win;
        this.config = config;
        this.packages = {};
        this.loadPackages();
        // this.watchForPackages();
        config.on('reloadPackage', pkgName => this.loadPackage(pkgName));
    }

    public getPackage(pkg: string): Promise<AbstractHastePackage> {
        return new Promise<AbstractHastePackage>((resolve, reject) => {
            if (this.packages[pkg]) {
                resolve(this.packages[pkg]);
            } else {
                reject('did not find package with that name: ' + pkg);
            }
        });
    }

    public loadPackages() {
        let packagesDirs = PackageLoader.getDirectories(packagesPath);
        console.log(packagesDirs);
        packagesDirs.forEach((dirName) => {
            this.loadPackage(dirName);
        });
    }

    public loadPackage(dirName) {
        let absPath = path.join(packagesPath, dirName);
        let staticPath = 'packages/' + dirName + '/';
        if (!this.isViablePackage(absPath)) {
            return;
        }

        let relativePath = this.getRelativePath(absPath);
        let pkJson = this.getPackageJsonFromPath(absPath);
        let packageName = pkJson.name

        this.destroyIfExist(packageName);
        console.log('Loading package from ' + relativePath);

        new Haste(packageName).addCollection().go()
            .then((data) => {
                let pkgConfig = this.config.loadPkgConfig(packageName, absPath);
                let Package = eval("require('"+relativePath+"/index.js')");
                this.packages[packageName] = new Package(Haste, this.win, pkgConfig, staticPath);
                console.log("Loaded package '"+packageName+"'");

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
                    }).catch(err => console.error(err))
            })
            .catch((err) => console.error('cannot load package from: '+relativePath, err));
    }

    isViablePackage(absPath): boolean {
        if (!fs.existsSync(path.join(absPath, 'index.js'))) {
            console.error('Did not found index.js at ' + absPath);
            return false;
        }
        if (!fs.existsSync(path.join(absPath, 'package.json'))) {
            console.error('Did not found package.json at ' + absPath);
            return false;
        }
        return true;
    }

    getRelativePath(absPath) {
        let relPath = path.relative(__static, absPath);
        relPath = relPath.replace(/\\/g, '/');
        if (__dirname.endsWith('asar')) {
            relPath = '../static/' + relPath;
        } else {
            relPath = '../../static/' + relPath;
        }
        return relPath;
    }

    getPackageJsonFromPath(absPath): any {
        let pkJson = JSON.parse(fs.readFileSync(absPath+'/package.json', 'utf8'));
        return pkJson;
    }

    destroyIfExist(packageName): void {
        if (this.packages[packageName]) {
            console.log("package '" + packageName + "' already exist...");
            this.packages[packageName].destroy();
            this.packages[packageName] = null;
        }
    }

    public static getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path+'/'+file).isDirectory();
        });
    }

    // watchForPackages() {
    //     // if its a process that copying files wait for it to finish
    //     let placeHolder;
    //     fs.watch(packagesPath, (event, dirPath) => {
    //         clearTimeout(placeHolder);
    //         placeHolder = setTimeout(() => {
    //             console.log("Detect package '"+event+"', reloading '"+dirPath+"'");
    //             this.loadPackage(dirPath);
    //         }, 2000);
    //     });
    // }
}