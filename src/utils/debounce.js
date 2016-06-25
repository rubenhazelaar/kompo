// @flow
import Component from '../component/Component';
import RAF from './requestAnimationFrame';

/**
 * Debounces a function call
 *
 * @param {Function} fn - function to debounce
 * @param {Number} delay - timeout for debouncing
 * @param {Object} scope
 * @returns {Function}
 */
export default function debounce(c: Component, fn: Function, delay: number, scope: any): Function {
    let timer: ?number = null;
    return function() {
        const context: any = scope || this,
            args: Array<any> = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            const res = fn.apply(context, args);
            if(res) {
                const root = c.getRoot();
                if(root === null) {
                    RAF(c.update.bind(c));
                } else {
                    RAF(root.update.bind(root));
                }
            }
        }, delay);
    };
}