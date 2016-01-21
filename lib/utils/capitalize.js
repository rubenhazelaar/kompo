"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = capitalize;
/**
 * Capitalizes string
 *
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
    if (typeof str === "string") {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}