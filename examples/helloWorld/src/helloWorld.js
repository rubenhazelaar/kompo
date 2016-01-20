// Component class
import Component from '../../../src/component/Component.js';

// Setup root component
class App extends Component {
    create() {
        // Create heading ...
        const h1 = document.createElement('h1');
        // and add text, all through standard DOM methods
        h1.appendChild(
            document.createTextNode('Hello world, this is ' + this.props.name)
        );

        // Return the heading
        return h1;
    }
}

// Set a name as property
const app = new App({
    name: 'Kompo'
});

// Render component and append to body
document.body.appendChild(app.render());

