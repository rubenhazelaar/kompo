// @flow
import RAF from '../utils/requestAnimationFrame';

/**
 * Simple helper function to initialize a Kompo app
 * 
 * @param {Element} parent
 * @param {Component} C
 */
export default function init(parent: Element, C: Component) {
    parent.appendChild(C.render());
    RAF(C.after.bind(C));
}