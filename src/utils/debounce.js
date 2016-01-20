/**
 * Debounces a function call
 *
 * @param {Function} fn - function to debounce
 * @param {Number} delay - timeout for debouncing
 * @param {Object} scope
 * @returns {Function}
 */
export default function debounce(fn, delay, scope) {
    let timer = null;
    return function() {
        const context = scope || this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            return fn.apply(context, args);
        }, delay);
    };
}