import Component from '../component/Component.js';
import isFunction from '../utils/isFunction.js';

/**
 * Represents a Link
 *
 * @class
 * @classdesc This link is picked up by the Router and
 * subsequently routed to correct path of the
 * application.
 * @augments Component
 */
export default class Link extends Component {
    /**
     * Create a Link instance
     *
     * @param {string} url
     * @param {string|Component|Node} child
     * @param {Object} [props]
     *
     */
    constructor(url, child, props) {
        super(props);
        this.url = url;
        this.child = child;
    }

    /**
     * @inheritdoc
     *
     * @throws an error if incorrect child is provided
     * @returns {Node}
     */
    create() {
        // Destructure props
        const { classNames, activeClass, defaultEvent, onClick, title, data } = this.props;
        // Create root element
        const a = document.createElement('a'),
            classNamesLength = classNames.length;

        // Add classes
        if (classNamesLength > 0) {
            for (let i = 0; i < classNamesLength; ++i) {
                a.classList.add(classNames[i]);
            }
        }

        this.react((state) => {
            if(state.Router.isUrl(this.url)) {
                a.classList.add(activeClass);
            } else {
                a.classList.remove(activeClass);
            }
        });

        // Set href
        a.setAttribute('href', this.url);

        // Add child
        if(typeof this.child === 'string') {
            a.appendChild(document.createTextNode(this.child));
        } else if(this.child instanceof Component) {
            this.mount(this.child);
            a.appendChild(this.child.render());
        } else if(this.child instanceof Node) {
            a.appendChild(this.child);
        } else if(isFunction(this.nest)) {
            a.appendChild(this.nest());
        } else {
            throw new Error('Child should be a string, Component, Node or a nest callback');
        }

        // Add event
        this.on(a, defaultEvent, (e, state, ChildComponent) => {
            e.preventDefault();
            if(isFunction(onClick)) {
                onClick.call(this, e, state, ChildComponent);
            }
            return state.Router.goTo(this.url, title, data);
        });

        return a;
    }
}

// Set default properties
Link.defaultProps = {
    classNames: [],
    data: {}, // Data to push with pushState()
    title: '',
    defaultEvent: 'click',
    activeClass: 'active',
    onClick: null
};
