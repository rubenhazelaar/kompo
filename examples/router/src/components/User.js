import Component from '../../../../src/component/Component.js';
import c from '../../../../src/dom/create.js';

export default class User extends Component {
    create() {
        /**
         * Setup statefull elements
         */
        // Content div
        const content = c('div');
        content.classList.add('content');
        const compo = this.mountRoutedComponent(content);
        //console.log(compo);

        /**
         * Structure elements
         */
        // Create root of component
        const fragment = c(),
            heading = c('h2').txt('User');

        // Append children
        fragment
            .append(heading, false)
            .append(content);

        // Return root
        return fragment;
    }
}
