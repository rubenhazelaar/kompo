import construct, {
    render
    ,update
    ,kompo
    ,setState
    ,mount
    ,react
    ,slot
    ,getRouter
    ,unmount
    ,unmountAll
    ,mountIndex
    ,getState
} from './component/component';
import constructRouter, {
    route
    ,indexRoute 
    ,swap
} from './router/router';
import app from './state/app';
import dispatch from './state/dispatch';
import observe, {
    inheritObserved
    ,markClean
    ,markDirty
} from './state/observe';
import hasProxy from './util/hasProxy';
import isObject from './util/isObject';
import merge from './util/merge';

const router = {
    construct: constructRouter
    ,route
    ,indexRoute
    ,swap
};

const state = {
    app
    ,dispatch
    ,observe
    ,inheritObserved
    ,markClean
    ,markDirty
};

const util = {
    hasProxy
    ,isObject
    ,merge
};

export default {
    construct
    ,render
    ,update
    ,kompo
    ,setState
    ,mount
    ,react
    ,slot
    ,getRouter
    ,unmount
    ,unmountAll
    ,mountIndex
    ,getState
};

export {
    router
    ,state
    ,util
};