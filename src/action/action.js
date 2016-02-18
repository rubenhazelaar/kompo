import Component from '../component/Component.js';

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
 * @param {(undefined|Function)} ignoredStatefull
 * @param {(undefined|*)} [scope]
 * @returns {Function}
 */
export default function action(cb, ignoredStatefull, scope) {
    return function(...args) {
        const context = scope || this,
            d = cb.call(context, ...args);

        if(ignoredStatefull) {
            if(context instanceof Component) {
                context.ignoredStatefull = ignoredStatefull;
            } else {
                throw new Error('Scope or context should be a Component to ignore the statefull callback.');
            }
        }

        if(!d instanceof Do) throw new Error('Action callback should return a Do class.');
        Object.defineProperty(d.part, '__kompo_stale__' , { writable: true,  value: d.it });
        return d.it;
    };
}

/**
 * Represents a flag that indicates
 * if a part of the state tree has been changed
 * or not and saves that part of the state tree.
 */
export class Do {
    /**
     * Creates Do
     *
     * @param {boolean} d - If state (part) has changed
     * @param {*} part - Part of state which is involved in the action
     */
    constructor(d, part) {
        this.it = d;
        this.part = part;
    }
}