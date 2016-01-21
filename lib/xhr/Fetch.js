'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _merge = require('../utils/merge.js');

var _merge2 = _interopRequireDefault(_merge);

var _isFunction = require('../utils/isFunction.js');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Simple wrapper for native
 * XMLHttpRequest
 *
 * BEWARE: Does not do any url checking,
 * this should be implemented by the user
 */

var Fetch = function () {
    /**
     * Creates the Fetch instance
     *
     * @param url
     * @param options
     */

    function Fetch(url) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Fetch);

        this.url = url;
        this.options = (0, _merge2.default)({
            method: 'GET',
            async: true,
            user: '',
            password: '',
            beforeSend: null
        }, options);
        this.native = new XMLHttpRequest();
        // Create default promise function
        this.createPromiseFunction();
    }

    /**
     * Creates the promise function which
     * is return by Fetch::promise(), can
     * be overwritten by a subclass or can be
     * set with Fetch::setPromiseFunction()
     */

    Fetch.prototype.createPromiseFunction = function createPromiseFunction() {
        var _this = this;

        this.promiseFunction = function (resolve, reject) {
            _this.native.onreadystatechange = function () {
                if (_this.native.readyState != 4) return;

                if (_this.native.status == 200) {
                    resolve(_this);
                } else {
                    reject(_this);
                }
            };
        };
    };

    /**
     * Sets the function which is used
     * when a promise is created through
     * Fetch::promise()
     *
     * @param {Function} fn
     * @throws {Error}
     * @returns {Fetch}
     */

    Fetch.prototype.setPromiseFunction = function setPromiseFunction(fn) {
        if (!(0, _isFunction2.default)(fn)) {
            throw new Error('Promise function must be a function.');
        }
        this.promiseFunction = fn.bind(this);
        return this;
    };

    /**
     * Creates a new promise with
     * given promise function.
     *
     * @returns {Promise}
     */

    Fetch.prototype.promise = function promise() {
        return new Promise(this.promiseFunction);
    };

    /**
     * Sets a header for the request
     *
     * @param {String} header
     * @param {String} value
     * @returns {Fetch}
     */

    Fetch.prototype.setHeader = function setHeader(header, value) {
        this.native.setRequestHeader(header, value);
        return this;
    };

    /**
     * Sets callback that is fired
     * before the request is sent.
     *
     * @param {Function} callback
     * @returns {Fetch}
     */

    Fetch.prototype.before = function before(callback) {
        if (!(0, _isFunction2.default)(callback)) {
            throw new Error('Callback must be a function.');
        }

        this.options.beforeSend = callback;
        return this;
    };

    /**
     * Opens the connection for the request
     *
     * ONLY FOR INTERNAL USE
     */

    Fetch.prototype.open = function open() {
        this.native.open(this.options.method, this.url, this.options.async, this.options.user, this.options.password);
    };

    /**
     * Sends the request, also triggers
     * the before callback
     *
     * @param {*} data
     * @returns {Fetch}
     */

    Fetch.prototype.send = function send(data) {
        this.open();
        if ((0, _isFunction2.default)(this.options.beforeSend)) {
            this.options.beforeSend(this);
        }
        this.native.send(data);
        return this;
    };

    /**
     * Stops the request
     *
     * @returns {Fetch}
     */

    Fetch.prototype.abort = function abort() {
        this.native.abort();
        return this;
    };

    /**
     * Gets the response text from
     * the request
     *
     * @returns {string}
     */

    Fetch.prototype.response = function response() {
        return this.native.responseText;
    };

    /**
     * Gets the response text and
     * parses it to JSON
     *
     * Will fail when invalid string is provided
     */

    Fetch.prototype.jsonResponse = function jsonResponse() {
        return JSON.parse(this.native.responseText);
    };

    return Fetch;
}();

exports.default = Fetch;