import c from './create.js';
import Component from '../component/Component.js';
import isObject from '../utils/isObject.js';
import { addAttributes } from './create.js'

/**
 *  Replaces an Node for another one
 *
 * @param {Node} parent - parent element to replace child on
 * @param {*} child - new child to replace for old child
 * @param {boolean} replaceLastChild - replace first or last child
 * @returns {Node} child - child element
 */
export default function replace(parent, child, replaceLastChild = false, rLC = false) {
    const arg2isObject = isObject(arguments[2]);
    let replacedChild;
    if (arg2isObject) {
         replacedChild = rLC?
            parent.lastChild:
            parent.firstChild;
    } else {
        replacedChild = replaceLastChild?
            parent.lastChild:
            parent.firstChild;
    }

    if (typeof child === 'string') {
        child = c(child);
    }

    if(child instanceof Component) {
        child = child.render()
    }

    if(arg2isObject) {
        addAttributes(child, replaceLastChild);
    }

    if(replacedChild) {
        parent.replaceChild(child, replacedChild);
    } else  {
        parent.appendChild(child)
    }

    return child;
}