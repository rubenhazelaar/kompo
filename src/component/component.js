// @flow
import merge from '../util/merge';
import hasProxy from '../util/hasProxy';
import isObject from '../util/isObject';
import {markClean} from '../state/observe';

Object.defineProperty(Element.prototype, 'create', {
    writable: true,
    value: function () {
        throw new Error('Must override the create method');
    }
});

export default function component(tag:string, createFn:createFn, defaultProps:props = {}):(props:props)=> KompoElement {
    return (props = {}) => {
        const c = kompo(document.createElement(tag));
        c.kompo.props = merge(Object.assign({}, defaultProps), props);
        c.create = createFn;
        return c;
    };
}

export function render(Element:KompoElement):void {
    const kompo = Element.kompo;
    if (kompo.initial) {
        Element.create(kompo.props);
        kompo.initial = false;
    } else {
        update(Element)
    }
}

export function update(Element:KompoElement):void {
    const kompo = Element.kompo,
        mounts = kompo.mounts,
        selector = kompo.selector,
        state = selector ? selector(Element.__kompo__.state) : Element.__kompo__.state;

    for (let i = 0, l = mounts.length; i < l; ++i) {
        render(mounts[i]);
    }

    // State is false, do not run statefulls
    if (!state) return;

    // If is object and flagged dirty or not at all than do not update
    const checkIfDirty = hasProxy ? isObject(state) || Array.isArray(state) : isObject(state);
    if (checkIfDirty && state.hasOwnProperty('__kompo_dirty__') && state.__kompo_dirty__.length === 0) {
        return;
    }

    const statefulls = kompo.statefulls;
    for (let i = 0, l = statefulls.length; i < l; ++i) {
        statefulls[i](state, Element);
    }

    if (checkIfDirty && Element === Element.__kompo__.root) {
        markClean(state);
    }
}

export function kompo(Element:Element):KompoElement {
    Element.kompo = {
        initial: true,
        props: {},
        defaultProps: {},
        mounts: [],
        statefulls: [],
        slots: {},
        routed: undefined,
        selector: undefined,
        state: undefined
    };

    return Element;
}

export function setState(Element:KompoElement, selector:selector):void {
    const kompo = Element.kompo;
    kompo.state = selector(Element.__kompo__.state);
    kompo.selector = selector;
}

export function mount(p:KompoElement, c:KompoElement, selector:?selector|KompoElement, sel:selector) {
    let el;
    if (arguments.length == 3) {
        el = p;
    } else {
        el = c;
        c = selector;
        selector = sel;
    }

    el.appendChild(c);

    if (selector) {
        setState(c, selector);
    }

    render(c);

    // Protection if same element is appended multiple times
    if (p.kompo.mounts.indexOf(c) == -1) {
        p.kompo.mounts.push(c);
    }
}

export function react(Element:KompoElement, statefull:statefull):void {
    const kompo = Element.kompo,
        selector = kompo.selector;

    kompo.statefulls.push(statefull);
    statefull(
        selector ?
            selector(Element.__kompo__.state):
            Element.__kompo__.state
        ,Element
    );
}


export function slot(Element:KompoElement, name:string, cb:?slotCallback):void {
    if (arguments.length === 2) {
        Element.kompo.slots[name](Element);
    } else {
        Element.kompo.slots[name] = cb;
    }
}

export function hasSlot(Element:KompoElement, name:string):boolean {
    return Element.kompo.slots[name]? true: false;
}

export function getRouter(Element:KompoElement):router {
    return Element.__kompo__.router;
}