import Component from '../../../../src/component/Component.js';
import c, { createText } from '../../../../src/dom/create.js';

export default class Leaf extends Component {
    create() {
        // Create Elements
        const root = c(),
            heading = c('h2').txt(this.props.heading),
            span = c('span');

        // Append children
        root
            .append(heading, false)
            .append(span);

        if(this.props.input) {
            this.input = c('input');
            root.append(this.input);
        }

        // Show parameter if it is set
        this.react((state) => {
            const params = state.Router.params;
            if(params.length > 0) {
                span.replace(createText('Param at index ' + this.props.paramIndex + ' = ' + params[this.props.paramIndex]));
            }
        });

        // Return root
        return root;
    }
    
    afterRender() {
        // Perform check if input is available
        if(typeof this.input !== 'undefined') {
            this.input.focus();
        }
    }
}

Leaf.defaultProps = {
    heading: 'Leaf component',
    paramIndex: 0
};
