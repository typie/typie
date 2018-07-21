import fs from "fs";
import Path from "path";
import mkdirP from "mkdirp";
declare const __static: any;

export function randomStr(): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 100; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function getDirectories(path): string[] {
    return fs.readdirSync(path).filter(file => {
        return fs.statSync(path + "/" + file).isDirectory();
    });
}

export function getRelativePath(absPath): string {
    let relPath = Path.relative(__static, absPath);
    relPath = relPath.replace(/\\/g, "/");
    if (__dirname.endsWith("asar")) {
        relPath = "../static/" + relPath;
    } else {
        relPath = "../../static/" + relPath;
    }
    return relPath;
}

export async function createFolderIfNotExist(folderPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(folderPath)) {
            mkdirP(folderPath, err => {
                if (err) {
                    console.error("could not create folder: " + folderPath, err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}
