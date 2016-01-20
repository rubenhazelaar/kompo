import capitalize from '../utils/capitalize';
import Component from '../component/Component.js';
import replace from './replace.js';
import { addAttributes } from './create.js';
import isObject from '../utils/isObject.js';

/**
 * DOM extension can be prefixed with arbitrary string
 *
 * @param {string} prefix
 */
export default function extension(prefix) {
    // Prevent lookups
    const noPrefix = typeof prefix === 'undefined',
        doc = document,
        ElementPrototype = Element.prototype,
        FragPrototype = DocumentFragment.prototype;

    /**
     * Returns (prefixed) methodName
     *
     * @param methodName
     * @returns {string}
     */
    function addPrefix(methodName) {
        if(noPrefix) {
            return methodName;
        }

        return prefix + capitalize(methodName);
    }
    /**
     * Syntactic sugar for getting/setting a attribute.
     *
     * @param {string} name
     * @param {*} value
     * @returns {*|Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('attr'), { value: function (name, value) {
        if (arguments.length === 1) {
            return this.getAttribute(name);
        } else {
            this.setAttribute(name, value);
            return this;
        }
    }});

    /**
     * Syntactic sugar for checking if an attribute exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    Object.defineProperty(ElementPrototype, addPrefix('hasAttr'), { value: function (name) {
        return this.hasAttribute(name);
    }});

    /**
     * Syntactic sugar for removing an attribute.
     *
     * @param {string} name
     * @returns {Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('removeAttr'), { value: function (name) {
        this.removeAttribute(name);
        return this;
    }});

    /**
     * Syntactic sugar for getting or setting a TextNode.
     *
     * @param {string} txt
     * @returns {Element|Text}
     */
    Object.defineProperty(ElementPrototype, addPrefix('txt'), { value: function (txt) {
        if (arguments.length === 1) {
            this.appendChild(doc.createTextNode(txt));
            return this;
        } else {
            return this.textContent;
        }
    }});

    /**
     * Syntactic sugar for appending an Element.
     *
     * @param {*} child
     * @param {boolean} chain
     * @returns {Element}
     */
    const appendFnName = addPrefix('append'),
        appendFn = function (child, chain = true, ch = true) {
            if (typeof child === 'string') {
                child = doc.createElement(child);
            }

            if(child instanceof Component) {
                child = child.render();
            }

            this.appendChild(child);

            if (isObject(arguments[1])) {
                addAttributes(child, chain);
                return ch ? child: this;
            } else {
                return chain ? child: this;
            }

        };
    Object.defineProperty(ElementPrototype, appendFnName, { value: appendFn });
    Object.defineProperty(FragPrototype, appendFnName, { value: appendFn });

    /**
     * Syntactic sugar for appending an Element
     * on the parent of current Element.
     *
     * @param {*} child
     * @param {boolean} chain
     * @returns {Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('parentAppend'), { value: function (child, chain = true, ch = true) {
        return this.parentNode.append(child, chain, ch);
    }});

    /**
     * Syntactic sugar for appending an cloned Element
     * to its parent.
     *
     * BEWARE: It does not copy event listeners
     * BEWARE: deep option can have serious performance implications
     *
     * @param {boolean} deep = deep copy or not
     * @returns {Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('cloneAppend'), { value: function (deep = false ) {
        return this.parentNode.append(this.cloneNode(deep));
    }});

    /**
     * Syntactic sugar for cloning an Element
     *
     * BEWARE: It does not copy event listeners
     * BEWARE: deep option can have serious performance implications
     *
     * @param {boolean} deep = deep copy or not
     * @returns {Element}
     */
    const cloneFnName = addPrefix('clone'),
        cloneFn = function (deep = false ) {
            return this.cloneNode(deep);
        };
    Object.defineProperty(ElementPrototype, cloneFnName, { value: cloneFn });
    Object.defineProperty(FragPrototype, cloneFnName, { value: cloneFn });

    /**
     * Syntactic sugar for prepending an Element.
     *
     * @param {*} child
     * @param {boolean} chain
     * @returns {Element}
     */
    const prependFnName = addPrefix('prepend'),
        prependFn = function (child, chain = true, ch = true) {
            let firstChild = this.firstChild;

            if (typeof child === 'string') {
                child = doc.createElement(child);
            }

            if(child instanceof Component) {
                child = child.render()
            }

            if(firstChild) {
                this.insertBefore(child, firstChild);
            } else  {
                this.append(child)
            }

            if (isObject(arguments[1])) {
                addAttributes(child, chain);
                return ch ? child: this;
            } else {
                return chain ? child: this;
            }

        };
    Object.defineProperty(ElementPrototype, prependFnName, { value: prependFn });
    Object.defineProperty(FragPrototype, prependFnName, { value: prependFn });

    /**
     * Syntactic sugar for getting the parent Element.
     *
     * @returns {Element|Node}
     */
    Object.defineProperty(ElementPrototype, addPrefix('parent'), { value: function () {
        return this.parentElement || this.parentNode;
    }});

    /**
     * Syntactic sugar for checking if the Element
     * has a parent.
     *
     * @returns {boolean}
     */
    Object.defineProperty(ElementPrototype, addPrefix('hasParent'), { value: function () {
        return !(this.parentElement === null && this.parentNode === null);
    }});

    /**
     * Recurse to the root Element (which has no parent)
     *
     * @returns {Element|Node}
     */
    Object.defineProperty(ElementPrototype, addPrefix('root'), { value: function (parent) {
        parent = !parent?
        this.parentElement || this.parentNode:
            parent;

        while ((parent.parentElement || parent.parentNode) !== null) {
            parent = this.root(parent.parentElement || parent.parentNode);
        }

        return parent;
    }});

    /**
     * Syntactic sugar for document.querySelector()
     *
     * @param {string} selector
     * @returns {Element}
     */
    const queryFnName = addPrefix('query'),
        queryFn = function (selector) {
            return this.querySelector(selector);
        };
    Object.defineProperty(ElementPrototype, queryFnName, { value: queryFn });
    Object.defineProperty(FragPrototype, queryFnName, { value: queryFn });

    /**
     * Syntactic sugar for document.querySelectorAll()
     *
     * @param {string} selector
     * @returns {HTMLCollection}
     */
    const queryAllFnName = addPrefix('queryAll'),
        queryAllFn = function (selector) {
            return this.querySelectorAll(selector);
        };
    Object.defineProperty(ElementPrototype, queryAllFnName, { value:queryAllFn });
    Object.defineProperty(FragPrototype, queryAllFnName, { value:queryAllFn });

    /**
     * Syntactic sugar/polyfill for Element.remove()
     *
     * @returns {Element}
     */
    if (!('remove' in ElementPrototype)) {
        Object.defineProperty(ElementPrototype, addPrefix('remove'), {
            value: function () {
                let parent = this.parentNode;
                if (parent) {
                    parent.removeChild(this);
                }
            }
        });
    }

    /**
     * Syntactic sugar for removing all child Elements\Nodes
     *
     * @returns {Element}
     */
    const emptyFnName = addPrefix('empty'),
        emptyFn = function () {
            while (this.lastChild) {
                this.removeChild(this.lastChild);
            }
            return this;
        };
    Object.defineProperty(ElementPrototype, emptyFnName, { value: emptyFn});
    Object.defineProperty(FragPrototype, emptyFnName, { value: emptyFn});

    /**
     * Syntactic sugar for logging
     *
     * When chain methods it can be used to log an Element
     * right in the middle of the chain.
     *
     * @returns {Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('log'), { value: function () {
        console.log(this);
        return this;
    }});

    /**
     * @see ./replace.js
     */
    Object.defineProperty(ElementPrototype, addPrefix('replace'), { value: function (child, replaceLastChild = false) {
        return replace(this, child, replaceLastChild);
    }});

    /**
     * Syntactic sugar for replacing the
     * current Element with a new one.
     *
     * BEWARE: a parent Element must exist
     *
     * @returns {Element} - return the new Element
     */
    Object.defineProperty(ElementPrototype, addPrefix('replaceWith'), { value: function (newElement, attributes) {
        if (typeof newElement === 'string') {
            newElement = doc.createElement(newElement);
        }

        if(typeof attributes !== 'undefined') {
            addAttributes(newElement, attributes);
        }

        this.parentNode.replaceChild(this, newElement);
        return newElement;
    }});

    /**
     * Syntactic sugar for inserting an Element
     * before another Element
     *
     * BEWARE: a parenNode needs to be available
     *
     * @returns {Element} - the new Element
     */
    Object.defineProperty(ElementPrototype, addPrefix('before'), { value: function (newSibling, attributes) {
        let parentNode = this.parentNode;

        if (typeof newSibling === 'string') {
            newSibling = doc.createElement(newSibling);
        }

        if(newSibling instanceof Component) {
            newSibling = newSibling.render()
        }

        if(typeof attributes !== 'undefined') {
            addAttributes(newSibling, attributes);
        }

        if (parentNode) {
            parentNode.insertBefore(newSibling, this);
        }
        return newSibling;
    }});

    /**
     * Syntactic sugar for inserting an Element
     * after another Element
     *
     * BEWARE: a parenNode needs to be available
     *
     * @returns {Element} - the new Element
     */
    Object.defineProperty(ElementPrototype, addPrefix('after'), { value: function (newSibling, attributes) {
        let parentNode = this.parentNode,
            nextSibling = this.nextSibling;

        if (typeof newSibling === 'string') {
            newSibling = doc.createElement(newSibling);
        }

        if(newSibling instanceof Component) {
            newSibling = newSibling.render()
        }

        if(typeof attributes !== 'undefined') {
            addAttributes(newSibling, attributes);
        }

        if (parentNode) {
            if (nextSibling) {
                parentNode.insertBefore(newSibling, nextSibling);
            } else {
                parentNode.appendChild(newSibling);
            }
        }

        return newSibling;
    }});

    /**
     * Syntactic sugar for getting/setting the id
     * of an Element
     *
     * @param {*} id
     * @returns {string|Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('i'), { value: function (id) {
        if (arguments.length === 0) {
            return this.id;
        } else {
            this.id = id;
            return this;
        }
    }});

    /**
     * Syntactic sugar for getting/setting the name
     * of an Element
     *
     * @param {*} name
     * @returns {string|Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('n'), { value: function (name) {
        if (arguments.length === 0) {
            return this.name;
        } else {
            this.name = name;
            return this;
        }
    }});

    /**
     * Syntactic sugar for getting/setting the href
     * of an Element
     *
     * @param {*} href
     * @returns {string|Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('h'), { value: function (href) {
        if (arguments.length === 0) {
            return this.href;
        } else {
            this.href = href;
            return this;
        }
    }});

    /**
     * Syntactic sugar for getting/setting the value
     * of an Element
     *
     * @param {*} value
     * @returns {string|Element}
     */
    Object.defineProperty(ElementPrototype, addPrefix('v'), { value: function (value) {
        if (arguments.length === 0) {
            return this.value;
        } else {
            this.value = value;
            return this;
        }
    }});
}