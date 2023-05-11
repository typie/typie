import AbstractTypiePackage from "./AbstractTypiePackage";
import AppGlobal from "./AppGlobal";
import GoDispatcher from "./GoDispatcher";
import Packet from "./models/Packet";
import SearchObject from "./models/SearchObject";
import TypieRowItem from "./models/TypieRowItem";
import TypieCore from "./TypieCore";

export {
    AbstractTypiePackage,
    AppGlobal,
    getPath,
    GoDispatcher,
    Packet,
    TypieCore,
    TypieRowItem,
    SearchObject,
};

import * as isDev from "electron-is-dev";
const getPath = (staticPath): string => {
    if (!isDev) {
        return "../static/" + staticPath;
    } else {
        return staticPath;
    }
};
