// Component and content creation classes and functions
import Component from '../../../src/component/Component.js';
import c, { createText } from '../../../src/dom/create.js';
import addExtensions from '../../../src/dom/extension.js';
addExtensions(); // Initialize without prefix

// Setup root component
class App extends Component {
    create() {
        // Create elements
        const root = c(),
            h1 = c('h1', {
                id: 'Primary heading' // Set attributes through an object
            }),
            input = c('input');

        // Event listener, trigger update on keyup
        this.on(input, 'keyup', (e, state) => {
            if(state.name != e.target.value) {
                state.name = e.target.value;
                return true; // If value has changed return true
            }
            return false; // This could be omitted
        });

        // Statefull element, changes when an update is triggered by the event listener above
        this.react((state) => {
            const name = typeof state.name !== 'undefined' && state.name !== ''? state.name: this.props.name;
            h1.replace(createText('Hello world, this is ' + name));
        });

        // Append children to root
        root
            .append(h1, {
               'data-heading': 'Primary heading' // Add more attributes on append
            }, false)
            .append('p').txt('Type your name to say "Hello world": ')
                .append(input);

        // Return the root
        return root;
    }
}

// Set a name as default property
App.defaultProps = {
    name: 'Kompo'
};

// Append component to body; notice the empty state
// and how it is used together with a default property
// in the react callback above
document.body.append(new App().setState({}));

