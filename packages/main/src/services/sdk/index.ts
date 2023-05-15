import AbstractTypiePackage from "./AbstractTypiePackage";
import AppGlobal from "./AppGlobal";
import GoDispatcher from "./GoDispatcher";
import Packet from "./models/Packet";
import SearchObject from "./models/SearchObject";
import TypieRowItem from "./models/TypieRowItem";
import TypieCore from "./TypieCore";
import is from "electron-is";

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

const getPath = (staticPath): string => {
    if (!is.dev()) {
        return "./../../static/" + staticPath;
    } else {
        return staticPath;
    }
};
