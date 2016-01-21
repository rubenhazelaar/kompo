'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = reaction;

var _isObject = require('./../utils/isObject.js');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Represents a cached reaction for
 * use with Component::react()
 *
 * @callback callback
 * @param {Function} callback
 * @param {*} [scope]
 * @returns {Function}
 */
function reaction(callback, scope) {
    var previous = undefined;
    return function (state, Component) {
        var context = scope || this,
            isObj = (0, _isObject2.default)(previous);
        if (isObj && previous.__kompo_stale__ === true) {
            previous = undefined;
        }
        // Callback MUST returns part of state which is cached
        previous = callback.call(context, state, previous, Component);

        if (isObj && previous.hasOwnProperty('__kompo_stale__')) {
            previous.__kompo_stale__ = false;
        }

        return previous;
    };
}