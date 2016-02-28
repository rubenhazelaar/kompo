// @flow
import Fetch from './../xhr/Fetch.js';
//import isFunction from './../utils/isFunction.js';
import RAF from './../utils/requestAnimationFrame.js';
import { Do } from './action.js';

/**
 * Represents an asynchronous XHR request
 * and provides some help handling the request
 */
export default class AsyncAction extends Fetch {
    state: state;
    Component: Component;

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
     * @param {boolean} ignore
     * @returns {Function}
     */
    when(callback: Function, data: any, ignore: boolean = false): Function {
        return (e: Event, state: state, Component: Component) => {
            if(ignore) {
                Component.ignoredStatefull = callback;
            }
            this.state = state;
            this.Component = Component;
            let result: Do | boolean = callback(e, this, state, Component);
            result = this.flagObject(result);

            if(result) {
                this.send(data);
            }

            return result;
        };
    }

    /**
     * Sets state separately when
     * AsyncAction::when() is not used
     *
     * @param {*} state
     * @returns {AsyncAction}
     */
    setState(state: state): Component {
        this.state = state;
        return this;
    }

    /**
     * Sets Component separately when
     * AsyncAction::when() is not used
     *
     * @param {Component} Component
     * @returns {AsyncAction}
     */
    setComponent(Component: Component): Component {
        this.Component = Component;
        return this;
    }

    /**
     * Sets flag in order for
     * reaction() function to determine
     * a part of the state tree is stale
     *
     * @param {(boolean|Do)} result
     * @returns {boolean}
     */
    flagObject(result: Do | boolean): Do | boolean {
        if(result instanceof Do) {
            Object.defineProperty(result.part, '__kompo_stale__' , { writable: true,  value: result.it });
            return result.it;
        }

        return result;
    }

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
     * @param {(null|Function)} ignoredStatefull
     * @returns {Function}
     */
    do(callback: Function, ignoredStatefull: ?statefull = null): Function {
        if(ignoredStatefull) {
            this.Component.ignoredStatefull = ignoredStatefull;
        }
        return (self) => {
            let result: Do | any = callback(self, this.state, this.Component);
            result = this.flagObject(result);
            if(result) {
                const root: Component = this.Component.getRoot();
                if(root === null) {
                    RAF(this.Component.update.bind(this.Component));
                } else {
                    RAF(root.update.bind(root));
                }
            }
        };
    }


}

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