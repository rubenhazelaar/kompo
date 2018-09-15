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
import observe, {
    isProxy
    ,ignore
    ,shouldIgnore
    ,resetIgnore
    ,dispatch
    ,ignoreUpdate
    ,resetIgnoreUpdate
    ,triggerUpdate
} from './state/store';
import hasProxy from './util/hasProxy';
import deproxy from './util/deproxy';
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
    ,observe
    ,isProxy
    ,ignore
    ,shouldIgnore
    ,resetIgnore
    ,dispatch
    ,ignoreUpdate
    ,resetIgnoreUpdate
    ,triggerUpdate
};

const util = {
    hasProxy
    ,deproxy
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