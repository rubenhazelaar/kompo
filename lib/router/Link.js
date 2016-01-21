'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Component2 = require('../component/Component.js');

var _Component3 = _interopRequireDefault(_Component2);

var _isFunction = require('../utils/isFunction.js');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Represents a Link
 *
 * @class
 * @classdesc This link is picked up by the Router and
 * subsequently routed to correct path of the
 * application.
 * @augments Component
 */

var Link = function (_Component) {
    _inherits(Link, _Component);

    /**
     * Create a Link instance
     *
     * @param {string} url
     * @param {string|Component|Node} child
     * @param {Object} [props]
     *
     */

    function Link(url, child, props) {
        _classCallCheck(this, Link);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.url = url;
        _this.child = child;
        return _this;
    }

    /**
     * @inheritdoc
     *
     * @throws an error if incorrect child is provided
     * @returns {Node}
     */

    Link.prototype.create = function create() {
        var _this2 = this;

        // Create root element
        var a = document.createElement('a'),
            classNames = this.props.classNames,
            classNamesLength = classNames.length;

        // Add classes
        if (classNamesLength > 0) {
            for (var i = 0; i < classNamesLength; ++i) {
                a.classList.add(classNames[i]);
            }
        }

        this.react(function (state) {
            var activeClass = _this2.props.activeClass;
            if (state.Router.isUrl(_this2.url)) {
                a.classList.add(activeClass);
            } else {
                a.classList.remove(activeClass);
            }
        });

        // Set href
        a.setAttribute('href', this.url);

        // Add child
        if (typeof this.child === 'string') {
            a.appendChild(document.createTextNode(this.child));
        } else if (this.child instanceof _Component3.default) {
            this.mount(this.child);
            a.appendChild(this.child.render());
        } else if (this.child instanceof Node) {
            a.appendChild(this.child);
        } else if ((0, _isFunction2.default)(this.nest)) {
            a.appendChild(this.nest());
        } else {
            throw new Error('Child should be a string, Component, Node or a nest callback');
        }

        // Add event
        this.on(a, this.props.defaultEvent, function (e, state) {
            e.preventDefault();
            return state.Router.goTo(_this2.url, _this2.props.title, _this2.props.data);
        });

        return a;
    };

    return Link;
}(_Component3.default);

// Set default properties

exports.default = Link;
Link.defaultProps = {
    classNames: [],
    data: {}, // Data to push with pushState()
    title: '',
    defaultEvent: 'click',
    activeClass: 'active'
};