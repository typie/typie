import fs from "fs";
import {AbstractHastePackage, Haste, HasteRowItem} from "haste-sdk";
import Path from "path";
import MainWindowController from "../controllers/MainWindowController";
import {getDirectories, getRelativePath} from "../helpers/HelperFunc";
import Settings from "./Settings";

declare const __static: any;
const packagesPath = Path.join(__static, "/packages");

export default class PackageLoader {

    private packages: object;
    private win: MainWindowController;
    private config: Settings;

    constructor(win: MainWindowController, config: Settings) {
        this.win = win;
        this.config = config;
        this.packages = {};
        this.loadPackages();
        // this.watchForPackages();
        config.on("reloadPackage", pkgName => this.loadPackage(pkgName));
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
        const absPath = path.join(packagesPath, dirName);
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
                this.packages[packageName] = new Package(Haste, this.win, pkgConfig, staticPath);
                console.log("Loaded package '" + packageName + "'");

                const item = new HasteRowItem();
                item.setDB("global");
                item.setDescription("Package");
                item.setIcon(this.packages[packageName].icon);
                item.setTitle(packageName);
                new Haste("global").insert(item, false).go()
                    .then(res => {
                        if (res.err === 0) {
                            console.log("Package '" + packageName + "' is now searchable.");
                        }
                    }).catch(err => console.error(err));
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
        if (this.packages[packageName]) {
            console.log("package '" + packageName + "' already exist...");
            this.packages[packageName].destroy();
            this.packages[packageName] = null;
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
}
