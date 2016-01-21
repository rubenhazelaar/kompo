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
	
	var _create = __webpack_require__(5);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _extension = __webpack_require__(10);
	
	var _extension2 = _interopRequireDefault(_extension);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Component and content creation classes and functions
	
	(0, _extension2.default)(); // Initialize without prefix
	
	// Setup root component
	
	var App = function (_Component) {
	    _inherits(App, _Component);
	
	    function App() {
	        _classCallCheck(this, App);
	
	        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	    }
	
	    App.prototype.create = function create() {
	        var _this2 = this;
	
	        // Create elements
	        var root = (0, _create2.default)(),
	            h1 = (0, _create2.default)('h1', {
	            id: 'Primary heading' // Set attributes through an object
	        }),
	            input = (0, _create2.default)('input');
	
	        // Event listener, trigger update on keyup
	        this.on(input, 'keyup', function (e, state) {
	            if (state.name != e.target.value) {
	                state.name = e.target.value;
	                return true; // If value has changed return true
	            }
	            return false; // This could be omitted
	        });
	
	        // Statefull element, changes when an update is triggered by the event listener above
	        this.react(function (state) {
	            var name = typeof state.name !== 'undefined' && state.name !== '' ? state.name : _this2.props.name;
	            h1.replace((0, _create.createText)('Hello world, this is ' + name));
	        });
	
	        // Append children to root
	        root.append(h1, {
	            'data-heading': 'Primary heading' // Add more attributes on append
	        }, false).append('p').txt('Type your name to say "Hello world": ').append(input);
	
	        // Return the root
	        return root;
	    };
	
	    return App;
	}(_Component3.default);
	
	// Set a name as default property
	
	App.defaultProps = {
	    name: 'Kompo'
	};
	
	// Append component to body; notice the empty state
	// and how it is used together with a default property
	// in the react callback above
	document.body.append(new App().setState({}));

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

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = extension;
	
	var _capitalize = __webpack_require__(11);
	
	var _capitalize2 = _interopRequireDefault(_capitalize);
	
	var _Component = __webpack_require__(1);
	
	var _Component2 = _interopRequireDefault(_Component);
	
	var _replace = __webpack_require__(4);
	
	var _replace2 = _interopRequireDefault(_replace);
	
	var _create = __webpack_require__(5);
	
	var _isObject = __webpack_require__(6);
	
	var _isObject2 = _interopRequireDefault(_isObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * DOM extension can be prefixed with arbitrary string
	 *
	 * @param {string} prefix
	 */
	function extension(prefix) {
	    // Prevent lookups
	    var noPrefix = typeof prefix === 'undefined',
	        doc = document,
	        ElementPrototype = Element.prototype,
	        FragPrototype = DocumentFragment.prototype;
	
	    /**
	     * Returns (prefixed) methodName
	     *
	     * @param methodName
	     * @returns {string}
	     */
	    function addPrefix(methodName) {
	        if (noPrefix) {
	            return methodName;
	        }
	
	        return prefix + (0, _capitalize2.default)(methodName);
	    }
	    /**
	     * Syntactic sugar for getting/setting a attribute.
	     *
	     * @param {string} name
	     * @param {*} value
	     * @returns {*|Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('attr'), { value: function value(name, _value) {
	            if (arguments.length === 1) {
	                return this.getAttribute(name);
	            } else {
	                this.setAttribute(name, _value);
	                return this;
	            }
	        } });
	
	    /**
	     * Syntactic sugar for checking if an attribute exists.
	     *
	     * @param {string} name
	     * @returns {boolean}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('hasAttr'), { value: function value(name) {
	            return this.hasAttribute(name);
	        } });
	
	    /**
	     * Syntactic sugar for removing an attribute.
	     *
	     * @param {string} name
	     * @returns {Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('removeAttr'), { value: function value(name) {
	            this.removeAttribute(name);
	            return this;
	        } });
	
	    /**
	     * Syntactic sugar for getting or setting a TextNode.
	     *
	     * @param {string} txt
	     * @returns {Element|Text}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('txt'), { value: function value(txt) {
	            if (arguments.length === 1) {
	                this.appendChild(doc.createTextNode(txt));
	                return this;
	            } else {
	                return this.textContent;
	            }
	        } });
	
	    /**
	     * Syntactic sugar for appending an Element.
	     *
	     * @param {*} child
	     * @param {boolean} chain
	     * @returns {Element}
	     */
	    var appendFnName = addPrefix('append'),
	        appendFn = function appendFn(child) {
	        var chain = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	        var ch = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	        if (typeof child === 'string') {
	            child = doc.createElement(child);
	        }
	
	        if (child instanceof _Component2.default) {
	            child = child.render();
	        }
	
	        this.appendChild(child);
	
	        if ((0, _isObject2.default)(arguments[1])) {
	            (0, _create.addAttributes)(child, chain);
	            return ch ? child : this;
	        } else {
	            return chain ? child : this;
	        }
	    };
	    Object.defineProperty(ElementPrototype, appendFnName, { value: appendFn });
	    Object.defineProperty(FragPrototype, appendFnName, { value: appendFn });
	
	    /**
	     * Syntactic sugar for appending an Element
	     * on the parent of current Element.
	     *
	     * @param {*} child
	     * @param {boolean} chain
	     * @returns {Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('parentAppend'), { value: function value(child) {
	            var chain = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	            var ch = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	            return this.parentNode.append(child, chain, ch);
	        } });
	
	    /**
	     * Syntactic sugar for appending an cloned Element
	     * to its parent.
	     *
	     * BEWARE: It does not copy event listeners
	     * BEWARE: deep option can have serious performance implications
	     *
	     * @param {boolean} deep = deep copy or not
	     * @returns {Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('cloneAppend'), { value: function value() {
	            var deep = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	            return this.parentNode.append(this.cloneNode(deep));
	        } });
	
	    /**
	     * Syntactic sugar for cloning an Element
	     *
	     * BEWARE: It does not copy event listeners
	     * BEWARE: deep option can have serious performance implications
	     *
	     * @param {boolean} deep = deep copy or not
	     * @returns {Element}
	     */
	    var cloneFnName = addPrefix('clone'),
	        cloneFn = function cloneFn() {
	        var deep = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	        return this.cloneNode(deep);
	    };
	    Object.defineProperty(ElementPrototype, cloneFnName, { value: cloneFn });
	    Object.defineProperty(FragPrototype, cloneFnName, { value: cloneFn });
	
	    /**
	     * Syntactic sugar for prepending an Element.
	     *
	     * @param {*} child
	     * @param {boolean} chain
	     * @returns {Element}
	     */
	    var prependFnName = addPrefix('prepend'),
	        prependFn = function prependFn(child) {
	        var chain = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	        var ch = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	        var firstChild = this.firstChild;
	
	        if (typeof child === 'string') {
	            child = doc.createElement(child);
	        }
	
	        if (child instanceof _Component2.default) {
	            child = child.render();
	        }
	
	        if (firstChild) {
	            this.insertBefore(child, firstChild);
	        } else {
	            this.append(child);
	        }
	
	        if ((0, _isObject2.default)(arguments[1])) {
	            (0, _create.addAttributes)(child, chain);
	            return ch ? child : this;
	        } else {
	            return chain ? child : this;
	        }
	    };
	    Object.defineProperty(ElementPrototype, prependFnName, { value: prependFn });
	    Object.defineProperty(FragPrototype, prependFnName, { value: prependFn });
	
	    /**
	     * Syntactic sugar for getting the parent Element.
	     *
	     * @returns {Element|Node}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('parent'), { value: function value() {
	            return this.parentElement || this.parentNode;
	        } });
	
	    /**
	     * Syntactic sugar for checking if the Element
	     * has a parent.
	     *
	     * @returns {boolean}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('hasParent'), { value: function value() {
	            return !(this.parentElement === null && this.parentNode === null);
	        } });
	
	    /**
	     * Recurse to the root Element (which has no parent)
	     *
	     * @returns {Element|Node}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('root'), { value: function value(parent) {
	            parent = !parent ? this.parentElement || this.parentNode : parent;
	
	            while ((parent.parentElement || parent.parentNode) !== null) {
	                parent = this.root(parent.parentElement || parent.parentNode);
	            }
	
	            return parent;
	        } });
	
	    /**
	     * Syntactic sugar for document.querySelector()
	     *
	     * @param {string} selector
	     * @returns {Element}
	     */
	    var queryFnName = addPrefix('query'),
	        queryFn = function queryFn(selector) {
	        return this.querySelector(selector);
	    };
	    Object.defineProperty(ElementPrototype, queryFnName, { value: queryFn });
	    Object.defineProperty(FragPrototype, queryFnName, { value: queryFn });
	
	    /**
	     * Syntactic sugar for document.querySelectorAll()
	     *
	     * @param {string} selector
	     * @returns {HTMLCollection}
	     */
	    var queryAllFnName = addPrefix('queryAll'),
	        queryAllFn = function queryAllFn(selector) {
	        return this.querySelectorAll(selector);
	    };
	    Object.defineProperty(ElementPrototype, queryAllFnName, { value: queryAllFn });
	    Object.defineProperty(FragPrototype, queryAllFnName, { value: queryAllFn });
	
	    /**
	     * Syntactic sugar/polyfill for Element.remove()
	     *
	     * @returns {Element}
	     */
	    if (!('remove' in ElementPrototype)) {
	        Object.defineProperty(ElementPrototype, addPrefix('remove'), {
	            value: function value() {
	                var parent = this.parentNode;
	                if (parent) {
	                    parent.removeChild(this);
	                }
	            }
	        });
	    }
	
	    /**
	     * Syntactic sugar for removing all child Elements\Nodes
	     *
	     * @returns {Element}
	     */
	    var emptyFnName = addPrefix('empty'),
	        emptyFn = function emptyFn() {
	        while (this.lastChild) {
	            this.removeChild(this.lastChild);
	        }
	        return this;
	    };
	    Object.defineProperty(ElementPrototype, emptyFnName, { value: emptyFn });
	    Object.defineProperty(FragPrototype, emptyFnName, { value: emptyFn });
	
	    /**
	     * Syntactic sugar for logging
	     *
	     * When chain methods it can be used to log an Element
	     * right in the middle of the chain.
	     *
	     * @returns {Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('log'), { value: function value() {
	            console.log(this);
	            return this;
	        } });
	
	    /**
	     * @see ./replace.js
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('replace'), { value: function value(child) {
	            var replaceLastChild = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	            return (0, _replace2.default)(this, child, replaceLastChild);
	        } });
	
	    /**
	     * Syntactic sugar for replacing the
	     * current Element with a new one.
	     *
	     * BEWARE: a parent Element must exist
	     *
	     * @returns {Element} - return the new Element
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('replaceWith'), { value: function value(newElement, attributes) {
	            if (typeof newElement === 'string') {
	                newElement = doc.createElement(newElement);
	            }
	
	            if (typeof attributes !== 'undefined') {
	                (0, _create.addAttributes)(newElement, attributes);
	            }
	
	            this.parentNode.replaceChild(this, newElement);
	            return newElement;
	        } });
	
	    /**
	     * Syntactic sugar for inserting an Element
	     * before another Element
	     *
	     * BEWARE: a parenNode needs to be available
	     *
	     * @returns {Element} - the new Element
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('before'), { value: function value(newSibling, attributes) {
	            var parentNode = this.parentNode;
	
	            if (typeof newSibling === 'string') {
	                newSibling = doc.createElement(newSibling);
	            }
	
	            if (newSibling instanceof _Component2.default) {
	                newSibling = newSibling.render();
	            }
	
	            if (typeof attributes !== 'undefined') {
	                (0, _create.addAttributes)(newSibling, attributes);
	            }
	
	            if (parentNode) {
	                parentNode.insertBefore(newSibling, this);
	            }
	            return newSibling;
	        } });
	
	    /**
	     * Syntactic sugar for inserting an Element
	     * after another Element
	     *
	     * BEWARE: a parenNode needs to be available
	     *
	     * @returns {Element} - the new Element
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('after'), { value: function value(newSibling, attributes) {
	            var parentNode = this.parentNode,
	                nextSibling = this.nextSibling;
	
	            if (typeof newSibling === 'string') {
	                newSibling = doc.createElement(newSibling);
	            }
	
	            if (newSibling instanceof _Component2.default) {
	                newSibling = newSibling.render();
	            }
	
	            if (typeof attributes !== 'undefined') {
	                (0, _create.addAttributes)(newSibling, attributes);
	            }
	
	            if (parentNode) {
	                if (nextSibling) {
	                    parentNode.insertBefore(newSibling, nextSibling);
	                } else {
	                    parentNode.appendChild(newSibling);
	                }
	            }
	
	            return newSibling;
	        } });
	
	    /**
	     * Syntactic sugar for getting/setting the id
	     * of an Element
	     *
	     * @param {*} id
	     * @returns {string|Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('i'), { value: function value(id) {
	            if (arguments.length === 0) {
	                return this.id;
	            } else {
	                this.id = id;
	                return this;
	            }
	        } });
	
	    /**
	     * Syntactic sugar for getting/setting the name
	     * of an Element
	     *
	     * @param {*} name
	     * @returns {string|Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('n'), { value: function value(name) {
	            if (arguments.length === 0) {
	                return this.name;
	            } else {
	                this.name = name;
	                return this;
	            }
	        } });
	
	    /**
	     * Syntactic sugar for getting/setting the href
	     * of an Element
	     *
	     * @param {*} href
	     * @returns {string|Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('h'), { value: function value(href) {
	            if (arguments.length === 0) {
	                return this.href;
	            } else {
	                this.href = href;
	                return this;
	            }
	        } });
	
	    /**
	     * Syntactic sugar for getting/setting the value
	     * of an Element
	     *
	     * @param {*} value
	     * @returns {string|Element}
	     */
	    Object.defineProperty(ElementPrototype, addPrefix('v'), { value: function value(_value2) {
	            if (arguments.length === 0) {
	                return this.value;
	            } else {
	                this.value = _value2;
	                return this;
	            }
	        } });
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = capitalize;
	/**
	 * Capitalizes string
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function capitalize(str) {
	    if (typeof str === "string") {
	        return str.charAt(0).toUpperCase() + str.slice(1);
	    }
	}

/***/ }
/******/ ]);
//# sourceMappingURL=extendedHelloWorld.js.map