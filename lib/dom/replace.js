'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = replace;

var _create = require('./create.js');

var _create2 = _interopRequireDefault(_create);

var _Component = require('../component/Component.js');

var _Component2 = _interopRequireDefault(_Component);

var _isObject = require('../utils/isObject.js');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Replaces an Node for another one
 *
 * @param {Node} parent - parent element to replace child on
 * @param {*} child - new child to replace for old child
 * @param {boolean} replaceLastChild - replace first or last child
 * @returns {Node} child - child element
 */
function replace(parent, child) {
    var replaceLastChild = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var rLC = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    var arg2isObject = (0, _isObject2.default)(arguments[2]);
    var replacedChild = undefined;
    if (arg2isObject) {
        replacedChild = rLC ? parent.lastChild : parent.firstChild;
    } else {
        replacedChild = replaceLastChild ? parent.lastChild : parent.firstChild;
    }

    if (typeof child === 'string') {
        child = (0, _create2.default)(child);
    }

    if (child instanceof _Component2.default) {
        child = child.render();
    }

    if (arg2isObject) {
        (0, _create.addAttributes)(child, replaceLastChild);
    }

    if (replacedChild) {
        parent.replaceChild(child, replacedChild);
    } else {
        parent.appendChild(child);
    }

    return child;
}