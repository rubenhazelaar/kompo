"use strict";

module.exports = function () {
    if (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1) {
        // Native Promise implementation is available
        return Promise;
    } else {
        return require('promise');
    }
}();