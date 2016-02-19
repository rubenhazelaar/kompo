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
            this.parseActions(this.actions());
            this.parseReactions(this.reactions());
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

        const hasIgnoredStatefull = typeof this.ignoredStatefull !== 'undefined';
        if(hasIgnoredStatefull) {
            this.statefulls.splice(this.statefulls.indexOf(hasIgnoredStatefull), 1);
        }

        for(let i = 0, l = this.statefulls.length; i < l; i++) {
            this.statefulls[i](this.selectedState || this.state, this);
        }

        if(hasIgnoredStatefull) {
            this.statefulls.push(this.ignoredStatefull);
            this.ignoredStatefull = undefined;
        }
    }

    /**
     * Registers a statefull child component by:
     *
     * - Setting it as its parent
     * - Passing along the state
     * - Passing along the state defined by a selector
     *
     * Components MAY be registered through Component::mount(),
     * however those that are NOT ARE and WILL REMAIN stateless
     * and will be excluded from the update cycle.
     *
     * If you only want to pass state without including
     * it in the update cycle use: Component::setState()
     * or Component::setSelectedState().
     *
     * @param {Component} Component - child component
     * @param {Function} selector - selects part of state
     * @returns {Component} - child component
     */
    mount(Component, selector) {
        this.mounts.push(Component);
        Component.setParent(this);
        Component.setState(this.state);
        if(isFunction(selector)) {
            Component.setSelectedState(selector(this.state));
        }

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
        this.mounts.splice(this.mounts.indexOf(Component), 1);
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
        return fn(this.selectedState || this.state, this);
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
     * Set the state selected for the
     * Component
     *
     * @param {*} state
     * @returns {Component}
     */
    setSelectedState(state) {
        this.stateless = false;
        this.selectedState = state;
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

            this.nestCallback = callback;
            return this;
        } else {
            return this.nestCallback(this.selectedState || this.state, this);
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
                let target, event, ChildComponent;

                for (let target=e.target; target && target!=this; target=target.parentNode) {
                    // loop parent nodes from the target to the delegation node
                    if (target.matches(children)) {
                        event = [e, target];
                    }

                    if(
                        typeof event !== 'undefined'
                        && typeof target.__kompo_component__ !== 'undefined'
                    ) {
                        ChildComponent = target.__kompo_component__;
                        break;
                    }
                }

                if(typeof event !== 'undefined') {
                    eventListenerCallback(Component, fn, event, Component.selectedState || Component.state, ChildComponent);
                }
            }, false);
        } else {
            el.addEventListener(type, (e) => {
                eventListenerCallback(Component, fn, e, Component.selectedState || Component.state);
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

    /**
     * Adds events through an array, calls Componnent.on()
     *
     * Override this method and implement according to example below
     *
     * IMPORTANT: Make sure used Elements (in the callback) can be reached by
     * binding them to this.<ElementName> instead of the local scope
     * in order to register them.
     *
     * Example configuration:
     *
     * return [
     *      [this.button, 'click', (e) => { ... callback ... }],
     *      // etc.
     * ];
     */
    actions() {
        return null;
    }

    /**
     * IMPORTANT: Only for internal use, MUST
     * not be called by users.
     *
     * Registers all action (events) and binds callbacks
     *
     * @param {(Array|null)} actions
     */
    parseActions(actions) {
        if(Array.isArray(actions)) {
            for(let i = 0, l = actions.length; i < l; i++) {
                const action = actions[i];
                if(action.length === 4) {
                    this.on(action[0], action[1], action[2], action[3]);
                } else {
                    this.on(action[0], action[1], action[2]);
                }
            }
        }
    }

    /**
     * Adds react callbacks through an array, calls Componnent.react()
     *
     * Override this method and implement according to example below
     *
     * IMPORTANT: Make sure used Elements in the callback can be reached by
     * binding them to this.<ElementName> instead of the local scope
     * in order to register them.
     *
     * Example configuration:
     *
     * return [
     *      (state) => { ... callback ... },
     *      // etc.
     * ];
     */
    reactions() {
        return null;
    }

    /**
     * IMPORTANT: Only for internal use, MUST
     * not be called by users.
     *
     * Registers all reactions and binds callbacks
     *
     * @param {(Array|null)} reactions
     */
    parseReactions(reactions) {
        if(Array.isArray(reactions)) {
            for(let i = 0, l = reactions.length; i < l; i++) {
                this.react(reactions[i]);
            }
        }
    }

    /**
     * Registers a statefull callback
     * that will be ignored on the next update
     *
     * @param {Function} statefull
     */
    ignore(statefull) {
        this.ignoredStatefull = statefull;
        return this;
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
    const res = Array.isArray(e)?
        fn.call(Component, e[0], e[1], state, ChildComponent):
        fn.call(Component, e, state, ChildComponent);
    if(res) {
        const root = Component.getRoot();
        if(root === null) {
            RAF(Component.update.bind(Component));
        } else {
            RAF(root.update.bind(root));
        }
    }
}
