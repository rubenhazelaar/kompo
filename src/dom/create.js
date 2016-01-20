const doc = document;

/**
 * Creates an Element, when no tagName
 * is given it create an empty div to serve
 * as root.
 *
 * @param {string|undefined} tagName
 * @returns {Element}
 */
export default function create(tagName, attributes) {
    let Element;
    if(typeof tagName === 'undefined') {
        Element = doc.createElement('div');
    } else {
        Element = doc.createElement(tagName);
    }

    if(typeof attributes !== 'undefined') {
        addAttributes(Element, attributes);
    }

    return Element
}

/**
 * Adds attributes to an Element
 * through iterating through an object
 *
 * @param {Element} Element
 * @param {Object} obj
 * @returns {Element}
 */
export function addAttributes(Element, obj) {
    const keys = Object.keys(obj);
    for(let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i],
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
export function createFragment() {
    return doc.createDocumentFragment();
}

/**
 * Syntactic sugar for creating a TextNode
 *
 * @param {string} str
 * @returns {Text}
 */
export function createText(str) {
    return doc.createTextNode(str);
}
