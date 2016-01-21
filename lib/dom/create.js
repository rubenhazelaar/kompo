'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = create;
exports.addAttributes = addAttributes;
exports.createFragment = createFragment;
exports.createText = createText;
var doc = document;

/**
 * Creates an Element, when no tagName
 * is given it create an empty div to serve
 * as root.
 *
 * @param {string|undefined} tagName
 * @returns {Element}
 */
function create(tagName, attributes) {
    var Element = undefined;
    if (typeof tagName === 'undefined') {
        Element = doc.createElement('div');
    } else {
        Element = doc.createElement(tagName);
    }

    if (typeof attributes !== 'undefined') {
        addAttributes(Element, attributes);
    }

    return Element;
}

/**
 * Adds attributes to an Element
 * through iterating through an object
 *
 * @param {Element} Element
 * @param {Object} obj
 * @returns {Element}
 */
function addAttributes(Element, obj) {
    var keys = Object.keys(obj);
    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i],
            value = obj[key];
        Element.setAttribute(key, value);
    }
    return Element;
}

/**
 * Syntactic sugar for creating a DocumentFragment
 *
 * @returns {DocumentFragment}
 */
function createFragment() {
    return doc.createDocumentFragment();
}

/**
 * Syntactic sugar for creating a TextNode
 *
 * @param {string} str
 * @returns {Text}
 */
function createText(str) {
    return doc.createTextNode(str);
}