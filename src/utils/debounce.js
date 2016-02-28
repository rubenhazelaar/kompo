// @flow
/**
 * Debounces a function call
 *
 * @param {Function} fn - function to debounce
 * @param {Number} delay - timeout for debouncing
 * @param {Object} scope
 * @returns {Function}
 */
export default function debounce(fn: Function, delay: number, scope: any): Function {
    let timer: ?number = null;
    return function() {
        const context: any = scope || this,
            args: Array<any> = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            return fn.apply(context, args);
        }, delay);
    };
}