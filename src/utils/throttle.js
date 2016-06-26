// @flow
import Component from '../component/Component';
import rerender from '../component/rerender';

/**
 * Throttle function
 *
 * @param {Component} C
 * @param {Function} fn - function to throttle
 * @param {Number} threshold - timeout for throttling
 * @param {Object} scope
 * @returns {Function}
 */
export default function throttle(C: Component, fn: Function, threshold: number, scope: any) {
    threshold || (threshold = 250);
    let last,
        deferTimer;
    return function () {
        const context = scope || this,
            now = +new Date,
            args = arguments;
        if (last && now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                const res = fn.apply(context, args);
                if(res) {
                    rerender(C);
                }
            }, threshold);
        } else {
            last = now;
            return fn.apply(context, args);
        }
    };
}