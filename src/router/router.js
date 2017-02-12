// @flow
import merge from '../util/merge';
import {render} from '../component/component';

export default function construct(props:props):router {
    props = merge({
        base: '/',
        url: '/',
        notFoundCallback: function (url) {
            throw new Error('No matching route found for url: ' + url + '. Provide a notFoundCallback callback option or correct the url or route.');
        }
    }, props);

    let base,
        url,
        index = 0,
        params = [];

    const rawRoutes = {},
        routes = {};

    setBase(props.base);
    setUrl(props.url);
    parseRoute(props.routes);

    function setBase(b) {
        if (b[0] !== '/') {
            base = '/' + b;
            return;
        }

        if (b.slice(-1) === '/') {
            base = b.slice(0, -1);
        }
    }

    function setUrl(u) {
        url = u[0] === '/' ? u : '/' + u;
    }

    function isUrl(u) {
        u = u[0] === '/' ? u : '/' + u;
        return url === u;
    }

    function parseRoute(Route) {
        buildPath(Route);

        const rawKeys = Object.keys(rawRoutes);
        for (let i = 0, l = rawKeys.length; i < l; i++) {
            const k = rawKeys[i],
            // TODO: Could this be improved?
                nk = k.replace(/(:([\w-]+))/g, '([\\w-]+)')
                    .replace(/\//g, '\\/');
            routes[nk] = rawRoutes[k];
        }
    }

    function buildPath(route, ancestors = [], level = 0) {
        const children = route.children;
        const routeComponent = route.component;

        if(routeComponent instanceof Element) {
            routeComponent.kompo.level = level;
        } else if (routeComponent instanceof Promise) {
            // Set a level to the promise
            routeComponent.kompo = { level };
        }

        if (!children) return;

        const basePath = route.path,
            isRoot = ancestors.length === 0;

        for (let i = 0, l = children.length; i < l; i++) {
            const childRoute = children[i],
                componentPath = !isRoot ?
                    ancestors.concat(childRoute.component) :
                    ancestors.concat(routeComponent, childRoute.component);
            let path;

            if (childRoute.path[0] === '/') {
                path = childRoute.path;
            } else if (isRoot) {
                path = basePath + childRoute.path;
            } else if (childRoute.path === '') {
                path = basePath;
            } else {
                path = basePath + '/' + childRoute.path;
            }

            childRoute.path = path;
            rawRoutes[path] = componentPath;
            buildPath(childRoute, componentPath, level + 1);
        }
    }

    function match(url, against) {
        const keys = Object.keys(against);
        for (let i = 0, l = keys.length; i < l; i++) {
            const regexstr = keys[i],
                match = url.match(new RegExp('^' + regexstr + '$'));
            if (match !== null) {
                match.shift();
                params = match;
                return against[regexstr];
            }
        }

        if (props.notFoundCallback) {
            props.notFoundCallback(url);
        }

        return []; // Return empty array to keep it all running
    }

    return {
        getParams: () => params,
        isUrl,
        goTo: (u, title = '', data = null) => {
            if (isUrl(u)) return false;

            setUrl(u);

            history.pushState(data, title, base + url);
            return true;
        },
        get: (parent, depth) => {
            if (parent instanceof Element) {
                index = parent.kompo.level + 1;
            }

            if(depth) {
                return match(url, routes).slice(index, index + depth);
            } else {
                return match(url, routes)[index];
            }
        }
    }
}

export function route(path:string, component:KompoElement, children:?Array<any>):{path:string; component:KompoElement; children:?Array<any>;} {
    return {
        path, component, children
    };
}

export function indexRoute(component: KompoElement):?{path:string; component:KompoElement; children:?Array<any>;}  {
    return route('', component);
}

export function swap(component: KompoElement, router:router, element:Element):void {
    const c = router.get(component);

    if(c) {
        if(c instanceof Element) {
            _swap(component, c, element)
        } else if (c instanceof Promise) {
            c.then((rc) => {
                rc.kompo.level = c.kompo.level;

                _swap(component, rc, element)
            }).catch(() => {
                console.error("Cannot dynamically load module for route")
            });
        }
    }
}

function _swap(parent: KompoElement, routedComponent: KompoElement, element: Element):void {
    const routed = parent.kompo.routed,
        el = element ? element : parent;

    if (routed) {
        el.replaceChild(routedComponent, routed);
        parent.kompo.mounts.splice(parent.kompo.mounts.indexOf(routed, 1));
    } else {
        el.appendChild(routedComponent);
    }

    render(routedComponent);

    if (parent.kompo.mounts.indexOf(routedComponent) == -1) {
        parent.kompo.mounts.push(routedComponent);
    }

    parent.kompo.routed = routedComponent;
}