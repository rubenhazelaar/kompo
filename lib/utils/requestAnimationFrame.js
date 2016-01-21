"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * RequestAnimationFrame polyfill
 *
 * @returns {*}
 */

exports.default = function requestAnimationFrame() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();