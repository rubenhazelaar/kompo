// @flow
import {isProxy, shouldIgnore, resetIgnore} from '../state/store';

/**
 * When KOMPO_DEBUG is defined it returns it, otherwise is returns false
 * @returns boolean
 */
function isKompoDebug():bool {
    if (typeof KOMPO_DEBUG != 'undefined') {
        return KOMPO_DEBUG
    }

    return false;
}

/**
 * Adds construct function to Element prototype
 */
if (typeof Element === 'object') {
    Object.defineProperty(Element.prototype, 'construct', {
        writable: true,
        value: function () {
            throw new Error('Must override the construct method');
        }
    });
}

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
        c.kompo.props = Object.assign({}, defaultProps, props);
        c.construct = constructFn;
        return c;
    };
}

export function constructClass(tag:string, constructClass:any, defaultProps:props = {}):constructComponent {
    const methods = getMethods(constructClass.prototype);
    return (props = {}) => {
        const c = kompo(document.createElement(tag));
        c.kompo.props = Object.assign({}, defaultProps, props);
        Object.assign(c, methods);
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
    if (!kompo.initial) return;

    if (isKompoDebug() && kompo.debug) {
        console.groupCollapsed('RENDER: ');
        console.log(Element);
        console.log(kompo);
        console.groupCollapsed('CONSTRUCT: ');
    }

    // Construct then ...
    Element.construct(kompo.props);
    kompo.initial = false;

    if (isKompoDebug() && kompo.debug) {
        console.groupEnd();
    }

    // ... react
    const statefulls = kompo.statefulls,
        selector = kompo.selector,
        state = selector ? selector(Element.__kompo__.state) : Element.__kompo__.state;

    if (statefulls.length > 0 && state) {
        if (isKompoDebug() && kompo.debug) {
            console.log('HAS STATE: ', state);
            console.groupCollapsed('REACTS: ');
        }

        for (let i = 0, l = statefulls.length; i < l; ++i) {
            statefulls[i](state, Element);
        }

        if (isKompoDebug() && kompo.debug) {
            console.groupEnd();
        }
    }

    if (isKompoDebug() && kompo.debug) {
        console.groupEnd();
    }
}

export function update(Element:KompoElement, state:state):void {
    const kompo = Element.kompo;

    if (isKompoDebug() && kompo.debug) {
        console.groupCollapsed('UPDATE: ');
        console.log(Element);
        console.log(kompo);
    }

    updateStatefulls(Element, kompo, state);

    const mounts = kompo.mounts;
    if (mounts.length > 0) {
        if (isKompoDebug() && kompo.debug) {
            console.groupCollapsed('MOUNTS: ');
        }

        for (let i = 0, l = mounts.length; i < l; ++i) {
            update(mounts[i], state);
        }

        if (isKompoDebug() && kompo.debug) {
            console.groupEnd();
        }
    }

    if (isKompoDebug() && kompo.debug) {
        console.groupEnd();
    }
}

function updateStatefulls(Element:KompoElement, kompo:kompo, state:state) {
    const statefulls = kompo.statefulls;

    // Only run if a component has statefulls
    if (statefulls.length == 0) return;

    const selector = kompo.selector,
        selectedState = selector ? selector(Element.__kompo__.state) : Element.__kompo__.state;

    if (selectedState && (state === selectedState || inProperties(selectedState, state))) {
        if (isKompoDebug() && kompo.debug) {
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

        if (isKompoDebug() && kompo.debug) {
            console.groupEnd();
        }
    }
}

function inProperties(selectedState:state, state:state) {
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
        // state: undefined, // TODO Unavailable now but could perhaps be used as caching mechanism (also see setState())
        unmount: undefined,
        debug: false
    };

    return Element;
}

export function setState(Element:KompoElement, selector:selector):KompoElement {
    const kompo = Element.kompo;
    // TODO Unavailable now but could perhaps be used as caching mechanism
    // if(apply) kompo.state = selector(Element.__kompo__.state);
    kompo.selector = selector;
    return Element;
}

export function getState(Element:KompoElement):any {
    const selector = Element.kompo.selector;
    return selector ?
        selector(Element.__kompo__.state) :
        Element.__kompo__.state
}

export function mount(parent:KompoElement,
                      child:KompoElement|Array<KompoElement>|Mountable|Array<Mountable>,
                      selector:?selector):void {
    if (Array.isArray(child)) {
        _mountAll(parent, child, selector);
    } else {
        _mount(parent, child, selector)
    }
}

function _mount(parent:KompoElement, child:KompoElement|Mountable, selector:?selector):void {
    if (selector) {
        setState(child, selector);
    } else if (child instanceof Mountable) {
        selector = child.useParentSelector? parent.kompo.selector: child.selector;
        if (selector) {
            setState(child.Element, selector);
        }
        child = child.Element;
    }

    render(child);

    // Protection if same element is appended multiple times
    const mounts = parent.kompo.mounts;
    if (mounts.indexOf(child) === -1) {
        child.kompo.unmount = () => {
            mounts.splice(mounts.indexOf(child), 1);
        };
        mounts.push(child);
    }
}

function _mountAll(parent:KompoElement, children:Array<KompoElement>|Array<Mountable>, selector:?selector):void {
    // Mount all children ...
    for (let i = 0, l = children.length; i < l; ++i) {
        _mount(parent, children[i], selector);
    }
}

export function unmount(Element:KompoElement):void {
    Element.kompo.unmount();
}

export function unmountAll(Element:KompoElement):void {
    Element.kompo.mounts = [];
}

export function mountIndex(parent:KompoElement, child:KompoElement):Number {
    return parent.kompo.mounts.indexOf(child);
}

export function react(Element:KompoElement, statefull:statefull):void {
    Element.kompo.statefulls.push(statefull);
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
    return Element.kompo.slots[name] ? true : false;
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
export function compose(constructComponent:constructComponent, composeProps:props):constructComponent {
    return (props = {}) => {
        return constructComponent(Object.assign(composeProps, props));
    };
}

export function getProps(Element:KompoElement):props {
    return Element.kompo.props;
}

export function getMethods(clss) {
    const props = [],
        methods = {};

    let obj = clss;

    do {
        const ps = Object.getOwnPropertyNames(obj);

        const fps = [];
        for (let i = 0, l = ps.length; i < l; ++i) {
            const p = ps[i];
            if (
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

export function getMounts(Element:KompoElement):mounts {
    return Element.kompo.mounts;
}

class Mountable {
    Element:KompoElement;
    selector:selector;
    useParentSelector:boolean;

    constructor({Element, selector, useParentSelector}) {
        this.Element = Element;
        this.selector = selector;
        this.useParentSelector = useParentSelector;

        if (!this.selector) {
            this.useParentSelector = true;
        }
    }
}

export function mountable(options:mountOptions):Mountable {
    return new Mountable(options)
}

export function debug(Element:KompoElement, level:?Number) {
    if (!Element instanceof HTMLElement) {
        throw new Error('Not an instance of Element');
    }

    if (!Element.hasOwnProperty('kompo')) {
        throw new Error('Is not a KompoElement');
    }

    const kompo = Element.kompo,
        mounts = kompo.mounts;

    console.log(Element, kompo);

    if (Number.isInteger(level) && level > 0 && mounts.length > 0) {
        console.groupCollapsed('MOUNTS: ');

        const nl = --level;
        for (let i = 0, l = mounts.length; i < l; ++i) {
            debug(mounts[i], nl);
            console.log('__END_OF_MOUNT__');
        }

        console.groupEnd();
    }

    return Element;
}

export function debugLifeCycle(Element:KompoElement) {
    if (!Element instanceof HTMLElement) {
        throw new Error('Not an instance of Element');
    }

    if (!Element.hasOwnProperty('kompo')) {
        throw new Error('Is not a KompoElement');
    }

    // Set to true so render & update functions log the components life cycle
    Element.kompo.debug = true;

    return Element;
}

export function getSelector(Element:KompoElement):selector {
    return Element.kompo.selector;
}