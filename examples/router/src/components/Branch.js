import Component from '../../../../src/component/Component.js';
import c, { createText } from '../../../../src/dom/create.js';

export default class Branch extends Component {
    create() {
        // Create Elements
        const root = c(),
            heading = c('h2').txt(this.props.heading),
            content = c('div');
        content.classList.add('content');

        // Append children
        root
            .append(heading, false)
            .append(content);

        // Attach the routed Component to the content div
        this.mountRoutedComponent(content);

        // Return root
        return root;
    }
}

Branch.defaultProps = {
    heading: 'Branch component'
};
