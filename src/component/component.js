// @flow
import merge from '../util/merge';
import hasProxy from '../util/hasProxy';
import isObject from '../util/isObject';
import {markClean} from '../state/observe';

Object.defineProperty(Element.prototype, 'construct', {
    writable: true,
    value: function () {
        throw new Error('Must override the construct method');
    }
});

export default function construct(tag:string, constructFn:constructFn, defaultProps:props = {}):(props:props)=> KompoElement {
    return (props = {}) => {
        const c = kompo(document.createElement(tag));
        c.kompo.props = merge(Object.assign({}, defaultProps), props);
        c.construct = constructFn;
        return c;
    };
}

export function render(Element:KompoElement):void {
    const kompo = Element.kompo;
    if (kompo.initial) {
        Element.construct(kompo.props);
        kompo.initial = false;
    } else {
        update(Element)
    }
}

export function update(Element:KompoElement):void {
    const kompo = Element.kompo,
        mounts = kompo.mounts,
        selector = kompo.selector,
        state = selector ? selector(Element.__kompo__.state) : Element.__kompo__.state,
        isRoot = Element === Element.__kompo__.root;

    for (let i = 0, l = mounts.length; i < l; ++i) {
        render(mounts[i]);
    }

    // State is false, do not run statefulls
    if (!state) return;

    // If is object and flagged dirty or not at all than do not update
    const checkIfDirty = hasProxy?
        isObject(state) || Array.isArray(state):
        isObject(state) && !Array.isArray(state);

    if (
        checkIfDirty
        && state.hasOwnProperty('__kompo_dirty__')
        && state.__kompo_dirty__.length === 0
    ) {
        if (isRoot) {
            markClean(state);
        }
        return;
    }

    const statefulls = kompo.statefulls;
    for (let i = 0, l = statefulls.length; i < l; ++i) {
        statefulls[i](state, Element);
    }

    if (isRoot) {
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
        state: undefined,
        unmount: undefined
    };

    return Element;
}

export function setState(Element:KompoElement, selector:selector):void {
    const kompo = Element.kompo;
    kompo.state = selector(Element.__kompo__.state);
    kompo.selector = selector;
}

export function getState(Element:KompoElement):any {
    const selector = Element.kompo.selector;
    return  selector?
        selector(Element.__kompo__.state):
        Element.__kompo__.state
}

export function mount(parent:KompoElement, child:KompoElement|Array<KompoElement>, selector:?selector|KompoElement|Array<KompoElement>, sel:?selector):void {
    let el;
    if (arguments.length === 4) {
        el = child;
        child = selector;
        selector: selector = sel;
    } else {
        el = parent;
    }

    if(Array.isArray(child)) {
        _mountAll(parent, el, child, selector);
    } else {
        _mount(parent, el, child, selector)
    }
}

function _mount(parent:KompoElement, Element:KompoElement, child:KompoElement, selector:?selector):void {
    Element.appendChild(child);

    if (selector) {
        setState(child, selector);
    }

    render(child);

    // Protection if same element is appended multiple times
    const mounts = parent.kompo.mounts;
    if (mounts.indexOf(child) === -1) {
        child.kompo.unmount = Element => {
            mounts.splice(mounts.indexOf(Element), 1);
        };
        mounts.push(child);
    }
}

function _mountAll(parent:KompoElement, Element:Element, children:Array<KompoElement>, selector:?selector):void {
    const frag = document.createDocumentFragment();

    // Mount all children ...
    for(let i = 0, l = children.length; i < l; ++i) {
        _mount(parent, frag, children[i], selector(i));
    }

    // ... append to DOM in one go
    Element.appendChild(frag);
}

export function unmount(Element:KompoElement):void {
    const unm = Element.kompo.unmount;
    if(unm) {
        unm(Element);
    }
}

export function unmountAll(Element:KompoElement):void {
    Element.kompo.mounts = [];
}

export function mountIndex(parent:KompoElement, child:KompoElement):Number {
    return parent.kompo.mounts.indexOf(child);    
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