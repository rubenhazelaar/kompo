/**
 * Merges given objects
 *
 * @param {...Object} objs - Any given amount of objects
 * @returns {Object}
 */
export default function merge(){
    var object = Array.prototype.shift.call(arguments);
    for (let i = 0; i < arguments.length; i++) {
        let obj = arguments[i];
        for (let j in obj) {
            object[j] = obj[j];
        }
    }

    return object;
}