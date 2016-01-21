"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = merge;
/**
 * Merges given objects
 *
 * @param {...Object} objs - Any given amount of objects
 * @returns {Object}
 */
function merge() {
    var object = Array.prototype.shift.call(arguments);
    for (var i = 0; i < arguments.length; i++) {
        var obj = arguments[i];
        for (var j in obj) {
            object[j] = obj[j];
        }
    }

    return object;
}