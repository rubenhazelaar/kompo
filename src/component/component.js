// @flow
import merge from '../util/merge';
import hasProxy from '../util/hasProxy';
import isObject from '../util/isObject';
import {markClean} from '../state/observe';

/**
 * Adds construct function to Element prototype
 */
Object.defineProperty(Element.prototype, 'construct', {
    writable: true,
    value: function () {
        throw new Error('Must override the construct method');
    }
});

/**
 * Creates a compnent from an Element
 *
 * @param tag
 * @param constructFn
 * @param defaultProps
 * @returns {function()}
 */
export default function construct(tag:string, constructFn:constructFn, defaultProps:props = {}):constructComponent {
    return (props = {}) => {
        const c = kompo(document.createElement(tag));
        c.kompo.props = merge(Object.assign({}, defaultProps), props);
        c.construct = constructFn;
        return c;
    };
}

export function constructClass(tag:string, constructClass: any, defaultProps:props = {}):constructComponent {
    const methods = getMethods(constructClass.prototype);
    return (props = {}) => {
        const c = kompo(document.createElement(tag));
        c.kompo.props = merge(Object.assign({}, defaultProps), props);
        merge(c,methods);
        return c;
    };
}

/**
 * Renders given component
 *
 * @param Element
 */
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
        unmount: undefined,
        children: undefined
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
    if (
        arguments.length >= 3
        && (
            Array.isArray(selector)
            || selector instanceof Element
        )
    ) {
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
        _mount(parent, frag, children[i], selector? selector(i): undefined);
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

/**
 * Mimics the slot functionality of 
 * Web Components
 * 
 * Slots are named, their name & location is 
 * predefined in the component.
 * 
 * @param Element
 * @param name
 * @param cb
 */
export function slot(Element:KompoElement, name:string, cb:?slotCallback):void {
    if (arguments.length === 2) {
        Element.kompo.slots[name](Element);
    } else {
        Element.kompo.slots[name] = cb;
    }
}

/**
 * Checks whether a slot with the given name exists
 * 
 * @param Element
 * @param name
 * @returns {boolean}
 */
export function hasSlot(Element:KompoElement, name:string):boolean {
    return Element.kompo.slots[name]? true: false;
}

/**
 * Gets the router from an Element. The router is 
 * add globally to the Element prototype
 * 
 * @param Element
 * @returns {router}
 */
export function getRouter(Element:KompoElement):router {
    return Element.__kompo__.router;
}

/**
 * Adds properties to an existing component,
 * making it possible to compose a component with
 * different behavior.
 * 
 * @param constructComponent
 * @param composeProps
 * @returns {function()}
 */
export function compose(constructComponent: constructComponent, composeProps:props): constructComponent {
    return (props = {}) => {
        return constructComponent(merge(composeProps, props));
    };
}

export function append(parent:KompoElement, child:KompoElement):void {
    render(child);
    parent.appendChild(child);
}

export function getProps(Element:KompoElement): props {
    return Element.kompo.props;
}

export function getMethods(clss) {
    const props = [],
        methods = {};

    let obj = clss;

    do {
        const ps = Object.getOwnPropertyNames(obj);

        const fps = [];
        for(let i = 0, l = ps.length; i < l; ++i) {
            const p = ps[i];
            if(
                typeof obj[p] === 'function'    //only the methods
                && p != 'constructor'           //not the constructor
                && (i == 0 || p !== ps[i - 1])  //not overriding in this prototype
                && props.indexOf(p) === -1      //not overridden in a child
            ) {
                fps.push(p);
                methods[p] = clss[p];
            }
        }

        props.push.apply(props, fps);
    } while (
        (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
        Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
    );

    return methods;
}

export function children(Element:KompoElement, children: Array<any>):KompoElement {
    Element.kompo.children = children;
    return Element;
}

export function appendChildren(Element:KompoElement, useFragment:bool) {
    const children = Element.kompo.children,
        parent = useFragment? document.createDocumentFragment(): Element;

    for(let i = 0, l = children.length; i < l; ++i) {
        const child = children[i];
        if(child.hasOwnProperty('kompo')) {
            render(child);
        }
        parent.appendChild(child);
    }

    if(useFragment) {
        Element.appendChild(parent);
    }
} 