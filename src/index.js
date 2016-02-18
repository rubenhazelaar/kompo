import Component from './component/Component.js';
import Collection from './component/Collection.js';
import create, { createFragment, createText} from './dom/create.js';
import addExtension from './dom/extension.js';
import replace from './dom/replace.js';
import Router, { Route, IndexRoute } from './router/Router.js';
import Link from './router/Link.js';
import Fetch from './xhr/Fetch.js';
import action, { Do } from './action/action.js';
import AsyncAction from './action/AsyncAction.js';
import reaction from './action/reaction.js';
import capitalize from './utils/capitalize.js';
import debounce from './utils/debounce.js';
import isFunction from './utils/isFunction.js';
import isObject from './utils/isObject.js';
import merge from './utils/merge.js';
import throttle from './utils/throttle.js';

export default Component;

export {
    Collection,
    create, createFragment, createText,
    addExtension,
    replace,
    Router, Route, IndexRoute,
    Link,
    Fetch,
    action, Do,
    AsyncAction,
    reaction,
    capitalize,
    debounce,
    isFunction,
    isObject,
    merge,
    throttle
};