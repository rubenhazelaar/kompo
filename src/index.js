import Component from './component/Component.js';
import Collection from './component/Collection.js';
import create, { createFragment, createText} from './dom/create.js';
import addExtension from './dom/extension.js';
import replace from './dom/replace.js';
import Router, { Route, IndexRoute } from './router/Router.js';
import Link from './router/Link.js';
import debounce from './utils/debounce.js';
import throttle from './utils/throttle.js';
import Fetch from './xhr/Fetch.js';
import action, { Do } from './action/action.js';
import AsyncAction from './action/AsyncAction.js';
import reaction from './action/reaction.js';

export default Component;

export {
    Collection,
    create, createFragment, createText,
    addExtension,
    Router, Route, IndexRoute,
    Link,
    debounce,
    throttle,
    Fetch,
    action, Do,
    AsyncAction,
    reaction
};