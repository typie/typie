
import AbstractHastePackage from "./AbstractHastePackage";
import GoDispatcher from "./GoDispatcher";
import Haste from "./Haste";
import HasteRowItem from "./models/HasteRowItem";
import SearchObject from "./models/SearchObject";

export {
    AbstractHastePackage,
    getPath,
    GoDispatcher,
    Haste,
    HasteRowItem,
    SearchObject,
};

import * as isDev from "electron-is-dev";
const getPath = (staticPath) => {
    if (!isDev) {
        return "../static/" + staticPath;
    } else {
        return staticPath;
    }
};
