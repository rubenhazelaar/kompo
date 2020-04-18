import isObject from '../util/isObject';

export default function deproxy(obj: any) {
    const isObj = isObject(obj),
        isArray = Array.isArray(obj);

    if (!isObj && !isArray) return obj;

    if (isArray) {
        obj = obj.slice();
        for (let i: number = 0, l = obj.length; i < l; ++i) {
            obj[i] = deproxy(obj[i]);
        }
    } else {
        obj = Object.assign({}, obj);
        const keys = Object.keys(obj);
        for (let i: number = 0, l = keys.length; i < l; ++i) {
            obj[keys[i]] = deproxy(obj[keys[i]]);
        }
    }

    return obj;
}