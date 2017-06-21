// @flow
import hasProxy from '../util/hasProxy';
import isObject from '../util/isObject';

const reservedKeys = ['length', '__kompo_dirty__'];

export default function observe(obj:any) {
    const isObj = isObject(obj),
        isArray = Array.isArray(obj);

    if (!isObj && !isArray) return obj;

    Object.defineProperty(obj, '__kompo_dirty__', {
        writable: true,
        value: []
    });

    if (!hasProxy) {
        obj = observeObjectFallback(obj);
    } else {
        const keys = Object.keys(obj);
        for (let i = 0, l = keys.length; i < l; ++i) {
            const key = keys[i];
            if (reservedKeys.indexOf(key) === -1) {
                obj[key] = observe(obj[key]);
            }
        }

        if (isArray) {
            obj = new Proxy(obj, {
                apply: function (target, thisArg, argumentList) {
                    target.__kompo_dirty__.push(true);
                    return thisArg[target].apply(this, argumentList);
                },
                deleteProperty: function (target) {
                    target.__kompo_dirty__.push(true);
                    return true;
                },
                set: function (target, prop, val) {
                    if (
                        prop !== '__kompo_dirty__'
                        && val != target[prop]
                        && target.__kompo_dirty__.indexOf(prop) === -1
                    ) {
                        target.__kompo_dirty__.push(prop);
                    }

                    target[prop] = observe(val);
                    return true;
                }
            });
        } else {
            obj = new Proxy(obj, {
                get: function (target, prop) {
                    return target[prop];
                },
                set: function (target, prop, val) {
                    if (
                        prop !== '__kompo_dirty__'
                        && val != target[prop]
                        && target.__kompo_dirty__.indexOf(prop) === -1
                    ) {
                        target.__kompo_dirty__.push(prop);
                    }

                    target[prop] = observe(val);
                    return true;
                }
            });
        }
    }

    return obj;
}

function observeObjectFallback(obj: any): any {
    const keys = Object.keys(obj);
    for (let i = 0, l = keys.length; i < l; ++i) {
        const key = keys[i],
            newKey = '__' + key,
            v = obj[key];

        Object.defineProperty(obj, newKey, {
            writable: true,
            value: v
        });

        Object.defineProperty(obj, key, {
            get: function () {
                return this[newKey]
            },
            set: function (val) {
                if (isObject(val)) {
                    observe(val);
                }

                if (val != this[key] && obj.__kompo_dirty__.indexOf(key) === -1) {
                    obj.__kompo_dirty__.push(key);
                }
                this[newKey] = val;
            }
        });

        obj[key] = v;
    }

    return obj;
}

export function inheritObserved(obj:any, ignored: Array<any> = []): any {
    Object.defineProperty(obj, '__kompo_dirty__', {
        writable: true,
        value: []
    });

    const keys = Object.keys(obj);

    for (let i = 0, l = keys.length; i < l; ++i) {
        const key = keys[i],
            value = obj[key];

        if(ignored.indexOf(key) !== -1) continue;

        if(typeof value === 'undefined') return;

        if(
            value
            && value.hasOwnProperty('__kompo_dirty__')
            && value.__kompo_dirty__.length > 0
        ) {
            obj.__kompo_dirty__.push(true);
        }
    }

    return obj;
}

export function markClean(obj: any): void {
    const isObj = isObject(obj),
        isArray = Array.isArray(obj);

    if (!isObj && !isArray) return obj;

    obj.__kompo_dirty__ = [];

    if (isArray) {
        for (let i = 0, l = obj.length; i < l; ++i) {
            markClean(obj[i]);
        }
    } else {
        const keys = Object.keys(obj);
        for (let i = 0, l = keys.length; i < l; ++i) {
            markClean(obj[keys[i]]);
        }
    }
}

export function markDirty(obj:any): void {
    if (!obj.hasOwnProperty('__kompo_dirty__')) {
        Object.defineProperty(obj, '__kompo_dirty__', {
            writable: true,
            value: []
        });
    }
    obj.__kompo_dirty__.push(true);
}