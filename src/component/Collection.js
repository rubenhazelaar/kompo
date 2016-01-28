import Component from './Component.js';
import { createFragment } from '../dom/create.js';
import merge from '../utils/merge.js';
import isObject from '../utils/isObject.js';

/**
 * Represents a Collection which
 * can be used to effectively render
 * and rerender a collection of Components
 */
export default class Collection extends Component {
    /**
     * Create a collections instance and creates
     * the collection
     *
     * @param {Node} root - to append collection to
     * @param {*} state - state (part) to render collection for
     * @param {Function} componentConstructor - class constructor for creating the collection items
     * @param {Object} options
     */
    constructor(root, state, componentConstructor, options) {
        super();
        this.root = root;
        this.state = state;
        this.stateless = false;
        this.componentConstructor = componentConstructor;
        this.options = merge({
            fragmentLimit: 1,
            props: undefined
        }, options);
        this.create();
    }

    /**
     * @inheritdoc;
     *
     * Creates the collection, and is also used to check
     * integrity on update
     *
     * @returns {Node}
     */
    create() {
        if(Array.isArray(this.state)) {
            this.append(this.state);
        } else if(isObject(this.state)) {
            this.append(Object.keys(this.state), this.state);
        } else {
            throw new Error('Cannot iterate over given state. Please check constructor input and provide an array or object.')
        }

        return this.root;
    }

    /**
     * Appends new items to the Collection,
     * if there are any
     *
     * @param {Array} arr - array to iterate or keys from object
     * @param {Object} obj - object to iterate
     */
    append(arr, obj) {
        const arrLength = arr.length,
            mountsLength = this.mounts.length;

        // Mount when collection grows
        if(arrLength > mountsLength) {
            let parent, useFragment;
            if (arrLength - mountsLength > this.options.fragmentLimit) {
                parent = createFragment();
                useFragment = true;
            } else {
                parent = this.root;
                useFragment = false;
            }

            for(let i = mountsLength; i < arrLength; i++) {
                const index = obj? arr[i]: i,
                    value = obj? obj[index]: arr[i];

                parent.appendChild(
                    this.mount(
                        new this.componentConstructor(this.options.props)
                            .setState(merge(value,{index}))
                    ).render()
                );
            }

            if(useFragment) {
                this.root.appendChild(parent);
            }
        }
    }

    /**
     * @inheritdoc
     *
     * Deletes components, then updates them and
     * appends more if needed.
     */
    update() {
        if(this.state.hasOwnProperty('__kompo_collection_remove__')) {
            const index = this.state.__kompo_collection_remove__;

            if(Array.isArray(index)) {
                for(let i = 0, l = index.length; i < l; i++) {
                    const Component = this.unmountByIndex(index);
                    Component.root.parentNode.removeChild(Component.root);
                    this.state.splice(index, 1);
                }
            } else {
                const Component = this.unmountByIndex(index);
                Component.root.parentNode.removeChild(Component.root);
                this.state.splice(index, 1);
            }

            delete this.state.__kompo_collection_remove__;
        }

        for(let i = 0, l = this.mounts.length; i < l; i++) {
            const Component = this.mounts[i];
            Component.state.index = i;
            if(Component.stateless || Component.isolated) continue;
            Component.update();
        }

        this.create();
    }

    /**
     * @inheritdoc
     *
     * Removes Component::setState()
     *
     * @param Component
     * @returns {Component}
     */
    mount(Component) {
        this.mounts.push(Component);
        Component.setParent(this);
        return Component;
    }

    /**
     * @inheritdoc
     *
     * Collection state is set in Collection:constructor()
     * setState interfers with the specific state part of the
     * collection.
     *
     * @returns {Collection}
     */
    setState(){
        return this;
    }
}

/**
 * Flags a part of the state to schedule it
 * for removal
 *
 * @param {*} part
 * @param {Number} index
 */
export function remove(part, index) {
    Object.defineProperty(part, '__kompo_collection_remove__' , { configurable: true, writable: true,  value: index });
}