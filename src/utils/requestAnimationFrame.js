/**
 * RequestAnimationFrame polyfill
 *
 * @returns {*}
 */
export default (function requestAnimationFrame(){
    return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
}());