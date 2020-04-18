import {KompoElement} from '../types';

import {debugModeOn} from "./app";

/**
 * Renders given component
 *
 * @param Element
 */
export default function render(Element: KompoElement): void {
    const kompo = Element.kompo;
    if (!kompo.initial) return;

    if (debugModeOn() && kompo.debug) {
        console.groupCollapsed('RENDER: ');
        console.log(Element);
        console.log(kompo);
        console.groupCollapsed('CONSTRUCT: ');
    }

    // Construct then ...
    Element.construct(kompo.props);
    kompo.initial = false;

    if (debugModeOn() && kompo.debug) {
        console.groupEnd();
    }

    // ... react
    const statefulls = kompo.statefulls,
        selector = kompo.selector,
        state = selector ? selector(Element.__kompo__.state) : Element.__kompo__.state;

    if (statefulls.length > 0 && state) {
        if (debugModeOn() && kompo.debug) {
            console.log('HAS STATE: ', state);
            console.groupCollapsed('REACTS: ');
        }

        for (let i = 0, l = statefulls.length; i < l; ++i) {
            statefulls[i](state, Element);
        }

        if (debugModeOn() && kompo.debug) {
            console.groupEnd();
        }
    }

    if (debugModeOn() && kompo.debug) {
        console.groupEnd();
    }
}