export type state = any;
export type mounts = KompoElement[];
export type props = any;
export type attributes = Object;
export type options = Object;
export type statefull = (state: state, Element?: KompoElement) => void;

export type router = {
    getParams: () => string[];
    isUrl: (u: string) => boolean;
    getUrl: () => string;
    setTo: (u: string) => boolean;
    goTo: (u: string, title?: string, data?: any) => boolean;
    get: (parent?: KompoElement, includeSiblings?: boolean) => undefined | KompoElementOrPromise;
    getWithDepth: (depth: number, parent?: KompoElement, includeSiblings?: boolean) => undefined | KompoElementOrPromise[];

};

export type routeType = {
    children: routeType[]
    component: KompoElementOrPromise,
    path: string
    components?: KompoElementOrPromise[],
    hierarchy?: number[]
};

export type routeMap = { [key: string]: routeType | rawRoute };

export type rawRoute = {
    components: KompoElementOrPromise[],
    hierarchy: number[]
};

export type rawRouteMap = { [key: string]: rawRoute };

export type componentPromiseCallback = () => KompoPromise<KompoElement>;
export interface  ComponentPromiseCallback extends componentPromiseCallback {
    kompo: kompoBase;
    setSiblingRoutes(routes: routeType[]): void;
    getSiblingRoutes(): undefined | routeType[];
}

// TODO correct definition
export class KompoPromise<T> extends Promise<T> {
    kompo: kompoBase;

    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        super(executor);

        this.kompo = {
            initial: true,
            props: {},
            defaultProps: {},
            mounts: [],
            statefulls: [],
            slots: {},
            routed: undefined,
            selector: undefined,
            unmount: undefined,
            debug: false,
            level: 0
        };
    }

    setSiblingRoutes(routes: routeType[]) {
        this.kompo.siblingRoutes = routes;
    }

    getSiblingRoutes(): undefined | routeType[] {
        return this.kompo.siblingRoutes;
    }
}

export type slotCallback = (Element: KompoElement) => void;
export type selector = (state: state) => state;
export type constructFn = (this: KompoElement, props: props) => void;
export type constructComponent = (props?: props) => KompoElement;
export type mountOptions = { Element: KompoElement, selector: undefined | selector, useParentSelector: undefined | boolean }

export type kompoBase = {
    debug: boolean;
    initial: boolean;
    props: props;
    defaultProps: props;
    mounts: mounts;
    statefulls: Array<statefull>;
    slots: { [key: string]: slotCallback };
    selector?: selector;
    unmount?: Function;
    level: number;
    routed?: KompoElement;
    resolved?: KompoElement;
    siblingRoutes?: routeType[];
};

export class KompoElement extends Element {
    kompo: kompoBase;
    // TODO merge with kompo with __kompo__?
    __kompo__: {
        root: KompoElement;
        state: state;
        router: router;
    };
    // TODO Pre- and suffix double underscores? Only if for internal use (should be the case)
    construct: constructFn;

    constructor(root: KompoElement, state: state, router: router, constructFn: constructFn) {
        super();

        this.kompo = {
            initial: true,
            props: {},
            defaultProps: {},
            mounts: [],
            statefulls: [],
            slots: {},
            routed: undefined,
            selector: undefined,
            unmount: undefined,
            debug: false,
            level: 0
        };

        this.__kompo__= {
            root: root,
            state: state,
            router: router
        };

        this.construct = constructFn;
    }

    setSiblingRoutes(routes: routeType[]) {
        this.kompo.siblingRoutes = routes;
    }

    getSiblingRoutes(): undefined | routeType[] {
        return this.kompo.siblingRoutes;
    }

}

export type KompoElementOrPromise = KompoElement | KompoPromise<KompoElement> | ComponentPromiseCallback;
