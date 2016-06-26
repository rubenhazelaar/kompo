// @flow
import Component from '../component/Component';
import rerender from '../component/rerender';

/**
 * Debounces a function call
 *
 * @param {Component} C 
 * @param {Function} fn - function to debounce
 * @param {Number} delay - timeout for debouncing
 * @param {Object} scope
 * @returns {Function}
 */
export default function debounce(C: Component, fn: Function, delay: number, scope: any): Function {
    let timer: ?number = null;
    return function() {
        const context: any = scope || this,
            args: Array<any> = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            const res = fn.apply(context, args);
            if(res) {
                rerender(C);
            }
        }, delay);
    };
}