import Component from '../../../../../../src/component/Component.js';
import c from '../../../../../../src/dom/create.js';

export default class All extends Component {
    create() {
        /**
         * Structure elements
         */
        // Create root of component
        const fragment = c(),
            heading = c('h3').txt('All'),
            content = c('div');
        content.classList.add('content');

        // Append children
        fragment
            .append(heading, false)
            .append(content);

        // Return root
        return fragment;
    }
}
