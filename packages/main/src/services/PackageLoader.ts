import type {Stats} from "fs";
import fs from "fs";
import type {AbstractTypiePackage} from "/@/services/sdk/index";
import { AppGlobal, TypieCore, TypieRowItem} from "/@/services/sdk/index";
import * as Path from "path";
import {app} from "electron";
import type MainWindowController from "../controllers/MainWindowController";
import {createFolderIfNotExist, getDirectories, getRelativePath} from "../helpers/HelperFunc";
import type ConfigLoader from "./ConfigLoader";
import chokidar from "chokidar";
import Typie from "../packages/typie/Typie";
import Calculator from "../packages/calculator/Calculator";
import npm from "npm";

let watcher: any;

export default class PackageLoader {

    private packages: object;
    private win: MainWindowController;
    private config: ConfigLoader;
    private timeoutsArray: any;
    private packagesPath: string;

    constructor(win: MainWindowController, config: ConfigLoader) {
        this.packagesPath = AppGlobal.paths().getPackagesPath();
        this.win = win;
        this.config = config;
        this.packages = {};
        this.timeoutsArray = {};

        config.on("reloadPackage", pkgName => this.loadPackage(pkgName));
        AppGlobal.set("PackageLoader", this);
    }

    public loadAll() {
        this.loadTypiePkg();
        this.loadPackages();
    }

    public getPackage(pkg: string): Promise<AbstractTypiePackage> {
        return new Promise<AbstractTypiePackage>((resolve, reject) => {
            if (this.packages[pkg]) {
                resolve(this.packages[pkg]);
            } else {
                reject("package loader did not find: '" + pkg + "' pkg");
            }
        });
    }

    public getPackageFromList(pkgList: string[]): Promise<AbstractTypiePackage> {
        if (pkgList.length === 1) {
            return this.getPackage(pkgList[0]);
        } else if (pkgList.length > 1) {
            let pkg: any = this;
            return new Promise<AbstractTypiePackage>((resolve, reject) => {
                while (pkgList.length >= 1) {
                    const pk: any = pkgList.shift();
                    if (pkg.packages[pk]) {
                        pkg = pkg.packages[pk];
                    } else {
                        reject("package loader did not find: '" + pk + "' pkg in " + pkg.getPackageName());
                    }
                }
                resolve(pkg);
            });
        } else {
            return new Promise<AbstractTypiePackage>((resolve, reject) =>
                reject("cannot get package with empty pkgList"));
        }
    }

    public loadPackages() {
        createFolderIfNotExist(this.packagesPath)
            .then(() => {
                const packagesDirs = getDirectories(this.packagesPath);
                const promises: Array<Promise<any>> = [];
                console.info("packages:", packagesDirs);
                packagesDirs.forEach((dirName) => {
                    promises.push(this.loadPkgPromise(dirName));
                });
                Promise.all(promises)
                    .then(data => {
                        console.info("All " + promises.length + " packages loaded successfully");
                        this.config.watchConfDir();
                        this.watchPakcagesFolder();
                    })
                    .catch(e => {
                        console.warn(e);
                        this.config.watchConfDir();
                        this.watchPakcagesFolder();
                    });
            })
            .catch((e) => {
                console.error("could not create folder: " + this.packagesPath, e);
                throw new Error("could not create folder: " + this.packagesPath);
            });
    }

    public loadPackage(dirName, callBack?: (pkg) => void , errCallBack?: () => void) {
        const absPath = Path.join(this.packagesPath, dirName);
        if (!this.isViablePackage(absPath)) {
            return;
        }

        const relativePath = getRelativePath(absPath);
        const pkJson = this.getPackageJsonFromPath(absPath);
        const packageName = pkJson.typie.title;

        this.destroyIfExist(packageName);
        console.info("Loading package from " + relativePath);

        Promise.all([
            this.installDependencies(absPath),
            (new TypieCore(packageName)).addCollection().go(),
        ]).then(data => {
            const pkgConfig = this.config.loadPkgConfig(packageName, absPath);
            const Package = eval("require('" + relativePath + "/index.js')");
            this.packages[packageName] = new Package(this.win, pkgConfig, packageName);
            const pkgItem = this.addPkgToGlobal(packageName);
            this.watchPakcagesFolder();
            if (callBack) {
                callBack(pkgItem);
            }
        }).catch((err) => {
            console.error("cannot load package from: " + relativePath, err);
            this.watchPakcagesFolder();
            if (errCallBack) {
                errCallBack();
            }
        });
    }

    public loadPkgPromise(dirName) {
        return new Promise((resolve, reject) => {
            this.loadPackage(dirName, (pkgItem) => {
                resolve(pkgItem);
            }, () => {
                reject();
            });
        });
    }

    public addPkgToGlobal(pkgName) {
        console.info("Loaded package '" + pkgName + "'");
        const newGlobalPackage = new TypieRowItem(pkgName)
            .setDB("global")
            .setPackage("global")
            .setPath(pkgName)
            .setDescription("Package")
            .setIcon(this.packages[pkgName].icon);
        this.globalInsertPackage(newGlobalPackage);
        return newGlobalPackage;
    }

    public installDependencies(absPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(Path.join(absPath, "node_modules"))) {
                console.info("installing dependencies");
                this.stopWatch();
                npm.load({}, (er) => {
                    if (er) {
                        console.error("Installing Dependencies for " + absPath + " failed 1", er);
                        reject(er);
                    }
                    npm.commands.install(absPath, [], (err, data) => {
                        if (err) {
                            console.error("Installing Dependencies for " + absPath + " failed 2", err);
                            reject(err);
                        }
                        resolve(data);
                    });
                });
            } else {
                resolve();
            }
        });
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
        const pkg: AbstractTypiePackage = this.packages[packageName];
        if (pkg) {
            console.info("package '" + packageName + "' already exist...");
            pkg.destroy();
            delete this.packages[packageName];
        }
    }

    private loadTypiePkg() {
        const typieName = "Typie";
        (new TypieCore(typieName)).addCollection().go()
            .then(() => {
                this.packages[typieName] = new Typie(this.win, [], typieName);
                this.addPkgToGlobal(typieName);
            }).catch(e => console.error(e));

        const calcName = "Calculator";
        (new TypieCore(calcName)).addCollection().go()
            .then(() => {
                this.packages[calcName] = new Calculator(this.win, [], calcName);
                this.addPkgToGlobal(calcName);
            }).catch(e => console.error(e));
    }

    private globalInsertPackage(item: TypieRowItem) {
        new TypieCore(item.getPackage(), "global").insert(item, false).go()
            .then(res => {
                if (res.err === 0) {
                    console.info("Package '" + item.getTitle() + "' is now searchable.");
                }
            })
            .catch(err => console.error(err));
    }

    private stopWatch() {
        if (watcher) {
            watcher.close();
            watcher = null;
        }
    }

    private watchPakcagesFolder() {
        console.info("Watching Packages folder...");
        this.stopWatch();

        // Initialize watcher.
        watcher = chokidar.watch(this.packagesPath, {
            ignored: [
                "node_modules",
                "bower_components",
                /(^|[\/\\])\../,
            ],
            persistent: true,
        });

        watcher.on("change", (path: string, stats: Stats) => {
            if (stats) {
                let packageChanged = path.split(Path.join(this.packagesPath, "/"))[1];
                packageChanged = packageChanged.split(Path.sep).shift() || "";
                if (packageChanged) {
                    clearTimeout(this.timeoutsArray[packageChanged]);
                    this.timeoutsArray[packageChanged] = setTimeout(() => {
                        console.info(`files change detected at '${packageChanged}'`);
                        this.loadPackage(packageChanged);
                    }, 1000);
                }
            }
        });
    }
}
