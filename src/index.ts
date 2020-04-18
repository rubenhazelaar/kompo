import app, {debugModeOn} from './component/app';
import compose from './component/compose';
import construct, {kompo, getProps} from './component/construct';
import {debug, debugLifeCycle} from './component/debug';
import getRouter from './component/getRouter';
import mount, {
    getMounts
    ,Mountable
    ,mountable
    ,unmount
    ,unmountAll
    ,mountIndex
} from './component/mount';

import react from './component/react';
import render from './component/render'; 
import slot, {hasSlot} from './component/slot';
import {setState, getState, getSelector} from './component/state';
import update from './component/update';

import constructRouter, {
    route
    ,indexRoute
    ,swap
} from './router/router';
import link from './router/link';

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
import deproxy from './util/deproxy';
import isObject from './util/isObject';
import isFunction from './util/isFunction';

const router = {
    construct: constructRouter
    ,route
    ,indexRoute
    ,swap
    ,link
};

const state = {
    observe
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
    deproxy
    ,isObject
    ,isFunction
};

export default {
    construct
    ,app
    ,debugModeOn
    ,render
    ,update
    ,kompo
    ,setState
    ,mount
    ,getMounts
    ,mountable
    ,Mountable
    ,react
    ,slot
    ,hasSlot
    ,getRouter
    ,unmount
    ,unmountAll
    ,mountIndex
    ,getState
    ,compose
    ,getProps
    ,debug
    ,debugLifeCycle
    ,getSelector
};

export {
    router
    ,state
    ,util
};