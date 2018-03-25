const walk = require('walk');
const fs = require('fs');
const path = require('path');
const {app} = require('electron');
const lnk = require('./icons');
const is = require('electron-is');

exports.run = function(dir, extArray, haste) {
    console.log(dir);
    return new Promise((resolve, reject) => {
        let walker = walk.walk(dir);
        let results = [];

        walker.on("directory", (root, fileStats, next) => {
            let fileExt = path.extname(fileStats.name);
            let fileFull = path.join(root, fileStats.name);

            if (fileExt === '.app') {
                console.log(fileStats.name);
                results.push({title: fileStats.name, t: 'Files', d: "", path: fileFull, icon: defaultFileIco});
                next();
                /*
                haste.getKey(fileStats.name).go()
                    .then((res) => {
                        if (res.err === 1) {
                            // app.getFileIcon(fileFull, {size: 'normal'}, function (err, res) {
                            //     if (err) {
                            //         console.log(err);
                            //         results.push(item);
                            //         next();
                            //     } else {
                            //         console.log('getFileIcon', res);
                            //         item.icon = res.toDataURL();
                            //         results.push(item);
                            //         next();
                            //     }
                            // })
                            results.push(item);
                            next();
                        } else {
                            // Skip file for it is already in memory
                            next();
                        }
                    })
                    .catch(err => {
                        next();
                    });
                    */
            } else {
                next();
            }
        });
        /*
        walker.on("file", (root, fileStats, next) => {
            let fileExt = path.extname(fileStats.name);
            let fileFull = path.join(root, fileStats.name);
            let basename = path.basename(fileStats.name, fileExt);
            //console.log('fileFull', fileFull);
            if (extArray.includes(fileExt)) {
                //console.log('haste get key', basename);
                haste.getKey(basename).go()
                    .then((res) => {
                        if (res.err === 1) {
                            fs.readFile(fileStats.name, function () {
                                getRowFromPath(results, fileFull, fileExt, next);
                            });
                        } else {
                            // Skip file for it is already in memory
                            console.log('skip', fileStats.name);
                            next();
                        }
                    })
                    .catch(err => {
                        console.log('some error', err);
                        next();
                    });
            } else {
                next();
            }
        });
        */

        walker.on("errors", function (root, nodeStatsArray, next) {
            console.log('some error2', root);
            next();
        });

        walker.on("end", function () {
            console.log('end walk');
            resolve(results);
        });
    });
};


function getRowFromPath (results, fileFull, fileExt, next) {
    let file = path.basename(fileFull);
    let basename = path.basename(file, fileExt);
    let fileDir = path.parse(fileFull).dir;
    let description = '';

    // for (let i = 0; i < this.dirs.length; i++) {
    //     if (fileDir.includes(this.dirs[i][1])) {
    //         let relative = path.relative(this.dirs[i][1], fileDir)
    //         relative = relative === '' ? relative : ' · ' + relative
    //         description = this.dirs[i][0] + relative
    //     }
    // }

    let item = {title: basename, t: 'Files', d: description, path: fileFull, icon: defaultFileIco};

    if (fileExt === '.lnk' && is.windows()) {
        getIconFromLnk(fileFull, item, results, next);
    } else if (fileExt === '.url' && is.windows()) {
        item.icon = defaultUrlIco;
        getIconFromUrl(fileFull, item, results, next);
    } else {
        app.getFileIcon(fileFull, {size: 'normal'}, function (err, res) {
            if (err) {
                console.log(err);
                results.push(item);
                next();
            } else {
                item.icon = res.toDataURL();
                results.push(item);
                next();
            }
        })
    }
}

function getIconFromLnk (fileFull, item, results, next) {
    lnk.queryLnk(fileFull, function (err, iconFile, icon) {
        if (err) {
            console.log(err);
            results.push(item);
            next();
        } else {
            if (icon) {
                item.icon = icon;
                results.push(item);
                next();
            } else {
                app.getFileIcon(path.resolve(iconFile), {size: 'normal'}, function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        item.icon = res.toDataURL();
                    }
                    results.push(item);
                    next();
                })
            }
        }
    })
}

function getIconFromUrl (fileFull, item, results, next) {
    lnk.queryUrl(fileFull, (err, iconFile) => {
        if (err) {
            results.push(item);
            next();
        } else {
            app.getFileIcon(path.resolve(iconFile), {size: 'normal'}, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    item.icon = res.toDataURL();
                }
                results.push(item);
                next();
            })
        }
    })
}

const defaultFileIco = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQ9SURBVFhH7ZfbU1tVFMYzffDF6av/gDP+Fb5jbbWWcmmh15RWqTN0KgUBgZJA7gGaBqiU0BAuIRACxWq1WF9rIfWhT/pU3/AFyO3k5Aqfa52TyymelItOfNA9880+7L3Z32+tvc7JOZr/27/eLHZHp67PjHKqz2jTkfVbpCMak8W289urdbz89XfSq39Un7U7VHuGIPN3JAizdUD8eTWIv6PVtRdYC/6CtReyVun6OY2x1NbnAN4lva2hdIixeALpVBKpZOIQkv8vqaLda9lDTGXyAO+RjhKAVeTBcuovAJlsVppYWXmGpz+93JdWfnyGbCYtKRgMqiof+fvXJyTxtSpANgfAG1d1LaC624+annnU6udwxuDDWZMP9TYv6vtncN4xhQvOSWntH+vrSCXiBaNSOhDAZfMytNaH0NqW0DCwiKuOAK45F/DpyDwaR+dw3eXD5+5ZBYCgGj1rXwD8x7YCoMn5HZqGv8WNe49w8z7JtYxm90Pc8iyhZXoRrd4A2ub8BYA0AfDGyaQo9wm5V4rNK3qHpWtVAEGUJ3jTtvEn6HD/gA7P9+icfowvyPyG24/GcS+ujLmhdY2jYcJVBBDjqtGz8gBsfuqerTRAVBALAHrvU9yeeYKGIR9OmsfwgXEIH1rv4kS/Ax/dGcRJZz9OjdgUALkMUOTS7cf9riywef1Mz/4Amh98gxOGUVT0DeOY2YnjNjIfuIOP7w7gk2G7tNnp+xYFQEw1elYegM0bHzeVBogpACr0I3LUFjIvRE3mI3ZUfm3F6TEzqh8YiwBUA0l6GCXoKPKGu8XmbwaIFwGOmXIp56gdZD5EKaeoK0ctqHKZUOM24IyntwCQoiNQi551AAB5gjc9bqeoBxUp56gp5dXjJtRO9OHspB51lNICQFw40GN8TwBloVWOWlFFKa+hlNd6yHxKR+d5G+d9XUUAOgK16FmHAlAWWnU+5ZO9qJvuwTlvNy7MdeKSv/01gFTuDlAz3K09AZSFJqV8Si9HPduFi/Nf4dJCO7SLrQWABNUAF6DaA4jHRJqLRqMIh8OIhEN7AygLrW5aR1Fzyjtx0d+By4E2XFlqRcPyrQJA8g23YTJB+xJgJBJGKBRCOLRVAkDxJFQW2rlZTjlFTSnXBr4k8xZcXW7GtUc3FQBR1ejzGYhTkXLkm5ub2NraVAeIi/KLwuTUorTxfjThCchHQAZq0bPigoBYNELGWzIASRUgEpMzwL/tvOlBFI8VM8A914MgxBClcT53jnpjY0NSSYBQNAH+ScZ2CumkACANZGksFUeGhO0kje2Qtkm0jueRwk5GLjI2ls1FCJSRGJlHKfIwnT2ff16cjZIAPFEuvQbA7+jdOkOCBw+jXqMVRosdFvsgTNZBGEw26FXWKdXc0j5E5vJbMTX+QOB3dB5gqnKIveTvAmpHchdMc7RMYi/5y+g/3jSaPwH2G61IeD/6MgAAAABJRU5ErkJggg=='
const defaultUrlIco = 'data:image/png;base64,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'
