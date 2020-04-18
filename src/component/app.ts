import {KompoElement, router, selector} from "../types";

import observe from '../state/store';
import render from './render';
import {setState} from "./state";

let _KOMPO_DEBUG_MODE_ON_ = false;

export default function app(root: KompoElement, state: any, router?: router, debugModeOn?: boolean): { start: (selector?: selector) => KompoElement } {
    if (!window) throw new Error('cannot initialize Kompo, window not available');

    if (debugModeOn) {
        _KOMPO_DEBUG_MODE_ON_ = true;
    }

    state = observe(state, root);

    /**
     * Adds construct function to Element prototype
     */
    Object.defineProperty(window.Element.prototype, 'construct', {
        writable: true,
        value: function () {
            throw new Error('Must override the construct method');
        }
    });

    /**
     * Adds kompo to
     */
    Object.defineProperty(window.Element.prototype, 'kompo', {
        writable: true,
        value: undefined
    });

    // Make available for all Elements
    Object.defineProperty(window.Element.prototype, '__kompo__', {
        value: {
            root,
            state,
            router
        }
    });

    return {
        start: function (selector?: selector): KompoElement {
            if (selector) {
                setState(root, selector);
            }
            requestAnimationFrame(() => render(root));
            return root
        }
    };
}

export function debugModeOn(): boolean {
    return _KOMPO_DEBUG_MODE_ON_;
}