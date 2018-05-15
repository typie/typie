import fs from "fs";
import {AbstractHastePackage, Haste, HasteRowItem} from "haste-sdk";
import * as Path from "path";
import MainWindowController from "../controllers/MainWindowController";
import AppGlobal from "../helpers/AppGlobal";
import {getDirectories, getRelativePath} from "../helpers/HelperFunc";
import ConfigLoader from "./ConfigLoader";

declare const __static: any;
const packagesPath = Path.join(__static, "/packages");

export default class PackageLoader {

    private packages: object;
    private win: MainWindowController;
    private config: ConfigLoader;

    constructor(win: MainWindowController, config: ConfigLoader) {
        this.win = win;
        this.config = config;
        this.packages = {};
        this.loadPackages();
        // this.watchForPackages();
        config.on("reloadPackage", pkgName => this.loadPackage(pkgName));
        AppGlobal.setGlobal("PackageLoader", this);
    }

    public getPackage(pkg: string): Promise<AbstractHastePackage> {
        return new Promise<AbstractHastePackage>((resolve, reject) => {
            if (this.packages[pkg]) {
                resolve(this.packages[pkg]);
            } else {
                reject("did not find package with that name: " + pkg);
            }
        });
    }

    public loadPackages() {
        const packagesDirs = getDirectories(packagesPath);
        console.log(packagesDirs);
        packagesDirs.forEach((dirName) => {
            this.loadPackage(dirName);
        });
    }

    public loadPackage(dirName) {
        const absPath = Path.join(packagesPath, dirName);
        const staticPath = "packages/" + dirName + "/";
        if (!this.isViablePackage(absPath)) {
            return;
        }

        const relativePath = getRelativePath(absPath);
        const pkJson = this.getPackageJsonFromPath(absPath);
        const packageName = pkJson.name;

        this.destroyIfExist(packageName);
        console.log("Loading package from " + relativePath);

        new Haste(packageName).addCollection().go()
            .then((data) => {
                const pkgConfig = this.config.loadPkgConfig(packageName, absPath);
                const Package = eval("require('" + relativePath + "/index.js')");
                this.packages[packageName] = new Package(this.win, pkgConfig, staticPath);
                console.log("Loaded package '" + packageName + "'");

                this.globalInsertPackage(
                    new HasteRowItem()
                        .setDB("global")
                        .setDescription("Package")
                        .setIcon(this.packages[packageName].icon)
                        .setTitle(packageName));
            })
            .catch((err) => console.error("cannot load package from: " + relativePath, err));
    }

    public isViablePackage(absPath): boolean {
        if (!fs.existsSync(Path.join(absPath, "index.js"))) {
            console.error("Did not found index.js at " + absPath);
            return false;
        }
        if (!fs.existsSync(Path.join(absPath, "package.json"))) {
            console.error("Did not found package.json at " + absPath);
            return false;
        }
        return true;
    }

    public getPackageJsonFromPath(absPath): any {
        const pkJson = JSON.parse(fs.readFileSync(absPath + "/package.json", "utf8"));
        return pkJson;
    }

    public destroyIfExist(packageName): void {
        const pkg: AbstractHastePackage = this.packages[packageName];
        if (pkg) {
            console.log("package '" + packageName + "' already exist...");
            pkg.destroy();
            delete this.packages[packageName];
        }
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

    private globalInsertPackage(item: HasteRowItem) {
        new Haste("global").insert(item, false).go()
            .then(res => {
                if (res.err === 0) {
                    console.log("Package '" + item.getTitle() + "' is now searchable.");
                }
            })
            .catch(err => console.error(err));
    }
}
