import Component from '../component/Component';
import RAF from './requestAnimationFrame';

/**
 * Throttle function
 *
 * @param {Function} fn - function to throttle
 * @param {Number} threshold - timeout for throttling
 * @param {Object} scope
 * @returns {Function}
 */
export default function throttle(c: Component, fn: Function, threshold: number, scope: any) {
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
                    const root = c.getRoot();
                    if(root === null) {
                        RAF(c.update.bind(c));
                    } else {
                        RAF(root.update.bind(root));
                    }
                }
            }, threshold);
        } else {
            last = now;
            return fn.apply(context, args);
        }
    };
}