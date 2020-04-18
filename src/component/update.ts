import {kompoBase, KompoElement, state} from '../types';

import {shouldIgnore, resetIgnore, isProxy } from "../state/store";
import {debugModeOn} from "./app";

export default function update(Element: KompoElement, state: state): void {
    const kompo = Element.kompo;

    if (debugModeOn() && kompo.debug) {
        console.groupCollapsed('UPDATE: ');
        console.log(Element);
        console.log(kompo);
    }

    updateStatefulls(Element, kompo, state);

    const mounts = kompo.mounts;
    if (mounts.length > 0) {
        if (debugModeOn() && kompo.debug) {
            console.groupCollapsed('MOUNTS: ');
        }

        for (let i = 0, l = mounts.length; i < l; ++i) {
            update(mounts[i], state);
        }

        if (debugModeOn() && kompo.debug) {
            console.groupEnd();
        }
    }

    if (debugModeOn() && kompo.debug) {
        console.groupEnd();
    }
}

function updateStatefulls(Element: KompoElement, kompo: kompoBase, state: state) {
    const statefulls = kompo.statefulls;

    // Only run if a component has statefulls
    if (statefulls.length == 0) return;

    const selector = kompo.selector,
        selectedState = selector ? selector(Element.__kompo__.state) : Element.__kompo__.state;

    if (selectedState && (state === selectedState || inProperties(selectedState, state))) {
        if (debugModeOn() && kompo.debug) {
            console.log('HAS DIRTY STATE: ', selectedState);
            console.groupCollapsed('REACTS: ');
        }

        for (let i = 0, l = statefulls.length; i < l; ++i) {
            const st = statefulls[i];

            if (shouldIgnore(state, st)) {
                resetIgnore(state);
                continue;
            }

            st(selectedState, Element);
        }

        if (debugModeOn() && kompo.debug) {
            console.groupEnd();
        }
    }
}

function inProperties(selectedState: state, state: state) {
    if (selectedState && !isProxy(selectedState)) {
        const keys = Object.keys(selectedState);
        for (let i = 0, l = keys.length; i < l; ++i) {
            if (state === selectedState[keys[i]]) {
                return true;
            }
        }
    }

    return false;
}