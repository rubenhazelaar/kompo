import Component from '../../../../../src/component/Component.js';
import c from '../../../../../src/dom/create.js';

export default class Images extends Component {
    create() {
        /**
         * Create statefull elements
         */
        // Create parent
        const content = c('div');
        content.classList.add('content');
        this.mountRoutedComponent(content);

        /**
         * Structure elements
         */
        // Create root of component
        const fragment = c(),
            heading = c('h3').txt('Images');

        // Append children
        fragment
            .append(heading, false)
            .append(content);

        // Return root
        return fragment;
    }
}
