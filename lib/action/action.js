'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = action;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents an action on a part
 * of the state tree.
 *
 * use with Component::on()
 *
 * IMPORTANT: Callback must return a Do
 * class of which the first param is a boolean
 * which indicates if something in a part of the
 * state tree has changed or not
 *
 * @callback cb
 * @param {Function} cb
 * @param {*} [scope]
 * @returns {Function}
 */
function action(cb, scope) {
    return function (e, state) {
        var context = scope || this,
            d = cb.call(context, e, state);
        if (!d instanceof Do) throw new Error('Action callback should return a Do class.');
        Object.defineProperty(d.part, '__kompo_stale__', { writable: true, value: d.it });
        return d.it;
    };
}

/**
 * Represents a flag that indicates
 * if a part of the state tree has been changed
 * or not and saves that part of the state tree.
 */

var Do =
/**
 * Creates Do
 *
 * @param (boolean) d - If state (part) has changed
 * @param {*} part - Part of state which is involved in the action
 */
exports.Do = function Do(d, part) {
    _classCallCheck(this, Do);

    this.it = d;
    this.part = part;
};