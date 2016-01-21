"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = throttle;
/**
 * Throttle function
 *
 * @param {Function} fn - function to throttle
 * @param {Number} threshold - timeout for throttling
 * @param {Object} scope
 * @returns {Function}
 */
function throttle(fn, threshold, scope) {
    threshold || (threshold = 250);
    var last = undefined,
        deferTimer = undefined;
    return function () {
        var context = scope || this,
            now = +new Date(),
            args = arguments;
        if (last && now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                return fn.apply(context, args);
            }, threshold);
        } else {
            last = now;
            return fn.apply(context, args);
        }
    };
}