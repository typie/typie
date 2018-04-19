import fs from "fs";
import Path from "path";

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
