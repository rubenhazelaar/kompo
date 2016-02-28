/**
 * Merges given objects
 *
 * @param {...Object} objs - Any given amount of objects
 * @returns {Object}
 */
export default function merge(): { [key: any]: any } {
    var object: { [key: any]: any } = Array.prototype.shift.call(arguments);
    for (let i = 0; i < arguments.length; i++) {
        let obj: { [key: any]: any } = arguments[i];
        for (let j in obj) {
            object[j] = obj[j];
        }
    }

    return object;
}