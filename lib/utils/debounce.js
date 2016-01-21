"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = debounce;
/**
 * Debounces a function call
 *
 * @param {Function} fn - function to debounce
 * @param {Number} delay - timeout for debouncing
 * @param {Object} scope
 * @returns {Function}
 */
function debounce(fn, delay, scope) {
    var timer = null;
    return function () {
        var context = scope || this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            return fn.apply(context, args);
        }, delay);
    };
}