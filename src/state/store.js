import {update} from '../component/component';
import isObject from '../util/isObject';

const OBSERVED_KEY = '__kompo_observed__',
    IGNORE_KEY = '__kompo_ignore__',
    reservedKeys = ['length', IGNORE_KEY];

export default function observe(obj:any, root:KompoElement) {
    const isObj = isObject(obj),
        isArray = Array.isArray(obj);

    if ((!isObj && !isArray) || obj.hasOwnProperty(OBSERVED_KEY)) return obj;

    Object.defineProperty(obj, OBSERVED_KEY, {
        value: true
    });

    Object.defineProperty(obj, IGNORE_KEY, {
        value: [],
        writable: true
    });

    const keys = Object.keys(obj);
    for (let i = 0, l = keys.length; i < l; ++i) {
        const key = keys[i];
        if (reservedKeys.indexOf(key) === -1) {
            obj[key] = observe(obj[key], root);
        }
    }

    obj = new Proxy(obj, {
        deleteProperty: function (target, key) {
            delete target[key];
            requestAnimationFrame(() => update(root, obj));
            return true;
        },
        set: function (target, key, val) {
            if (reservedKeys.indexOf(key) === -1) {
                target[key] = observe(val, root);
                requestAnimationFrame(() => update(root, obj));
            } else {
                target[key] = val;
            }

            return true;
        }
    });

    return obj;
}

export function isProxy(obj:any) {
    return obj.hasOwnProperty(OBSERVED_KEY);
}

export function ignore(obj:any, ...statefulls:Array<statefull>) {
    obj[IGNORE_KEY] = statefulls;
}

export function shouldIgnore(obj:any, statefull:statefull) {
    return obj[IGNORE_KEY].indexOf(statefull) !== -1;
}

export function resetIgnore(obj) {
    obj[IGNORE_KEY] = [];
}

