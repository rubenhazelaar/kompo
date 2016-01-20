import RAF from '../utils/requestAnimationFrame.js';
import merge from '../utils/merge.js';
import isFunction from '../utils/isFunction.js';
import Component from '../component/Component.js';

/**
 * Router class which works
 * closely together with the Component class
 * in order to facilitate routing and efficient
 * creation, rendering and updating
 *
 * @see router examples for usage
 */
export default class Router {
    /**
     * Create the Router
     *
     * @constructor
     * @param {Object} state
     * @param {Route} Route
     * @param {string} [base]
     * @param {Object} [options]
     */
    constructor(state, Route, base = '', options = {}) {
        // Add self (Router) to state
        // TODO: Make this configurable?
        state.Router = this;
        this.state = state;
        this.options = merge({
            notFoundCallback: null
        }, options);
        this.setBase(base);
        this.url = '/';
        this.rawRoutes = {};
        this.routes = {};
        this.index = 0;
        this.params = [];

        this.parseRoute(Route);

        window.addEventListener('popstate', ()=>{
            this.setUrl(window.location.pathname.replace(this.base,''));
            // Just update the whole tree from the root up.
            const component = this.getCurrentComponent(null);
            RAF(component.update.bind(component));
        });
    }

    /**
     * Sets and normalizes the base used in
     * Router::goTo()
     *
     * @param {string} base
     */
    setBase(base) {
        if(base[0] !== '/') {
            base = '/' + base;
        }

        if(base.slice(-1) === '/') {
            base = base.slice(0,-1);
        }

        this.base = base;
    }

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
    goTo(url, title = null, data = null) {
        if(this.isUrl(url)) return false;
        this.setUrl(url);
        // TODO: What can we possibly do with this?
        this.data = data;
        history.pushState(data, title, this.base + this.url);
        return true;
    }

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
    getComponent(parent) {
        if(parent instanceof Component) {
            this.index = parent.level + 1;
        }

        return this.match(this.url, this.routes)[this.index];
    }

    /**
     * Gets the current component from the routed path
     *
     * @param {Component} parent
     * @returns {Component} current
     */
    getCurrentComponent(parent) {
        const isNull = parent === null;
        if(!isNull || !parent instanceof Component) {
            throw new Error('Cannot get current Component.Parameter parent must be null for the root parent or a Component to return its child component');
        }
        const path = this.match(this.url, this.routes);
        return isNull? path[0]: path[parent.level + 1];
    }

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
    match(url, against) {
        const keys = Object.keys(against);
        for(let i = 0, l = keys.length; i < l; i++) {
            const regexstr = keys[i],
                match = url.match(new RegExp('^' + regexstr + '$'));
            if(match !== null) {
                match.shift();
                this.params = match;
                return against[regexstr];
            }
        }

        if(isFunction(this.options.notFoundCallback)) {
            this.options.notFoundCallback.call(this, url);
        } else {
            throw new Error('No matching route found for url: '+url+'. Provide a notFoundCallback callback option or correct the url or route.');
        }
        return []; // Return empty array to keep it all running
    }

    /**
     * Gets and possibily normalizes the url
     *
     * @param {boolean} [rooted]
     * @returns {string} url - url from Router
     */
    getUrl(rooted = true) {
        return rooted? this.url: this.url.substring(1);
    }

    /**
     * Sets and normalized a url
     * @param {string} url
     */
    setUrl(url) {
        this.url = url[0] === '/'? url: '/' + url;
    }

    /**
     * Compares an url to the current Router url
     *
     * @param {string} url
     * @returns {boolean} - If true is return the urls match
     */
    isUrl(url) {
        url = url[0] === '/'? url: '/' + url;
        return this.url === url;
    }

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
    parseRoute(Route) {
        this.buildPath(Route);

        const rawKeys = Object.keys(this.rawRoutes);
        for(let i = 0, l = rawKeys.length; i < l; i++) {
            const k = rawKeys[i],
                // TODO: Could this be improved?
                nk = k.replace(/(:([\w-]+))/g, '([\\w-]+)')
                    .replace(/\//g,'\\/');
            this.routes[nk] = this.rawRoutes[k];
        }
    }

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
    buildPath(Route, ancestors = [], level = 0) {
        const children = Route.children,
            routeComponent = Route.component;
        routeComponent.level = level;

        if(!children) return;

        const basePath = Route.path,
            isRoot = ancestors.length === 0;

        for(let i = 0, l = children.length; i < l; i++) {
            const childRoute = children[i],
                componentPath = !isRoot ?
                    ancestors.concat(childRoute.component):
                    ancestors.concat(routeComponent, childRoute.component);
            let path;

            if(childRoute.path[0] === '/') {
                path = childRoute.path;
            } else if(isRoot) {
                path = basePath + childRoute.path;
            } else if(childRoute instanceof IndexRoute) {
                path = basePath;
            } else {
                path = basePath + '/' + childRoute.path;
            }

            childRoute.path = path;
            this.rawRoutes[path] = componentPath;
            this.buildPath(childRoute, componentPath, level + 1);
        }
    }
}

/**
 * Normal route
 * @see router example for usage
 */
export class Route {
    /**
     * @constructor
     * @param {string} path - partial or absolute path to Component
     * @param {Component} Component - component belonging to path
     * @param {Array} [children] - child Routes
     */
    constructor(path, Component, children = []) {
        this.path = path;
        this.component = Component;
        this.children = children;
    }
}

/**
 * Default route of a collection of Routes.
 * @see router example for usage
 */
export class IndexRoute extends Route {
    /**
     * Path is always the path of its parent
     * @constructor
     * @param {Component} Component
     */
    constructor(Component) {
        super('', Component);
    }
}