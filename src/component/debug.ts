import {KompoElement} from "../types";

export function debug(el: KompoElement, level?: number) {
    if (!el.hasOwnProperty('kompo')) {
        throw new Error('Is not a KompoElement');
    }

    const kompo = el.kompo,
        mounts = kompo.mounts;

    console.log(el, kompo);

    if (level && Number.isInteger(level) && level > 0 && mounts.length > 0) {
        console.groupCollapsed('MOUNTS: ');

        const nl = --level;
        for (let i = 0, l = mounts.length; i < l; ++i) {
            debug(mounts[i], nl);
            console.log('__END_OF_MOUNT__');
        }

        console.groupEnd();
    }

    return el;
}

export function debugLifeCycle(el: KompoElement) {
    if (!el.hasOwnProperty('kompo')) {
        throw new Error('Is not a KompoElement');
    }

    // Set to true so render & update functions log the components life cycle
    el.kompo.debug = true;

    return el;
}