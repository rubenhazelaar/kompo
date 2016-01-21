'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.remove = remove;

var _Component5 = require('./Component.js');

var _Component6 = _interopRequireDefault(_Component5);

var _create = require('../dom/create.js');

var _merge = require('../utils/merge.js');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents a Collection which
 * can be used to effectively render
 * and rerender a collection of Components
 */

var Collection = function (_Component) {
    _inherits(Collection, _Component);

    /**
     * Create a collections instance and creates
     * the collection
     *
     * @param {Node} root - to append collection to
     * @param {*} state - state (part) to render collection for
     * @param {Function} componentConstructor - class constructor for creating the collection items
     * @param {Object} options
     */

    function Collection(root, state, componentConstructor, options) {
        _classCallCheck(this, Collection);

        var _this = _possibleConstructorReturn(this, _Component.call(this));

        _this.root = root;
        _this.state = state;
        _this.stateless = false;
        _this.componentConstructor = componentConstructor;
        _this.options = (0, _merge2.default)({
            fragmentLimit: 1,
            props: undefined
        }, options);
        _this.create();
        return _this;
    }

    /**
     * @inheritdoc;
     *
     * Creates the collection, and is also used to check
     * integrity on update
     *
     * @returns {Node}
     */

    Collection.prototype.create = function create() {
        if (Array.isArray(this.state)) {
            this.append(this.state);
        } else if (isObject(this.state)) {
            this.append(Object.keys(this.state), this.state);
        } else {
            throw new Error('Cannot iterate over given state. Please check constructor input and provide an array or object.');
        }

        return this.root;
    };

    /**
     * Appends new items to the Collection,
     * if there are any
     *
     * @param {Array} arr - array to iterate or keys from object
     * @param {Object} obj - object to iterate
     */

    Collection.prototype.append = function append(arr, obj) {
        var arrLength = arr.length,
            mountsLength = this.mounts.length;

        // Mount when collection grows
        if (arrLength > mountsLength) {
            var parent = undefined,
                useFragment = undefined;
            if (arrLength - mountsLength > this.options.fragmentLimit) {
                parent = (0, _create.createFragment)();
                useFragment = true;
            } else {
                parent = this.root;
                useFragment = false;
            }

            for (var i = mountsLength; i < arrLength; i++) {
                var index = obj ? arr[i] : i,
                    value = obj ? obj[index] : arr[i];

                parent.appendChild(this.mount(new this.componentConstructor(this.options.props).setState((0, _merge2.default)(value, { index: index }))).render());
            }

            if (useFragment) {
                this.root.appendChild(parent);
            }
        }
    };

    /**
     * @inheritdoc
     *
     * Deletes components, then updates them and
     * appends more if needed.
     */

    Collection.prototype.update = function update() {
        if (this.state.hasOwnProperty('__kompo_collection_remove__')) {
            var index = this.state.__kompo_collection_remove__;

            if (Array.isArray(index)) {
                for (var i = 0, l = index.length; i < l; i++) {
                    var _Component2 = this.unmountByIndex(index);
                    _Component2.root.parentNode.removeChild(_Component2.root);
                    this.state.splice(index, 1);
                }
            } else {
                var _Component3 = this.unmountByIndex(index);
                _Component3.root.parentNode.removeChild(_Component3.root);
                this.state.splice(index, 1);
            }

            delete this.state.__kompo_collection_remove__;
        }

        for (var i = 0, l = this.mounts.length; i < l; i++) {
            var _Component4 = this.mounts[i];
            _Component4.state.index = i;
            if (_Component4.stateless || _Component4.isolated) continue;
            _Component4.update();
        }

        this.create();
    };

    /**
     * @inheritdoc
     *
     * Removes Component::setState()
     *
     * @param Component
     * @returns {Component}
     */

    Collection.prototype.mount = function mount(Component) {
        this.mounts.push(Component);
        Component.setParent(this);
        return Component;
    };

    /**
     * @inheritdoc
     *
     * Collection state is set in Collection:constructor()
     * setState interfers with the specific state part of the
     * collection.
     *
     * @returns {Collection}
     */

    Collection.prototype.setState = function setState() {
        return this;
    };

    return Collection;
}(_Component6.default);

/**
 * Flags a part of the state to schedule it
 * for removal
 *
 * @param {*} part
 * @param {Number} index
 */

exports.default = Collection;
function remove(part, index) {
    Object.defineProperty(part, '__kompo_collection_remove__', { configurable: true, writable: true, value: index });
}