import RAF from '../utils/requestAnimationFrame.js';
import merge from '../utils/merge.js';
import replace from '../dom/replace.js';
import isFunction from '../utils/isFunction.js';
import matches from '../utils/matches.js'; // Self-executing

/**
 * A Component instance represents an interface component
 * which is decoupled from context, except for it's child
 * components, properties and/or the state.
 *
 * Properties SHOULD be set through the constructor function,
 * but can also be provided by the means of setters. The later,
 * however, is not implemented and up to the user.
 *
 * A component makes no assumptions about the form which a state
 * has, handling state is left to implement for the user. The
 * Component class does however provide functions for consistently
 * handling state. Examples of such functions are:
 *
 * - Component::react()
 * - Component::mount()
 * - Component::on()
 */
export default class Component {
    /**
     * MAY be overridden, make sure to pass properties to the
     * super() function. Overriding constructor MUST call super().
     * @constructor
     * @param {Object} props
     */
    constructor(props) {
        // Merge props & defaultProps
        // Do an Object.assign() to remove the reference to defaultProps
        const defaultProps = Object.assign({},this.constructor.defaultProps);
        if(typeof defaultProps !== 'undefined' && typeof props !== 'undefined') {
            this.props = merge(defaultProps, props);
        } else {
            this.props = props || defaultProps || {};
        }

        this.statefulls = [];
        this.mounts = [];
        this.stateless = true;
        this.isolated = false;
        this.initial = true;
    }

    /**
     * IMPORTANT: Only for internal use, MUST
     * not be called by users.
     *
     * MUST return an Element which represents the root of a component.
     *
     * Most of the work for rendering the component
     * MAY be done here. It CAN be broken up into
     * smaller function, however Component::create()
     * MUST always return the resulting root Element.
     *
     * @returns {Element}
     */
    create() {
        throw new Error('Component must override the create method and return an Node object.');
    }

    /**
     * Outside facing interface for rendering the component.
     *
     * Call this function instead of
     * Component::create() or Component::update()
     *
     * @returns {Element} this.root - root of the component
     */
    render() {
        if(this.initial) {
            this.root = this.create();
            this.initial = false;
            Object.defineProperty(this.root, '__kompo_component__' , { writable: true,  value: this });
            return this.root;
        } else {
            this.update();
            return this.root
        }
    }

    /**
     * IMPORTANT: Only for internal use, MUST
     * not be called by users.
     *
     * Updates the component and its child components,
     * if these are not stateless or isolated
     */
    update() {
        for(let i = 0, l = this.mounts.length; i < l; i++) {
            const Component = this.mounts[i];
            if(Component.stateless || Component.isolated) continue;
            Component.update();
        }

        for(let i = 0, l = this.statefulls.length; i < l; i++) {
            this.statefulls[i](this.state, this);
        }
    }

    /**
     * Registers a statefull child component by:
     *
     * - Setting it as its parent
     * - Passing along the state
     *
     * Components MAY be registered through Component::mount(),
     * however those that are NOT ARE and WILL REMAIN stateless
     * and will be excluded from the update cycle.
     *
     * If you only want to pass state without including
     * it in the update cycle use: Component::setState().
     *
     * @param {Component} Component - child component
     * @returns {Component} - child component
     */
    mount(Component) {
        this.mounts.push(Component);
        Component.setParent(this);
        Component.setState(this.state);
        return Component;
    }

    /**
     * Unregisters the component from its parent component,
     * removing it from the update cycle.
     *
     * Returns the parent component.
     *
     * @param {Component} Component - child component
     * @returns {Component} - parent component
     */
    unmount(Component) {
        const index = this.mounts.indexOf(Component);
        this.mounts.splice(index, 1);
        return this;
    }

    /**
     * Unregisters the component from its parent component,
     * removing it from the update cycle, by index of
     * Component:mounts[]
     *
     * Returns the removed component.
     *
     * @param {Number} index
     * @returns {Component} {*}
     */
    unmountByIndex(index) {
        const Component = this.mounts[index];
        this.mounts.splice(index, 1);
        return Component;
    }

    /**
     * IMPORTANT: Only for internal use, MUST
     * not be called by users.
     *
     * Set the parent component of the component.
     *
     * Can produce unwanted side effect if set manually,
     * because the compontent tree is changed.
     *
     * @param {Component} Component - child component
     */
    setParent(Component) {
        this.parent = Component;
        return this;
    }

    /**
     * Registers a closure which is called on
     * Component::update() and handles the state.
     *
     * Cannot be called on stateless Components.
     *
     * @callback fn
     * @param {Function} fn - closure which handles the state.
     * @returns {*} - return value of closure
     */
    react(fn) {
        if(this.stateless) throw new Error('Set state (through mount() or setState()) before registering a react function.');
        this.statefulls.push(fn);
        return fn(this.state, this);
    }

    /**
     * Specialized function for registering a
     * routed Component. This has to be an Element
     * which holds the rendered root Element of the
     * router Component.
     *
     * @param {(Node|Function)} parent - closure(component, state, self)
     * @returns {Component} - the routed component
     */
    mountRoutedComponent(parent) {
        let isFn = false;
        if(isFunction(parent)) {
            isFn = true;
        } else if(!parent instanceof Node) {
            throw new Error('Routed Component cannot be assigned. Please make sure parent is a Node or a closure.');
        }

        return this.react((state, Self) => {
            const Component = state.Router.getComponent(this);

            if(Component) {
                Component.setParent(this);
                Component.setState(state);
                if(isFn) {
                    parent.bind(this)(Component, state, Self);
                } else {
                    replace(parent, Component);
                }
            }

            return Component;
        });
    }

    /**
     * Set the state for the component & marks
     * the component as statefull.
     *
     * Does not register for the component to
     * the update cycle, for this use:
     * Component::mount()
     *
     * @param {Object} state
     * @returns {Component} - self
     */
    setState(state) {
        this.stateless = false;
        this.state = state;
        return this;
    }

    /**
     * Set state but also isolates the Component
     * from its parent and the update cycle
     *
     * Child components are updated only if the
     * update cycle is started from within the isolated
     * component, for example by events.
     *
     * @param {Object} state
     * @returns {Component} - self
     */
    setIsolatedState(state) {
        this.setState(state);
        this.isolated = true;
        return this;
    }

    /**
     * Enables the user to nest Components and Nodes
     *
     * The nest function should be used twice,
     * one time to define its place within the
     * component (called without callback parameter)
     * and one time with to define what should be
     * nested (within a callback).
     *
     * @param {Function} [callback]
     * @returns {(Component|Node|DocumentFragment|*)}
     */
    nest(callback) {
        if (arguments.length === 1) {
            if(!isFunction(callback)) {
                throw new Error('Nesting callback should be a function, please provide a valid callback.');
            }

            this.nest = callback;
            return this;
        } else {
            return this.nest(this.state, this);
        }
    }

    /**
     * Adds an event listener or delegated event listener
     * to the provided element and triggers the update cycle
     * on its root component.
     *
     * If a component in the tree is marked as isolated. This
     * component will be the root for the update cycle.
     *
     * @callback (fn|dFn)
     * @param {Element} el - element to attach listener on
     * @param {string} type | children - type of event or children selector for event delegation
     * @param {(Function|string)} fn | type - closure for event or type of event
     * @param {(undefined|Function)} [dFn] | type - closure for delegated event or undefined
     * @returns {Component} - self
     */
    on(el, type, fn, dFn) {
        const Component = this;
        if(arguments.length === 4) {
            const children = type;
            type = fn;
            fn = dFn;

            el.addEventListener(type, function(e) {
                let event, ChildComponent;

                for (let target=e.target; target && target!=this; target=target.parentNode) {
                    // loop parent nodes from the target to the delegation node
                    if (target.matches(children)) {
                       event = e;
                    }

                    if(typeof target.__kompo_component__ !== 'undefined') {
                        ChildComponent = target.__kompo_component__;
                        break;
                    }
                }

                if(typeof event !== 'undefined') {
                    eventListenerCallback(Component, fn, event, Component.state, ChildComponent);
                }
            }, false);
        } else {
            el.addEventListener(type, (e) => {
                eventListenerCallback(Component, fn, e, Component.state);
            }, false);
        }

        return this;
    }

    /**
     * Removes the event listener on the given element &
     * of a certain type.
     *
     * @param {Element} el - element for detaching a type of event listeners
     * @param {string} type - type of event
     * @returns {Component} - self
     */
    off(el, type) {
        el.removeEventListener(type, eventListenerCallback, false);
        return this;
    }

    /**
     * Gets root component of current component
     *
     * @returns {Component} root
     */
    getRoot() {
        if(typeof this.parent !== 'undefined' && !this.isolated) {
            let parent = this.parent;
            while (typeof parent.parent !== 'undefined' && !parent.isolated) {
                parent = parent.parent
            }
            return parent;
        } else {
            return null;
        }
    }
}

/**
 * Callback for event listeners set through
 * Component::on().
 *
 * Recurses to the root and starts the update
 * cycle from this root.
 *
 * If a component in the tree is marked as isolated. This
 * component will be the root for the update cycle.
 *
 * @callback fn
 * @param {Component} Component - which the event callback is called
 * @param {Function} fn - closure for event callback
 * @param {Event} e - Event of callback
 * @param {*} state - application state
 * @param {Component} ChildComponent - The child component in a delegated call
 */
function eventListenerCallback(Component, fn, e, state, ChildComponent) {
    if(fn.call(Component, e, state, Component, ChildComponent)) {
        const root = Component.getRoot();
        if(root === null) {
            RAF(Component.update.bind(Component));
        } else {
            RAF(root.update.bind(root));
        }
    }
}
