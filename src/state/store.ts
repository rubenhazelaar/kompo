import {KompoElement, state, statefull} from "../types";

import update from '../component/update';
import {getState} from "../component/state";
import isObject from '../util/isObject';

const OBSERVED_KEY = '__kompo_observed__',
    IGNORE_STATEFULL_KEY = '__kompo_ignore_statefulls__',
    IGNORE_KEY = '__kompo_ignore__',
    TRIGGER_UPDATE_KEY = '__kompo_trigger_update__', // IMPORTANT Should not be in reserved keys
    reservedKeys: Array<string | number | symbol> = ['length', IGNORE_STATEFULL_KEY, IGNORE_KEY];

export default function observe(obj: any, root: KompoElement) {
    const isObj = isObject(obj),
        isArray = Array.isArray(obj);

    if ((!isObj && !isArray) || obj.hasOwnProperty(OBSERVED_KEY)) return obj;

    Object.defineProperty(obj, OBSERVED_KEY, {
        value: true
    });

    Object.defineProperty(obj, IGNORE_STATEFULL_KEY, {
        value: [],
        writable: true
    });

    Object.defineProperty(obj, IGNORE_KEY, {
        value: false,
        writable: true
    });

    Object.defineProperty(obj, TRIGGER_UPDATE_KEY, {
        value: true,
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
            if (!obj[IGNORE_KEY]) requestAnimationFrame(() => update(root, obj));
            return true;
        },
        set: function (target, key, val) {
            if (reservedKeys.indexOf(key) > -1) {
                target[key] = val;
            } else {
                target[key] = observe(val, root);

                if (!obj[IGNORE_KEY]) {
                    requestAnimationFrame(() => update(root, obj));
                }
            }

            return true;
        }
    });

    return obj;
}

export function isProxy(obj: any) {
    return obj.hasOwnProperty(OBSERVED_KEY);
}

export function ignore(obj: any, ...statefulls: Array<statefull>) {
    obj[IGNORE_STATEFULL_KEY] = statefulls;
}

export function shouldIgnore(obj: any, statefull: statefull) {
    return obj[IGNORE_STATEFULL_KEY].indexOf(statefull) !== -1;
}

export function resetIgnore(obj: any) {
    obj[IGNORE_STATEFULL_KEY] = [];
}

export function dispatch(Element: KompoElement, cb: (state: state) => void, silent?: boolean): void {
    if (!cb) return;

    const state = getState(Element);
    ignoreUpdate(state);
    cb(state);
    resetIgnoreUpdate(state);
    if (!silent) triggerUpdate(state);
}

export function ignoreUpdate(obj: any) {
    obj[IGNORE_KEY] = true;
}

export function resetIgnoreUpdate(obj: any) {
    obj[IGNORE_KEY] = false;
}

export function triggerUpdate(obj: any) {
    obj[TRIGGER_UPDATE_KEY] = true;
}