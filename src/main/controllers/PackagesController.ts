import Haste from "../services/Haste";
import AbstractHastePackage from "../models/AbstractHastePackage";

export default class PackagesController extends AbstractHastePackage
{
    public static init()
    {
        let packages = {};
        let haste = new Haste(this);

        packages["MovieSearch"] = require('../../../static/packages/MovieSearch');

        for (let pkg in packages) {
            // console.log(pkg)
            console.log(pkg + ' Package Loaded');
            // let tmp = db.catalog.where(function (obj) {
            //     return obj.title === pkg && obj.t === 'Plugin'
            // });
            //if (tmp.length === 0) {
                db.catalog.insert({title: pkg, t: 'Plugin', d: 'Plugin', icon: hasteIcon, path: 'package-' + pkg})
            //}
        }
    }
}