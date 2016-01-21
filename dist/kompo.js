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
	
	var _Component = __webpack_require__(1);
	
	var _Component2 = _interopRequireDefault(_Component);
	
	var _Collection = __webpack_require__(9);
	
	var _Collection2 = _interopRequireDefault(_Collection);
	
	var _create = __webpack_require__(5);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _extension = __webpack_require__(10);
	
	var _extension2 = _interopRequireDefault(_extension);
	
	var _replace = __webpack_require__(4);
	
	var _replace2 = _interopRequireDefault(_replace);
	
	var _Router = __webpack_require__(12);
	
	var _Router2 = _interopRequireDefault(_Router);
	
	var _Link = __webpack_require__(13);
	
	var _Link2 = _interopRequireDefault(_Link);
	
	var _debounce = __webpack_require__(14);
	
	var _debounce2 = _interopRequireDefault(_debounce);
	
	var _throttle = __webpack_require__(15);
	
	var _throttle2 = _interopRequireDefault(_throttle);
	
	var _Fetch = __webpack_require__(16);
	
	var _Fetch2 = _interopRequireDefault(_Fetch);
	
	var _action = __webpack_require__(17);
	
	var _action2 = _interopRequireDefault(_action);
	
	var _AsyncAction = __webpack_require__(18);
	
	var _AsyncAction2 = _interopRequireDefault(_AsyncAction);
	
	var _reaction = __webpack_require__(19);
	
	var _reaction2 = _interopRequireDefault(_reaction);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = {
	    Component: _Component2.default,
	    Collection: _Collection2.default,
	    create: _create2.default, createFragment: _create.createFragment, createText: _create.createText,
	    addExtension: _extension2.default,
	    replace: _replace2.default,
	    Router: _Router2.default, Route: _Router.Route, IndexRoute: _Router.IndexRoute,
	    Link: _Link2.default,
	    debounce: _debounce2.default,
	    throttle: _throttle2.default,
	    Fetch: _Fetch2.default,
	    action: _action2.default, Do: _action.Do,
	    AsyncAction: _AsyncAction2.default,
	    reaction: _reaction2.default
	};

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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.remove = remove;
	
	var _Component5 = __webpack_require__(1);
	
	var _Component6 = _interopRequireDefault(_Component5);
	
	var _create = __webpack_require__(5);
	
	var _merge = __webpack_require__(3);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Represents a Collection which
	 * can be used to effectively render
	 * and rerender a collection of Components
	 */
	
	var Collection = function (_Component) {
	    _inherits(Collection, _Component);
	
	    /**
	     * Create a collections instance and creates
	     * the collection
	     *
	     * @param {Node} root - to append collection to
	     * @param {*} state - state (part) to render collection for
	     * @param {Function} componentConstructor - class constructor for creating the collection items
	     * @param {Object} options
	     */
	
	    function Collection(root, state, componentConstructor, options) {
	        _classCallCheck(this, Collection);
	
	        var _this = _possibleConstructorReturn(this, _Component.call(this));
	
	        _this.root = root;
	        _this.state = state;
	        _this.stateless = false;
	        _this.componentConstructor = componentConstructor;
	        _this.options = (0, _merge2.default)({
	            fragmentLimit: 1,
	            props: undefined
	        }, options);
	        _this.create();
	        return _this;
	    }
	
	    /**
	     * @inheritdoc;
	     *
	     * Creates the collection, and is also used to check
	     * integrity on update
	     *
	     * @returns {Node}
	     */
	
	    Collection.prototype.create = function create() {
	        if (Array.isArray(this.state)) {
	            this.append(this.state);
	        } else if (isObject(this.state)) {
	            this.append(Object.keys(this.state), this.state);
	        } else {
	            throw new Error('Cannot iterate over given state. Please check constructor input and provide an array or object.');
	        }
	
	        return this.root;
	    };
	
	    /**
	     * Appends new items to the Collection,
	     * if there are any
	     *
	     * @param {Array} arr - array to iterate or keys from object
	     * @param {Object} obj - object to iterate
	     */
	
	    Collection.prototype.append = function append(arr, obj) {
	        var arrLength = arr.length,
	            mountsLength = this.mounts.length;
	
	        // Mount when collection grows
	        if (arrLength > mountsLength) {
	            var parent = undefined,
	                useFragment = undefined;
	            if (arrLength - mountsLength > this.options.fragmentLimit) {
	                parent = (0, _create.createFragment)();
	                useFragment = true;
	            } else {
	                parent = this.root;
	                useFragment = false;
	            }
	
	            for (var i = mountsLength; i < arrLength; i++) {
	                var index = obj ? arr[i] : i,
	                    value = obj ? obj[index] : arr[i];
	
	                parent.appendChild(this.mount(new this.componentConstructor(this.options.props).setState((0, _merge2.default)(value, { index: index }))).render());
	            }
	
	            if (useFragment) {
	                this.root.appendChild(parent);
	            }
	        }
	    };
	
	    /**
	     * @inheritdoc
	     *
	     * Deletes components, then updates them and
	     * appends more if needed.
	     */
	
	    Collection.prototype.update = function update() {
	        if (this.state.hasOwnProperty('__kompo_collection_remove__')) {
	            var index = this.state.__kompo_collection_remove__;
	
	            if (Array.isArray(index)) {
	                for (var i = 0, l = index.length; i < l; i++) {
	                    var _Component2 = this.unmountByIndex(index);
	                    _Component2.root.parentNode.removeChild(_Component2.root);
	                    this.state.splice(index, 1);
	                }
	            } else {
	                var _Component3 = this.unmountByIndex(index);
	                _Component3.root.parentNode.removeChild(_Component3.root);
	                this.state.splice(index, 1);
	            }
	
	            delete this.state.__kompo_collection_remove__;
	        }
	
	        for (var i = 0, l = this.mounts.length; i < l; i++) {
	            var _Component4 = this.mounts[i];
	            _Component4.state.index = i;
	            if (_Component4.stateless || _Component4.isolated) continue;
	            _Component4.update();
	        }
	
	        this.create();
	    };
	
	    /**
	     * @inheritdoc
	     *
	     * Removes Component::setState()
	     *
	     * @param Component
	     * @returns {Component}
	     */
	
	    Collection.prototype.mount = function mount(Component) {
	        this.mounts.push(Component);
	        Component.setParent(this);
	        return Component;
	    };
	
	    /**
	     * @inheritdoc
	     *
	     * Collection state is set in Collection:constructor()
	     * setState interfers with the specific state part of the
	     * collection.
	     *
	     * @returns {Collection}
	     */
	
	    Collection.prototype.setState = function setState() {
	        return this;
	    };
	
	    return Collection;
	}(_Component6.default);
	
	/**
	 * Flags a part of the state to schedule it
	 * for removal
	 *
	 * @param {*} part
	 * @param {Number} index
	 */
	
	exports.default = Collection;
	function remove(part, index) {
	    Object.defineProperty(part, '__kompo_collection_remove__', { configurable: true, writable: true, value: index });
	}

/***/ },
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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.IndexRoute = exports.Route = undefined;
	
	var _requestAnimationFrame = __webpack_require__(2);
	
	var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);
	
	var _merge = __webpack_require__(3);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	var _isFunction = __webpack_require__(7);
	
	var _isFunction2 = _interopRequireDefault(_isFunction);
	
	var _Component = __webpack_require__(1);
	
	var _Component2 = _interopRequireDefault(_Component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Router class which works
	 * closely together with the Component class
	 * in order to facilitate routing and efficient
	 * creation, rendering and updating
	 *
	 * @see router examples for usage
	 */
	
	var Router = function () {
	    /**
	     * Create the Router
	     *
	     * @constructor
	     * @param {Object} state
	     * @param {Route} Route
	     * @param {string} [base]
	     * @param {Object} [options]
	     */
	
	    function Router(state, Route) {
	        var _this = this;
	
	        var base = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
	        var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	
	        _classCallCheck(this, Router);
	
	        // Add self (Router) to state
	        // TODO: Make this configurable?
	        state.Router = this;
	        this.state = state;
	        this.options = (0, _merge2.default)({
	            notFoundCallback: null
	        }, options);
	        this.setBase(base);
	        this.url = '/';
	        this.rawRoutes = {};
	        this.routes = {};
	        this.index = 0;
	        this.params = [];
	
	        this.parseRoute(Route);
	
	        window.addEventListener('popstate', function () {
	            _this.setUrl(window.location.pathname.replace(_this.base, ''));
	            // Just update the whole tree from the root up.
	            var component = _this.getCurrentComponent(null);
	            (0, _requestAnimationFrame2.default)(component.update.bind(component));
	        });
	    }
	
	    /**
	     * Sets and normalizes the base used in
	     * Router::goTo()
	     *
	     * @param {string} base
	     */
	
	    Router.prototype.setBase = function setBase(base) {
	        if (base[0] !== '/') {
	            base = '/' + base;
	        }
	
	        if (base.slice(-1) === '/') {
	            base = base.slice(0, -1);
	        }
	
	        this.base = base;
	    };
	
	    /**
	     * Makes use of history.pushState to
	     * push the url of the browser.
	     *
	     * Also stores is as current url in the Router
	     *
	     * BEWARE: uses this.base
	     * BEWARE: sets this.data
	     *
	     * @param {string} url - url to navigate to
	     * @param {string} [title] - title of the page to navigate
	     * @param {*} [data] - data set
	     * @returns {boolean} - return true to cause a possible update cycle
	     */
	
	    Router.prototype.goTo = function goTo(url) {
	        var title = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	        var data = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
	        if (this.isUrl(url)) return false;
	        this.setUrl(url);
	        // TODO: What can we possibly do with this?
	        this.data = data;
	        history.pushState(data, title, this.base + this.url);
	        return true;
	    };
	
	    /**
	     * Gets the next component from the routed path
	     *
	     * BEWARE: When called it increments the Router's
	     * index in order for it to return the next element
	     * on the next call.
	     *
	     * @param {Component} parent
	     * @returns {Component} next
	     */
	
	    Router.prototype.getComponent = function getComponent(parent) {
	        if (parent instanceof _Component2.default) {
	            this.index = parent.level + 1;
	        }
	
	        return this.match(this.url, this.routes)[this.index];
	    };
	
	    /**
	     * Gets the current component from the routed path
	     *
	     * @param {Component} parent
	     * @returns {Component} current
	     */
	
	    Router.prototype.getCurrentComponent = function getCurrentComponent(parent) {
	        var isNull = parent === null;
	        if (!isNull || !parent instanceof _Component2.default) {
	            throw new Error('Cannot get current Component.Parameter parent must be null for the root parent or a Component to return its child component');
	        }
	        var path = this.match(this.url, this.routes);
	        return isNull ? path[0] : path[parent.level + 1];
	    };
	
	    /**
	     * Matches an url to a parsed route regex
	     * and returns the path of Components
	     *
	     * BEWARE: Assigns the matched groups to the Router's
	     * params
	     *
	     * @param {string} url
	     * @param {Object} against - regex keyed object with the route paths as values
	     * @returns {Array} path - array of the components in the matched path
	     */
	
	    Router.prototype.match = function match(url, against) {
	        var keys = Object.keys(against);
	        for (var i = 0, l = keys.length; i < l; i++) {
	            var regexstr = keys[i],
	                _match = url.match(new RegExp('^' + regexstr + '$'));
	            if (_match !== null) {
	                _match.shift();
	                this.params = _match;
	                return against[regexstr];
	            }
	        }
	
	        if ((0, _isFunction2.default)(this.options.notFoundCallback)) {
	            this.options.notFoundCallback.call(this, url);
	        } else {
	            throw new Error('No matching route found for url: ' + url + '. Provide a notFoundCallback callback option or correct the url or route.');
	        }
	        return []; // Return empty array to keep it all running
	    };
	
	    /**
	     * Gets and possibily normalizes the url
	     *
	     * @param {boolean} [rooted]
	     * @returns {string} url - url from Router
	     */
	
	    Router.prototype.getUrl = function getUrl() {
	        var rooted = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	        return rooted ? this.url : this.url.substring(1);
	    };
	
	    /**
	     * Sets and normalized a url
	     * @param {string} url
	     */
	
	    Router.prototype.setUrl = function setUrl(url) {
	        this.url = url[0] === '/' ? url : '/' + url;
	    };
	
	    /**
	     * Compares an url to the current Router url
	     *
	     * @param {string} url
	     * @returns {boolean} - If true is return the urls match
	     */
	
	    Router.prototype.isUrl = function isUrl(url) {
	        url = url[0] === '/' ? url : '/' + url;
	        return this.url === url;
	    };
	
	    /**
	     * IMPORTANT: Only for internal use, MUST
	     * not be called by users.
	     *
	     * Start building paths for the configured Routes
	     * and finishes the regexes.
	     *
	     * BEWARE: sets this.routes
	     *
	     * Finished
	     * @param Route
	     */
	
	    Router.prototype.parseRoute = function parseRoute(Route) {
	        this.buildPath(Route);
	
	        var rawKeys = Object.keys(this.rawRoutes);
	        for (var i = 0, l = rawKeys.length; i < l; i++) {
	            var k = rawKeys[i],
	
	            // TODO: Could this be improved?
	            nk = k.replace(/(:([\w-]+))/g, '([\\w-]+)').replace(/\//g, '\\/');
	            this.routes[nk] = this.rawRoutes[k];
	        }
	    };
	
	    /**
	     * IMPORTANT: Only for internal use, MUST
	     * not be called by users.
	     *
	     * Recursive function which parses Route instances
	     * and its children routes.
	     *
	     * It builds the regex keyed objects with a path of
	     * Components as values to match an incoming url to.
	     *
	     * BEWARE: sets this.rawRoutes
	     *
	     * @param {Route} Route
	     * @param {Array} [ancestors] - previous Components
	     * @param {Number} [level] - level of nested Routes
	     */
	
	    Router.prototype.buildPath = function buildPath(Route) {
	        var ancestors = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	        var level = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	
	        var children = Route.children,
	            routeComponent = Route.component;
	        routeComponent.level = level;
	
	        if (!children) return;
	
	        var basePath = Route.path,
	            isRoot = ancestors.length === 0;
	
	        for (var i = 0, l = children.length; i < l; i++) {
	            var childRoute = children[i],
	                componentPath = !isRoot ? ancestors.concat(childRoute.component) : ancestors.concat(routeComponent, childRoute.component);
	            var path = undefined;
	
	            if (childRoute.path[0] === '/') {
	                path = childRoute.path;
	            } else if (isRoot) {
	                path = basePath + childRoute.path;
	            } else if (childRoute instanceof IndexRoute) {
	                path = basePath;
	            } else {
	                path = basePath + '/' + childRoute.path;
	            }
	
	            childRoute.path = path;
	            this.rawRoutes[path] = componentPath;
	            this.buildPath(childRoute, componentPath, level + 1);
	        }
	    };
	
	    return Router;
	}();
	
	/**
	 * Normal route
	 * @see router example for usage
	 */
	
	exports.default = Router;
	
	var Route =
	/**
	 * @constructor
	 * @param {string} path - partial or absolute path to Component
	 * @param {Component} Component - component belonging to path
	 * @param {Array} [children] - child Routes
	 */
	exports.Route = function Route(path, Component) {
	    var children = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	
	    _classCallCheck(this, Route);
	
	    this.path = path;
	    this.component = Component;
	    this.children = children;
	};
	
	/**
	 * Default route of a collection of Routes.
	 * @see router example for usage
	 */
	
	var IndexRoute = exports.IndexRoute = function (_Route) {
	    _inherits(IndexRoute, _Route);
	
	    /**
	     * Path is always the path of its parent
	     * @constructor
	     * @param {Component} Component
	     */
	
	    function IndexRoute(Component) {
	        _classCallCheck(this, IndexRoute);
	
	        return _possibleConstructorReturn(this, _Route.call(this, '', Component));
	    }
	
	    return IndexRoute;
	}(Route);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Component2 = __webpack_require__(1);
	
	var _Component3 = _interopRequireDefault(_Component2);
	
	var _isFunction = __webpack_require__(7);
	
	var _isFunction2 = _interopRequireDefault(_isFunction);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Represents a Link
	 *
	 * @class
	 * @classdesc This link is picked up by the Router and
	 * subsequently routed to correct path of the
	 * application.
	 * @augments Component
	 */
	
	var Link = function (_Component) {
	    _inherits(Link, _Component);
	
	    /**
	     * Create a Link instance
	     *
	     * @param {string} url
	     * @param {string|Component|Node} child
	     * @param {Object} [props]
	     *
	     */
	
	    function Link(url, child, props) {
	        _classCallCheck(this, Link);
	
	        var _this = _possibleConstructorReturn(this, _Component.call(this, props));
	
	        _this.url = url;
	        _this.child = child;
	        return _this;
	    }
	
	    /**
	     * @inheritdoc
	     *
	     * @throws an error if incorrect child is provided
	     * @returns {Node}
	     */
	
	    Link.prototype.create = function create() {
	        var _this2 = this;
	
	        // Create root element
	        var a = document.createElement('a'),
	            classNames = this.props.classNames,
	            classNamesLength = classNames.length;
	
	        // Add classes
	        if (classNamesLength > 0) {
	            for (var i = 0; i < classNamesLength; ++i) {
	                a.classList.add(classNames[i]);
	            }
	        }
	
	        this.react(function (state) {
	            var activeClass = _this2.props.activeClass;
	            if (state.Router.isUrl(_this2.url)) {
	                a.classList.add(activeClass);
	            } else {
	                a.classList.remove(activeClass);
	            }
	        });
	
	        // Set href
	        a.setAttribute('href', this.url);
	
	        // Add child
	        if (typeof this.child === 'string') {
	            a.appendChild(document.createTextNode(this.child));
	        } else if (this.child instanceof _Component3.default) {
	            this.mount(this.child);
	            a.appendChild(this.child.render());
	        } else if (this.child instanceof Node) {
	            a.appendChild(this.child);
	        } else if ((0, _isFunction2.default)(this.nest)) {
	            a.appendChild(this.nest());
	        } else {
	            throw new Error('Child should be a string, Component, Node or a nest callback');
	        }
	
	        // Add event
	        this.on(a, this.props.defaultEvent, function (e, state) {
	            e.preventDefault();
	            return state.Router.goTo(_this2.url, _this2.props.title, _this2.props.data);
	        });
	
	        return a;
	    };
	
	    return Link;
	}(_Component3.default);
	
	// Set default properties
	
	exports.default = Link;
	Link.defaultProps = {
	    classNames: [],
	    data: {}, // Data to push with pushState()
	    title: '',
	    defaultEvent: 'click',
	    activeClass: 'active'
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = debounce;
	/**
	 * Debounces a function call
	 *
	 * @param {Function} fn - function to debounce
	 * @param {Number} delay - timeout for debouncing
	 * @param {Object} scope
	 * @returns {Function}
	 */
	function debounce(fn, delay, scope) {
	    var timer = null;
	    return function () {
	        var context = scope || this,
	            args = arguments;
	        clearTimeout(timer);
	        timer = setTimeout(function () {
	            return fn.apply(context, args);
	        }, delay);
	    };
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = throttle;
	/**
	 * Throttle function
	 *
	 * @param {Function} fn - function to throttle
	 * @param {Number} threshold - timeout for throttling
	 * @param {Object} scope
	 * @returns {Function}
	 */
	function throttle(fn, threshold, scope) {
	    threshold || (threshold = 250);
	    var last = undefined,
	        deferTimer = undefined;
	    return function () {
	        var context = scope || this,
	            now = +new Date(),
	            args = arguments;
	        if (last && now < last + threshold) {
	            // hold on to it
	            clearTimeout(deferTimer);
	            deferTimer = setTimeout(function () {
	                last = now;
	                return fn.apply(context, args);
	            }, threshold);
	        } else {
	            last = now;
	            return fn.apply(context, args);
	        }
	    };
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _merge = __webpack_require__(3);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	var _isFunction = __webpack_require__(7);
	
	var _isFunction2 = _interopRequireDefault(_isFunction);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Simple wrapper for native
	 * XMLHttpRequest
	 *
	 * BEWARE: Does not do any url checking,
	 * this should be implemented by the user
	 */
	
	var Fetch = function () {
	    /**
	     * Creates the Fetch instance
	     *
	     * @param url
	     * @param options
	     */
	
	    function Fetch(url) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	        _classCallCheck(this, Fetch);
	
	        this.url = url;
	        this.options = (0, _merge2.default)({
	            method: 'GET',
	            async: true,
	            user: '',
	            password: '',
	            beforeSend: null
	        }, options);
	        this.native = new XMLHttpRequest();
	        // Create default promise function
	        this.createPromiseFunction();
	    }
	
	    /**
	     * Creates the promise function which
	     * is return by Fetch::promise(), can
	     * be overwritten by a subclass or can be
	     * set with Fetch::setPromiseFunction()
	     */
	
	    Fetch.prototype.createPromiseFunction = function createPromiseFunction() {
	        var _this = this;
	
	        this.promiseFunction = function (resolve, reject) {
	            _this.native.onreadystatechange = function () {
	                if (_this.native.readyState != 4) return;
	
	                if (_this.native.status == 200) {
	                    resolve(_this);
	                } else {
	                    reject(_this);
	                }
	            };
	        };
	    };
	
	    /**
	     * Sets the function which is used
	     * when a promise is created through
	     * Fetch::promise()
	     *
	     * @param {Function} fn
	     * @throws {Error}
	     * @returns {Fetch}
	     */
	
	    Fetch.prototype.setPromiseFunction = function setPromiseFunction(fn) {
	        if (!(0, _isFunction2.default)(fn)) {
	            throw new Error('Promise function must be a function.');
	        }
	        this.promiseFunction = fn.bind(this);
	        return this;
	    };
	
	    /**
	     * Creates a new promise with
	     * given promise function.
	     *
	     * @returns {Promise}
	     */
	
	    Fetch.prototype.promise = function promise() {
	        return new Promise(this.promiseFunction);
	    };
	
	    /**
	     * Sets a header for the request
	     *
	     * @param {String} header
	     * @param {String} value
	     * @returns {Fetch}
	     */
	
	    Fetch.prototype.setHeader = function setHeader(header, value) {
	        this.native.setRequestHeader(header, value);
	        return this;
	    };
	
	    /**
	     * Sets callback that is fired
	     * before the request is sent.
	     *
	     * @param {Function} callback
	     * @returns {Fetch}
	     */
	
	    Fetch.prototype.before = function before(callback) {
	        if (!(0, _isFunction2.default)(callback)) {
	            throw new Error('Callback must be a function.');
	        }
	
	        this.options.beforeSend = callback;
	        return this;
	    };
	
	    /**
	     * Opens the connection for the request
	     *
	     * ONLY FOR INTERNAL USE
	     */
	
	    Fetch.prototype.open = function open() {
	        this.native.open(this.options.method, this.url, this.options.async, this.options.user, this.options.password);
	    };
	
	    /**
	     * Sends the request, also triggers
	     * the before callback
	     *
	     * @param {*} data
	     * @returns {Fetch}
	     */
	
	    Fetch.prototype.send = function send(data) {
	        this.open();
	        if ((0, _isFunction2.default)(this.options.beforeSend)) {
	            this.options.beforeSend(this);
	        }
	        this.native.send(data);
	        return this;
	    };
	
	    /**
	     * Stops the request
	     *
	     * @returns {Fetch}
	     */
	
	    Fetch.prototype.abort = function abort() {
	        this.native.abort();
	        return this;
	    };
	
	    /**
	     * Gets the response text from
	     * the request
	     *
	     * @returns {string}
	     */
	
	    Fetch.prototype.response = function response() {
	        return this.native.responseText;
	    };
	
	    /**
	     * Gets the response text and
	     * parses it to JSON
	     *
	     * Will fail when invalid string is provided
	     */
	
	    Fetch.prototype.jsonResponse = function jsonResponse() {
	        return JSON.parse(this.native.responseText);
	    };
	
	    return Fetch;
	}();
	
	exports.default = Fetch;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = action;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Represents an action on a part
	 * of the state tree.
	 *
	 * use with Component::on()
	 *
	 * IMPORTANT: Callback must return a Do
	 * class of which the first param is a boolean
	 * which indicates if something in a part of the
	 * state tree has changed or not
	 *
	 * @callback cb
	 * @param {Function} cb
	 * @param {*} [scope]
	 * @returns {Function}
	 */
	function action(cb, scope) {
	    return function (e, state) {
	        var context = scope || this,
	            d = cb.call(context, e, state);
	        if (!d instanceof Do) throw new Error('Action callback should return a Do class.');
	        Object.defineProperty(d.part, '__kompo_stale__', { writable: true, value: d.it });
	        return d.it;
	    };
	}
	
	/**
	 * Represents a flag that indicates
	 * if a part of the state tree has been changed
	 * or not and saves that part of the state tree.
	 */
	
	var Do =
	/**
	 * Creates Do
	 *
	 * @param (boolean) d - If state (part) has changed
	 * @param {*} part - Part of state which is involved in the action
	 */
	exports.Do = function Do(d, part) {
	    _classCallCheck(this, Do);
	
	    this.it = d;
	    this.part = part;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Fetch2 = __webpack_require__(16);
	
	var _Fetch3 = _interopRequireDefault(_Fetch2);
	
	var _isFunction = __webpack_require__(7);
	
	var _isFunction2 = _interopRequireDefault(_isFunction);
	
	var _requestAnimationFrame = __webpack_require__(2);
	
	var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);
	
	var _action = __webpack_require__(17);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Represents an asynchronous XHR request
	 * and provides some help handling the request
	 */
	
	var AsyncAction = function (_Fetch) {
	    _inherits(AsyncAction, _Fetch);
	
	    function AsyncAction() {
	        _classCallCheck(this, AsyncAction);
	
	        return _possibleConstructorReturn(this, _Fetch.apply(this, arguments));
	    }
	
	    /**
	     * Creates the action callback and
	     * injects the state and Component.
	     * This way it is possible to use these in
	     * the promise that is returned together
	     * with AsyncAction::do()
	     *
	     * Use with Component::on()
	     *
	     * @param {Function} callback
	     * @param {*} data
	     * @returns {Function}
	     */
	
	    AsyncAction.prototype.when = function when(callback, data) {
	        var _this2 = this;
	
	        return function (e, state, Component) {
	            _this2.state = state;
	            _this2.Component = Component;
	            var result = callback(e, _this2, state, Component);
	            result = _this2.flagObject(result);
	
	            if (result) {
	                _this2.send(data);
	            }
	
	            return result;
	        };
	    };
	
	    /**
	     * Sets state separately when
	     * AsyncAction::when() is not used
	     *
	     * @param {*} state
	     * @returns {AsyncAction}
	     */
	
	    AsyncAction.prototype.setState = function setState(state) {
	        this.state = state;
	        return this;
	    };
	
	    /**
	     * Sets Component separately when
	     * AsyncAction::when() is not used
	     *
	     * @param {Component} Component
	     * @returns {AsyncAction}
	     */
	
	    AsyncAction.prototype.setComponent = function setComponent(Component) {
	        this.Component = Component;
	        return this;
	    };
	
	    /**
	     * Sets flag in order for
	     * reaction() function to determine
	     * a part of the state tree is stale
	     *
	     * @param {(boolean|Do)} result
	     * @returns {boolean}
	     */
	
	    AsyncAction.prototype.flagObject = function flagObject(result) {
	        if (result instanceof _action.Do) {
	            Object.defineProperty(result.part, '__kompo_stale__', { writable: true, value: result.it });
	            return result.it;
	        }
	
	        return result;
	    };
	
	    /**
	     * POSSIBLE, BUT TO KEEP A CONSISTENT API
	     * NOT IMPLEMENTED
	     */
	    //send(data) {
	    //    this.open();
	    //    if(isFunction(this.options.beforeSend)){
	    //        this.options.beforeSend(this, this.state, this.Component);
	    //        console.log(123);
	    //    }
	    //    this.native.send(data);
	    //    return this;
	    //}
	
	    /**
	     * NOT YET SUPPORTED
	     *
	     * @param callback
	     * @returns {Function}
	     */
	    //promise() {
	    //    return new ActionPromise(this.promiseFunction);
	    //}
	
	    /**
	     * To be used together with Promise
	     * functions, inject the state and Component
	     *
	     * And if changes are done it update the
	     * Component tree from root
	     *
	     * @param {Function} callback
	     * @returns {Function}
	     */
	
	    AsyncAction.prototype.do = function _do(callback) {
	        var _this3 = this;
	
	        return function (self) {
	            var result = callback(self, _this3.state, _this3.Component);
	            result = _this3.flagObject(result);
	            if (result) {
	                var root = _this3.Component.getRoot();
	                if (root === null) {
	                    (0, _requestAnimationFrame2.default)(_this3.Component.update.bind(_this3.Component));
	                } else {
	                    (0, _requestAnimationFrame2.default)(root.update.bind(root));
	                }
	            }
	        };
	    };
	
	    return AsyncAction;
	}(_Fetch3.default);
	
	/**
	 * NOT YET SUPPORTED
	 */
	//export class ActionPromise extends Promise {
	//    then(callback) {
	//        super.then(callback);
	//        this.Component.update();
	//        return this;
	//    }
	//
	//    catch(callback) {
	//        super.catch(callback);
	//        this.Component.update();
	//        return this;
	//    }
	//}
	
	exports.default = AsyncAction;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = reaction;
	
	var _isObject = __webpack_require__(6);
	
	var _isObject2 = _interopRequireDefault(_isObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Represents a cached reaction for
	 * use with Component::react()
	 *
	 * @callback callback
	 * @param {Function} callback
	 * @param {*} [scope]
	 * @returns {Function}
	 */
	function reaction(callback, scope) {
	    var previous = undefined;
	    return function (state, Component) {
	        var context = scope || this,
	            isObj = (0, _isObject2.default)(previous);
	        if (isObj && previous.__kompo_stale__ === true) {
	            previous = undefined;
	        }
	        // Callback MUST returns part of state which is cached
	        previous = callback.call(context, state, previous, Component);
	
	        if (isObj && previous.hasOwnProperty('__kompo_stale__')) {
	            previous.__kompo_stale__ = false;
	        }
	
	        return previous;
	    };
	}

/***/ }
/******/ ]);
//# sourceMappingURL=kompo.js.map