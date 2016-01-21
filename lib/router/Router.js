'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IndexRoute = exports.Route = undefined;

var _requestAnimationFrame = require('../utils/requestAnimationFrame.js');

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

var _merge = require('../utils/merge.js');

var _merge2 = _interopRequireDefault(_merge);

var _isFunction = require('../utils/isFunction.js');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _Component = require('../component/Component.js');

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