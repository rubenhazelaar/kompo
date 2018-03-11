import construct, {
    render
    ,update
    ,kompo
    ,setState
    ,mount
    ,getMounts
    ,mountable
    ,react
    ,slot
    ,getRouter
    ,unmount
    ,unmountAll
    ,mountIndex
    ,getState
    ,compose
    ,getProps
    ,constructClass
    ,debug
    ,debugLifeCycle
    ,getSelector
} from './component/component';
import link from './router/link';
import constructRouter, {
    route
    ,indexRoute 
    ,swap
} from './router/router';
import app from './state/app';
import dispatch from './state/dispatch';
import observe, {
    inheritObserved
    ,ignore
    ,deproxy
    ,markClean
    ,markDirty
} from './state/observe';
import hasProxy from './util/hasProxy';
import isObject from './util/isObject';
import merge from './util/merge';
import isFunction from './util/isFunction';

const router = {
    construct: constructRouter
    ,route
    ,indexRoute
    ,swap
    ,link
};

const state = {
    app
    ,dispatch
    ,observe
    ,ignore
    ,deproxy
    ,inheritObserved
    ,markClean
    ,markDirty
};

const util = {
    hasProxy
    ,isObject
    ,merge
    ,isFunction
};

export default {
    construct
    ,render
    ,update
    ,kompo
    ,setState
    ,mount
    ,getMounts
    ,mountable
    ,react
    ,slot
    ,getRouter
    ,unmount
    ,unmountAll
    ,mountIndex
    ,getState
    ,compose
    ,getProps
    ,constructClass
    ,debug
    ,debugLifeCycle
    ,getSelector
};

export {
    router
    ,state
    ,util
};