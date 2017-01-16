webpackJsonpkompo([6],{

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _component = __webpack_require__(0);

var _component2 = _interopRequireDefault(_component);

var _router = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _component2.default)('div', function (_ref) {
    var _this = this;

    var heading = _ref.heading;

    this.setAttribute('data-type', 'Branch');

    // Create Elements
    var h2 = document.createElement('h2');
    h2.textContent = heading;

    // Append children
    this.appendChild(h2);

    var r = (0, _component.getRouter)(this);
    (0, _component.react)(this, function () {
        (0, _router.swap)(_this, r);
    });
}, {
    heading: 'Branch construct'
});

/***/ }

});
//# sourceMappingURL=6.js.map