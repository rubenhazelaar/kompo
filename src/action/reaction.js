import isObject from './../utils/isObject.js';

/**
 * Represents a cached reaction for
 * use with Component::react()
 *
 * @callback callback
 * @param {Function} callback
 * @param {*} [scope]
 * @returns {Function}
 */
export default function reaction(callback, scope) {
    let previous;
    return function(state, Component) {
        const context = scope || this,
            isObj = isObject(previous);
        if(
            isObj
            && previous.__kompo_stale__ === true) {
            previous = undefined;
        }
        // Callback MUST returns part of state which is cached
        previous = callback.call(context, state, previous, Component);

        if(
            isObj
            && previous.hasOwnProperty('__kompo_stale__')
        ) {
            previous.__kompo_stale__ = false;
        }

        return previous;
    };
}