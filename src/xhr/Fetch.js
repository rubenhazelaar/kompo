// @flow
import merge from '../utils/merge.js';
import isFunction from '../utils/isFunction.js';
import Promise from '../utils/promise.js';

/**
 * Simple wrapper for native
 * XMLHttpRequest
 *
 * BEWARE: Does not do any url checking,
 * this should be implemented by the user
 */
export default class Fetch {
    url: string;
    options: options;
    native: XMLHttpRequest;
    promiseFunction: Function;
    headers: { [key: string]: string };


    /**
     * Creates the Fetch instance
     *
     * @param url
     * @param options
     */
    constructor(url: string, options: options = {}): void {
        this.url = url;
        this.options = merge({
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
    createPromiseFunction(): void {
        this.promiseFunction = (resolve: Function, reject: Function) => {
            this.native.onreadystatechange = () => {
                if(this.native.readyState != 4) return;

                if(this.native.status == 200) {
                    resolve(this);
                } else {
                    reject(this);
                }
            };
        };
    }

    /**
     * Sets the function which is used
     * when a promise is created through
     * Fetch::promise()
     *
     * @param {Function} fn
     * @throws {Error}
     * @returns {Fetch}
     */
    setPromiseFunction(fn: Function): Fetch {
        if(!isFunction(fn)){
            throw new Error('Promise function must be a function.');
        }
        this.promiseFunction = fn.bind(this);
        return this;
    }

    /**
     * Creates a new promise with
     * given promise function.
     *
     * @returns {Promise}
     */
    promise(): Promise {
        return new Promise(this.promiseFunction);
    }

    /**
     * Sets a header for the request
     *
     * @param {string} header
     * @param {string} value
     * @returns {Fetch}
     */
    setHeader(header: string, value: string): Fetch {
        this.headers[header] = value;
        return this;
    }

    /**
     * Sets callback that is fired
     * before the request is sent.
     *
     * @param {Function} callback
     * @returns {Fetch}
     */
    before(callback: Function): Fetch {
        if(!isFunction(callback)){
            throw new Error('Callback must be a function.');
        }

        this.options.beforeSend = callback;
        return this;
    }

    /**
     * Opens the connection for the request
     *
     * ONLY FOR INTERNAL USE
     */
    open(): void {
        this.native.open(
            this.options.method,
            this.url,
            this.options.async,
            this.options.user,
            this.options.password
        );
    }

    /**
     * Sends the request, also triggers
     * the before callback
     *
     * @param {*} data
     * @returns {Fetch}
     */
    send(data: any): Fetch {
        if(this.options.withCredentials === true) {
            this.native.withCredentials = true;
        }

        this.open();

        if(typeof this.options.responseType !== 'undefined') {
            this.native.responseType = this.options.responseType;
        }

        const keys = Object.keys(this.headers);
        for(let i = 0, l = keys.length; i < l; ++i) {
            const k = keys[i];
            this.native.setRequestHeader(k, this.headers[k]);
        }

        if(isFunction(this.options.beforeSend)){
            this.options.beforeSend(this);
        }
        this.native.send(data);
        return this;
    }

    /**
     * Stops the request
     *
     * @returns {Fetch}
     */
    abort(): Fetch {
        this.native.abort();
        return this;
    }

    /**
     * Gets the response text from
     * the request
     *
     * @returns {string}
     */
    response(): string {
        return this.native.responseText;
    }

    /**
     * Gets the response text and
     * parses it to JSON
     *
     * Will fail when invalid string is provided
     */
    jsonResponse(): any {
        return JSON.parse(this.native.responseText);
    }

    /**
     * Adds eventlistener to native XHR
     *
     * Can be used for progress event for example
     *
     * @param name {string}
     * @param callback {Function}
     */
    on(name: string, callback: Function): void {
        this.native.addEventListener(name, callback);
    }
}
