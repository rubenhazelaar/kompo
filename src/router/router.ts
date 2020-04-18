import {
    ComponentPromiseCallback,
    KompoElement,
    KompoElementOrPromise,
    KompoPromise,
    props,
    rawRoute,
    routeMap,
    router,
    routeType
} from "../types";

import mount, {unmount} from '../component/mount';
import isFunction from '../util/isFunction';

export default function construct(props: props): router {
    props = Object.assign({
        base: '/',
        url: '/',
        notFoundCallback: function (url: string) {
            throw new Error('No matching routeType found for url: ' + url + '. Provide a notFoundCallback callback option or correct the url or routeType.');
        }
    }, props);

    let base: string,
        url: string,
        index: number = 0,
        params: string[] = [];

    const rawRoutes: routeMap = {},
        routes: routeMap = {};

    setBase(props.base);
    setUrl(props.url);
    parseRoute(props.routes);

    function setBase(b: string) {
        if (b[0] !== '/') {
            b = '/' + b;
        }

        if (b.slice(-1) === '/') {
            b = b.slice(0, -1);
        }

        base = b;
    }

    function setUrl(u: string) {
        url = u[0] === '/' ? u : '/' + u;
    }

    function isUrl(u: string) {
        u = u[0] === '/' ? u : '/' + u;
        return url === u;
    }

    function parseRoute(Route: routeType) {
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

    function buildPath(route: routeType, ancestors: KompoElementOrPromise[] = [], hierarchy: number[] = [], level = 0) {
        const children = route.children;
        const routeComponent = route.component;

        if (routeComponent.hasOwnProperty('kompo')) {
            // Set a level to the promise
            routeComponent.kompo.level = level;
        }

        if (!children) return;

        const basePath = route.path,
            isRoot = ancestors.length === 0;

        for (let i: number = 0, l = children.length; i < l; i++) {
            const childRoute = children[i],
                componentPath = !isRoot ?
                    ancestors.concat(childRoute.component) :
                    ancestors.concat(routeComponent, childRoute.component),
                childHierarchy = hierarchy.concat(i);

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
            rawRoutes[path] = {
                components: componentPath,
                hierarchy: childHierarchy
            };
            buildPath(childRoute, componentPath, childHierarchy, level + 1);
        }
    }

    function match(url: string, against: routeMap): undefined | routeType | rawRoute {
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

        return;
    }

    function getSiblingRoutes(hierarchy: number[], index: number): routeType[] {
        return scanSiblingsRoutes(hierarchy, props.routes, index - 1, 0);
    }

    function scanSiblingsRoutes(hierarchy: number[], parentRoute: routeType, toIndex: number, currentIndex: number): routeType[] {
        hierarchy = hierarchy.slice(); // Slice in order to prevent editing original array
        if (currentIndex === toIndex) {
            return parentRoute.children
        }

        const i = hierarchy.shift();

        if (!i) throw new Error('cannot determine child index from hierarchy');

        return scanSiblingsRoutes(hierarchy, parentRoute.children[i], toIndex, currentIndex + 1)
    }

    function _get(parent?: KompoElement, includeSiblings?: boolean): undefined | KompoElementOrPromise[] {
        if (parent && parent.hasOwnProperty('kompo')) {
            index = parent.kompo.level + 1;
        }

        const matchedRoute = match(url, routes);

        if (!matchedRoute) {
            console.log('cannot find matched route');
            return;
        }

        if (!matchedRoute.components) {
            console.log('cannot find components from matched route');
            return;
        }

        const routeComponents = matchedRoute.components;

        if (includeSiblings && matchedRoute.hierarchy) {
            routeComponents[index].setSiblingRoutes(
                getSiblingRoutes(matchedRoute.hierarchy, index)
            )
        }

        return routeComponents;
    }

    return {
        getParams: () => params,
        isUrl,
        getUrl: () => url,
        setTo: (u: string) => {
            u = u.replace(base, '');
            if (isUrl(u)) return false;

            setUrl(u);
            return true;
        },
        goTo: (u: string, title?: string, data?: any) => {
            if (isUrl(u)) return false;

            setUrl(u);

            history.pushState(data, title || '', base + url);
            return true;
        },
        getWithDepth: (depth: number, parent?: KompoElement, includeSiblings?: boolean): undefined | KompoElementOrPromise[] => {
            const routeComponents = _get(parent, includeSiblings);

            if (!routeComponents) return;

            // For negative values, do + because index-(-depth) will be positive instead of negative
            if (depth < 0) {
                return routeComponents.slice(index + depth, index + 1);
            }

            return routeComponents.slice(index, index + depth);
        },
        get: (parent?: KompoElement, includeSiblings?: boolean): undefined | KompoElementOrPromise => {
            const routeComponents = _get(parent, includeSiblings);

            if (!routeComponents) return;

            return routeComponents[index];
        }
    }
}

export function route(path: string, component: KompoElement, children?: routeType[]): routeType {
    return {path, component, children: children || []};
}

export function indexRoute(component: KompoElement, children?: routeType[]): routeType {
    return route('', component, children);
}

export function swap(component: KompoElement, router: router, element?: Element): void {
    let c = router.get(component), fn: ComponentPromiseCallback;

    if (!c) return;

    if (isFunction(c)) {
        c = <ComponentPromiseCallback>c;
        fn = c;
        c = _toPromise(c);
    }

    if (c instanceof Element) {
        c = <KompoElement>c;
        _swap(component, c, element);
    } else if (c instanceof Promise) {
        if (c.kompo.resolved) {
            _swap(component, c.kompo.resolved, element);
        } else {
            c.then((rc) => {
                // Type cast to remove unnecessary Typescript compile error
                c = <KompoPromise<KompoElement>>c;
                rc.kompo.level = c.kompo.level;
                _swap(component, rc, element);
                c.kompo.resolved = rc;
                if (fn) fn.kompo.resolved = rc;
            }).catch(() => {
                console.error("Cannot dynamically load module for routeType")
            });
        }
    }
}

function _toPromise(fn: ComponentPromiseCallback): KompoPromise<KompoElement> {
    const pr = fn();

    // Transfer kompo object including level to the promise
    pr.kompo = fn.kompo;

    return pr
}

function _swap(parent: KompoElement, routedComponent: KompoElement, element?: Element): void {
    const routed = parent.kompo.routed,
        el = element ? element : parent;

    if (routed === routedComponent) return;

    if (routed) {
        el.replaceChild(routedComponent, routed);
        unmount(routed);
    } else {
        el.appendChild(routedComponent);
    }

    mount(parent, routedComponent);
    parent.kompo.routed = routedComponent;
}