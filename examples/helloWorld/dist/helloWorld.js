/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Component2 = __webpack_require__(1);
	
	var _Component3 = _interopRequireDefault(_Component2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Component class
	
	// Setup root component
	
	var App = function (_Component) {
	    _inherits(App, _Component);
	
	    function App() {
	        _classCallCheck(this, App);
	
	        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	    }
	
	    App.prototype.create = function create() {
	        // Create heading ...
	        var h1 = document.createElement('h1');
	        // and add text, all through standard DOM methods
	        h1.appendChild(document.createTextNode('Hello world, this is ' + this.props.name));
	
	        // Return the heading
	        return h1;
	    };
	
	    return App;
	}(_Component3.default);
	
	// Set a name as property
	
	var app = new App({
	    name: 'Kompo'
	});
	
	// Render component and append to body
	document.body.appendChild(app.render());

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _requestAnimationFrame = __webpack_require__(2);
	
	var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);
	
	var _merge = __webpack_require__(3);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	var _replace = __webpack_require__(4);
	
	var _replace2 = _interopRequireDefault(_replace);
	
	var _isFunction = __webpack_require__(7);
	
	var _isFunction2 = _interopRequireDefault(_isFunction);
	
	var _matches = __webpack_require__(8);
	
	var _matches2 = _interopRequireDefault(_matches);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// Self-executing
	
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
	
	var Component = function () {
	    /**
	     * MAY be overridden, make sure to pass properties to the
	     * super() function. Overriding constructor MUST call super().
	     * @constructor
	     * @param {Object} props
	     */
	
	    function Component(props) {
	        _classCallCheck(this, Component);
	
	        // Merge props & defaultProps
	        // Do an Object.assign() to remove the reference to defaultProps
	        var defaultProps = _extends({}, this.constructor.defaultProps);
	        if (typeof defaultProps !== 'undefined' && typeof props !== 'undefined') {
	            this.props = (0, _merge2.default)(defaultProps, props);
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
	
	    Component.prototype.create = function create() {
	        throw new Error('Component must override the create method and return an Node object.');
	    };
	
	    /**
	     * Outside facing interface for rendering the component.
	     *
	     * Call this function instead of
	     * Component::create() or Component::update()
	     *
	     * @returns {Element} this.root - root of the component
	     */
	
	    Component.prototype.render = function render() {
	        if (this.initial) {
	            this.root = this.create();
	            this.parseActions(this.actions());
	            this.parseReactions(this.reactions());
	            this.initial = false;
	            Object.defineProperty(this.root, '__kompo_component__', { writable: true, value: this });
	            return this.root;
	        } else {
	            this.update();
	            return this.root;
	        }
	    };
	
	    /**
	     * IMPORTANT: Only for internal use, MUST
	     * not be called by users.
	     *
	     * Updates the component and its child components,
	     * if these are not stateless or isolated
	     */
	
	    Component.prototype.update = function update() {
	        for (var i = 0, l = this.mounts.length; i < l; i++) {
	            var _Component = this.mounts[i];
	            if (_Component.stateless || _Component.isolated) continue;
	            _Component.update();
	        }
	
	        for (var i = 0, l = this.statefulls.length; i < l; i++) {
	            this.statefulls[i](this.state, this);
	        }
	    };
	
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
	
	    Component.prototype.mount = function mount(Component) {
	        this.mounts.push(Component);
	        Component.setParent(this);
	        Component.setState(this.state);
	        return Component;
	    };
	
	    /**
	     * Unregisters the component from its parent component,
	     * removing it from the update cycle.
	     *
	     * Returns the parent component.
	     *
	     * @param {Component} Component - child component
	     * @returns {Component} - parent component
	     */
	
	    Component.prototype.unmount = function unmount(Component) {
	        var index = this.mounts.indexOf(Component);
	        this.mounts.splice(index, 1);
	        return this;
	    };
	
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
	
	    Component.prototype.unmountByIndex = function unmountByIndex(index) {
	        var Component = this.mounts[index];
	        this.mounts.splice(index, 1);
	        return Component;
	    };
	
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
	
	    Component.prototype.setParent = function setParent(Component) {
	        this.parent = Component;
	        return this;
	    };
	
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
	
	    Component.prototype.react = function react(fn) {
	        if (this.stateless) throw new Error('Set state (through mount() or setState()) before registering a react function.');
	        this.statefulls.push(fn);
	        return fn(this.state, this);
	    };
	
	    /**
	     * Specialized function for registering a
	     * routed Component. This has to be an Element
	     * which holds the rendered root Element of the
	     * router Component.
	     *
	     * @param {(Node|Function)} parent - closure(component, state, self)
	     * @returns {Component} - the routed component
	     */
	
	    Component.prototype.mountRoutedComponent = function mountRoutedComponent(parent) {
	        var _this = this;
	
	        var isFn = false;
	        if ((0, _isFunction2.default)(parent)) {
	            isFn = true;
	        } else if (!parent instanceof Node) {
	            throw new Error('Routed Component cannot be assigned. Please make sure parent is a Node or a closure.');
	        }
	
	        return this.react(function (state, Self) {
	            var Component = state.Router.getComponent(_this);
	
	            if (Component) {
	                Component.setParent(_this);
	                Component.setState(state);
	                if (isFn) {
	                    parent.bind(_this)(Component, state, Self);
	                } else {
	                    (0, _replace2.default)(parent, Component);
	                }
	            }
	
	            return Component;
	        });
	    };
	
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
	
	    Component.prototype.setState = function setState(state) {
	        this.stateless = false;
	        this.state = state;
	        return this;
	    };
	
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
	
	    Component.prototype.setIsolatedState = function setIsolatedState(state) {
	        this.setState(state);
	        this.isolated = true;
	        return this;
	    };
	
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
	
	    Component.prototype.nest = function nest(callback) {
	        if (arguments.length === 1) {
	            if (!(0, _isFunction2.default)(callback)) {
	                throw new Error('Nesting callback should be a function, please provide a valid callback.');
	            }
	
	            this.nest = callback;
	            return this;
	        } else {
	            return this.nest(this.state, this);
	        }
	    };
	
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
	
	    Component.prototype.on = function on(el, type, fn, dFn) {
	        var Component = this;
	        if (arguments.length === 4) {
	            (function () {
	                var children = type;
	                type = fn;
	                fn = dFn;
	
	                el.addEventListener(type, function (e) {
	                    var event = undefined,
	                        ChildComponent = undefined;
	
	                    for (var target = e.target; target && target != this; target = target.parentNode) {
	                        // loop parent nodes from the target to the delegation node
	                        if (target.matches(children)) {
	                            event = e;
	                        }
	
	                        if (typeof target.__kompo_component__ !== 'undefined') {
	                            ChildComponent = target.__kompo_component__;
	                            break;
	                        }
	                    }
	
	                    if (typeof event !== 'undefined') {
	                        eventListenerCallback(Component, fn, event, Component.state, ChildComponent);
	                    }
	                }, false);
	            })();
	        } else {
	            el.addEventListener(type, function (e) {
	                eventListenerCallback(Component, fn, e, Component.state);
	            }, false);
	        }
	
	        return this;
	    };
	
	    /**
	     * Removes the event listener on the given element &
	     * of a certain type.
	     *
	     * @param {Element} el - element for detaching a type of event listeners
	     * @param {string} type - type of event
	     * @returns {Component} - self
	     */
	
	    Component.prototype.off = function off(el, type) {
	        el.removeEventListener(type, eventListenerCallback, false);
	        return this;
	    };
	
	    /**
	     * Gets root component of current component
	     *
	     * @returns {Component} root
	     */
	
	    Component.prototype.getRoot = function getRoot() {
	        if (typeof this.parent !== 'undefined' && !this.isolated) {
	            var parent = this.parent;
	            while (typeof parent.parent !== 'undefined' && !parent.isolated) {
	                parent = parent.parent;
	            }
	            return parent;
	        } else {
	            return null;
	        }
	    };
	
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
	
	    Component.prototype.actions = function actions() {
	        return null;
	    };
	
	    /**
	     * IMPORTANT: Only for internal use, MUST
	     * not be called by users.
	     *
	     * Registers all action (events) and binds callbacks
	     *
	     * @param {(Array|null)} actions
	     */
	
	    Component.prototype.parseActions = function parseActions(actions) {
	        if (Array.isArray(actions)) {
	            for (var i = 0, l = actions.length; i < l; i++) {
	                var action = actions[i];
	                if (action.length === 4) {
	                    this.on(action[0], action[1], action[2], action[3]);
	                } else {
	                    this.on(action[0], action[1], action[2]);
	                }
	            }
	        }
	    };
	
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
	
	    Component.prototype.reactions = function reactions() {
	        return null;
	    };
	
	    /**
	     * IMPORTANT: Only for internal use, MUST
	     * not be called by users.
	     *
	     * Registers all reactions and binds callbacks
	     *
	     * @param {(Array|null)} reactions
	     */
	
	    Component.prototype.parseReactions = function parseReactions(reactions) {
	        if (Array.isArray(reactions)) {
	            for (var i = 0, l = reactions.length; i < l; i++) {
	                this.react(reactions[i]);
	            }
	        }
	    };
	
	    return Component;
	}();
	
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
	
	exports.default = Component;
	function eventListenerCallback(Component, fn, e, state, ChildComponent) {
	    if (fn.call(Component, e, state, Component, ChildComponent)) {
	        var root = Component.getRoot();
	        if (root === null) {
	            (0, _requestAnimationFrame2.default)(Component.update.bind(Component));
	        } else {
	            (0, _requestAnimationFrame2.default)(root.update.bind(root));
	        }
	    }
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * RequestAnimationFrame polyfill
	 *
	 * @returns {*}
	 */
	
	exports.default = function requestAnimationFrame() {
	  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
	    window.setTimeout(callback, 1000 / 60);
	  };
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = merge;
	/**
	 * Merges given objects
	 *
	 * @param {...Object} objs - Any given amount of objects
	 * @returns {Object}
	 */
	function merge() {
	    var object = Array.prototype.shift.call(arguments);
	    for (var i = 0; i < arguments.length; i++) {
	        var obj = arguments[i];
	        for (var j in obj) {
	            object[j] = obj[j];
	        }
	    }
	
	    return object;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = replace;
	
	var _create = __webpack_require__(5);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _Component = __webpack_require__(1);
	
	var _Component2 = _interopRequireDefault(_Component);
	
	var _isObject = __webpack_require__(6);
	
	var _isObject2 = _interopRequireDefault(_isObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 *  Replaces an Node for another one
	 *
	 * @param {Node} parent - parent element to replace child on
	 * @param {*} child - new child to replace for old child
	 * @param {boolean} replaceLastChild - replace first or last child
	 * @returns {Node} child - child element
	 */
	function replace(parent, child) {
	    var replaceLastChild = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	    var rLC = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	    var arg2isObject = (0, _isObject2.default)(arguments[2]);
	    var replacedChild = undefined;
	    if (arg2isObject) {
	        replacedChild = rLC ? parent.lastChild : parent.firstChild;
	    } else {
	        replacedChild = replaceLastChild ? parent.lastChild : parent.firstChild;
	    }
	
	    if (typeof child === 'string') {
	        child = (0, _create2.default)(child);
	    }
	
	    if (child instanceof _Component2.default) {
	        child = child.render();
	    }
	
	    if (arg2isObject) {
	        (0, _create.addAttributes)(child, replaceLastChild);
	    }
	
	    if (replacedChild) {
	        parent.replaceChild(child, replacedChild);
	    } else {
	        parent.appendChild(child);
	    }
	
	    return child;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = create;
	exports.addAttributes = addAttributes;
	exports.createFragment = createFragment;
	exports.createText = createText;
	var doc = document;
	
	/**
	 * Creates an Element, when no tagName
	 * is given it create an empty div to serve
	 * as root.
	 *
	 * @param {string|undefined} tagName
	 * @returns {Element}
	 */
	function create(tagName, attributes) {
	    var Element = undefined;
	    if (typeof tagName === 'undefined') {
	        Element = doc.createElement('div');
	    } else {
	        Element = doc.createElement(tagName);
	    }
	
	    if (typeof attributes !== 'undefined') {
	        addAttributes(Element, attributes);
	    }
	
	    return Element;
	}
	
	/**
	 * Adds attributes to an Element
	 * through iterating through an object
	 *
	 * @param {Element} Element
	 * @param {Object} obj
	 * @returns {Element}
	 */
	function addAttributes(Element, obj) {
	    var keys = Object.keys(obj);
	    for (var i = 0, l = keys.length; i < l; i++) {
	        var key = keys[i],
	            value = obj[key];
	        Element.setAttribute(key, value);
	    }
	    return Element;
	}
	
	/**
	 * Syntactic sugar for creating a DocumentFragment
	 *
	 * @returns {DocumentFragment}
	 */
	function createFragment() {
	    return doc.createDocumentFragment();
	}
	
	/**
	 * Syntactic sugar for creating a TextNode
	 *
	 * @param {string} str
	 * @returns {Text}
	 */
	function createText(str) {
	    return doc.createTextNode(str);
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isObject;
	/**
	 * Checks if `value` is the language type of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return type == 'function' || value && type == 'object' || false;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isFunction;
	/**
	 * Checks if given variable is a function
	 *
	 * @param {*} functionToCheck
	 * @returns {boolean}
	 */
	function isFunction(functionToCheck) {
	  var getType = {};
	  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Polyfills the matches function on Elements
	 *
	 * Used with event delegation in Components class
	 */
	
	exports.default = function () {
	    if (!Element.prototype.matches) {
	        var ep = Element.prototype;
	
	        if (ep.webkitMatchesSelector) // Chrome <34, SF<7.1, iOS<8
	            ep.matches = ep.webkitMatchesSelector;
	
	        if (ep.msMatchesSelector) // IE9/10/11 & Edge
	            ep.matches = ep.msMatchesSelector;
	
	        if (ep.mozMatchesSelector) // FF<34
	            ep.matches = ep.mozMatchesSelector;
	    }
	}();

/***/ }
/******/ ]);
//# sourceMappingURL=helloWorld.js.map