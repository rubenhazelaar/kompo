import component, {
    render
    ,update
    ,kompo
    ,setState
    ,mount
    ,react
    ,slot
    ,getRouter
} from './component/component';
import router, {
    route
    ,indexRoute 
    ,swap
} from './router/router';
import app from './state/app';
import dispatch from './state/dispatch';
import observe, {
    inheritObserved
    ,markClean
} from './state/observe';
import hasProxy from './util/hasProxy';
import isObject from './util/isObject';
import merge from './util/merge';


export default component;

export {
    render
    ,update
    ,kompo
    ,setState
    ,mount
    ,react
    ,slot
    ,getRouter
    ,router
    ,route
    ,indexRoute
    ,swap
    ,app
    ,dispatch
    ,observe
    ,inheritObserved
    ,markClean
    ,hasProxy
    ,isObject
    ,merge
};