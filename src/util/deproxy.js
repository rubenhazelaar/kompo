// @flow
import isObject from '../util/isObject';

export default function deproxy(obj) {
    var isObj = isObject(obj),
        isArray = Array.isArray(obj);

    if (!isObj && !isArray) return obj;

    if (isArray) {
        obj = obj.slice();
        for (var i = 0, l = obj.length; i < l; ++i) {
            obj[i] = deproxy(obj[i]);
        }
    } else {
        obj = Object.assign({},obj);
        var keys = Object.keys(obj);
        for (var i = 0, l = keys.length; i < l; ++i) {
            obj[keys[i]] = deproxy(obj[keys[i]]);
        }
    }

    return obj;
}