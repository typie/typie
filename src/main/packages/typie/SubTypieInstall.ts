import {AbstractTypiePackage, AppGlobal, TypieRowItem, TypieCore, getPath} from "typie-sdk";
import {app, shell} from "electron";
import Path from "path";
import axios, {AxiosPromise} from "axios";
import download from "download-git-repo";
import fs from "fs-extra";

export default class SubTypieInstall extends AbstractTypiePackage {

    constructor(win, config, pkgPath) {
        super(win, config, pkgPath);
        this.packageName = "Typie->Install";
        this.db = "Typie";
        this.typie = new TypieCore(this.packageName, "Typie");
        this.icon = getPath("themes/default/images/icons/icon.png");
    }

    public activate(pkgList, item, cb) {
        console.info("activate install", item.getPath());
        this.win.send("listLoading", {data: "Downloading Package..."});
        this.win.send("resultMsg", {data: "Downloading..."});
        const pkgDir = Path.join(AppGlobal.paths().getPackagesPath(), item.getTitle());
        fs.remove(pkgDir)
            .then(() => this.startDownload(pkgDir, item))
            .catch(e => {
                console.error("Cant remove old folder", e);
                this.win.send("resultMsg", {data: "Install failed"});
                this.sendEmptyResult();
            });
    }

    public enterPkg(pkgList, item, cb) {
        this.win.send("listLoading", {data: "Loading Packages...", length: 0, err: 0});
        this.win.send("resultMsg", {data: "loading..."});
        axios.get("https://api.github.com/users/typie/repos")
            .then(res => {
                const repos = res.data;
                const reposToFetch: any = [];
                for (const repo of repos) {
                    if (repo.name.endsWith("-pkg")) {
                        reposToFetch.push(repo);
                    }
                }
                this.fetchAllPkgs(reposToFetch);
            })
            .catch(e => {
                this.win.send("resultMsg", {data: "Loading timed out"});
                this.sendEmptyResult();
                console.log(e);
            });
    }

    public fetchAllPkgs(reposToFetch) {
        const promises: Array<AxiosPromise<any>> = [];
        const availablePkgs = {};
        for (const repo of reposToFetch) {
            const url = "https://raw.githubusercontent.com/" + repo.full_name + "/master/package.json";
            promises.push(axios.get(url));
        }
        axios.all(promises).then((results) => {
            for (const res of results) {
                if (res.status === 200) {
                    availablePkgs[res.data.name] = res.data;
                }
            }
            this.buildResultList(availablePkgs);
        });
    }

    private startDownload(pkgDir, item) {
        // shell.openExternal("https://github.com/" + item.getPath());
        download(item.getPath(), pkgDir, (err) => {
            if (err) {
                this.win.send("resultMsg", {data: "Download failed"});
                this.sendEmptyResult();
                console.error("Download pkg error", err);
            } else {
                this.win.send("listLoading", {data: "Installing Package..."});
                this.win.send("resultMsg", {data: "Installing..."});
                this.startInstall(item);
            }
        });
    }

    private startInstall(item) {
        AppGlobal.get("PackageLoader").loadPkgPromise(item.getTitle())
            .then((pkgItem) => {
                this.win.send("changePackage", null);
                this.win.send("resultList", {data: [pkgItem], length: 0, err: 0});
                this.win.send("resultMsg", {data: item.getTitle() + " Installed!"});
            })
            .catch(er => {
                this.win.send("resultMsg", {data: "Install failed"});
                this.sendEmptyResult();
                console.error(er);
            });
    }

    private buildResultList(pkgs) {
        const resultList: TypieRowItem[] = [];
        for (const pkg in pkgs) {
            if (pkgs.hasOwnProperty(pkg)) {
                const labels = pkgs[pkg].typie.labels;
                labels.unshift({text: "v" + pkgs[pkg].version});
                resultList.push(
                    new TypieRowItem(pkgs[pkg].typie.title)
                        .setDB(this.db)
                        .setPackage(this.packageName)
                        .setDescription(pkgs[pkg].typie.description)
                        .setIcon(this.icon)
                        .setPath("typie/" + pkg)
                        .setLabels(pkgs[pkg].typie.labels));
            }
        }

        this.win.send("resultList", {data: resultList, length: resultList.length, err: 0});
        this.win.send("resultMsg", {data: "found " + resultList.length + " packages"});
        this.typie.multipleInsert(resultList).go().then().catch();
    }

    private sendEmptyResult() {
        this.win.send("resultList", {data: [], length: 0, err: 1});
    }
}
