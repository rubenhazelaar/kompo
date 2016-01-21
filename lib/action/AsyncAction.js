'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Fetch2 = require('./../xhr/Fetch.js');

var _Fetch3 = _interopRequireDefault(_Fetch2);

var _isFunction = require('./../utils/isFunction.js');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _requestAnimationFrame = require('./../utils/requestAnimationFrame.js');

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

var _action = require('./action.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents an asynchronous XHR request
 * and provides some help handling the request
 */

var AsyncAction = function (_Fetch) {
    _inherits(AsyncAction, _Fetch);

    function AsyncAction() {
        _classCallCheck(this, AsyncAction);

        return _possibleConstructorReturn(this, _Fetch.apply(this, arguments));
    }

    /**
     * Creates the action callback and
     * injects the state and Component.
     * This way it is possible to use these in
     * the promise that is returned together
     * with AsyncAction::do()
     *
     * Use with Component::on()
     *
     * @param {Function} callback
     * @param {*} data
     * @returns {Function}
     */

    AsyncAction.prototype.when = function when(callback, data) {
        var _this2 = this;

        return function (e, state, Component) {
            _this2.state = state;
            _this2.Component = Component;
            var result = callback(e, _this2, state, Component);
            result = _this2.flagObject(result);

            if (result) {
                _this2.send(data);
            }

            return result;
        };
    };

    /**
     * Sets state separately when
     * AsyncAction::when() is not used
     *
     * @param {*} state
     * @returns {AsyncAction}
     */

    AsyncAction.prototype.setState = function setState(state) {
        this.state = state;
        return this;
    };

    /**
     * Sets Component separately when
     * AsyncAction::when() is not used
     *
     * @param {Component} Component
     * @returns {AsyncAction}
     */

    AsyncAction.prototype.setComponent = function setComponent(Component) {
        this.Component = Component;
        return this;
    };

    /**
     * Sets flag in order for
     * reaction() function to determine
     * a part of the state tree is stale
     *
     * @param {(boolean|Do)} result
     * @returns {boolean}
     */

    AsyncAction.prototype.flagObject = function flagObject(result) {
        if (result instanceof _action.Do) {
            Object.defineProperty(result.part, '__kompo_stale__', { writable: true, value: result.it });
            return result.it;
        }

        return result;
    };

    /**
     * POSSIBLE, BUT TO KEEP A CONSISTENT API
     * NOT IMPLEMENTED
     */
    //send(data) {
    //    this.open();
    //    if(isFunction(this.options.beforeSend)){
    //        this.options.beforeSend(this, this.state, this.Component);
    //        console.log(123);
    //    }
    //    this.native.send(data);
    //    return this;
    //}

    /**
     * NOT YET SUPPORTED
     *
     * @param callback
     * @returns {Function}
     */
    //promise() {
    //    return new ActionPromise(this.promiseFunction);
    //}

    /**
     * To be used together with Promise
     * functions, inject the state and Component
     *
     * And if changes are done it update the
     * Component tree from root
     *
     * @param {Function} callback
     * @returns {Function}
     */

    AsyncAction.prototype.do = function _do(callback) {
        var _this3 = this;

        return function (self) {
            var result = callback(self, _this3.state, _this3.Component);
            result = _this3.flagObject(result);
            if (result) {
                var root = _this3.Component.getRoot();
                if (root === null) {
                    (0, _requestAnimationFrame2.default)(_this3.Component.update.bind(_this3.Component));
                } else {
                    (0, _requestAnimationFrame2.default)(root.update.bind(root));
                }
            }
        };
    };

    return AsyncAction;
}(_Fetch3.default);

/**
 * NOT YET SUPPORTED
 */
//export class ActionPromise extends Promise {
//    then(callback) {
//        super.then(callback);
//        this.Component.update();
//        return this;
//    }
//
//    catch(callback) {
//        super.catch(callback);
//        this.Component.update();
//        return this;
//    }
//}

exports.default = AsyncAction;