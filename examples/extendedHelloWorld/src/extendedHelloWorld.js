import construct, {react} from '../../../src/component/component';
import dispatch from '../../../src/state/dispatch';
import app from '../../../src/state/app';

// Create a component from a div element
const hello = construct('div', function({name}) {
    // Create its children
    const h1 = document.createElement('h1'),
        input = document.createElement('input');

    // Add some even listeners in which
    // the dispatch function dispatches
    // changes to the state
    input.addEventListener('keyup', () => {
        dispatch(this, state => {
            state.name = input.value;
        });
    });

    // React to a state change (triggered by dispatch())
    react(this, state => {
        h1.textContent = 'Hello world, this is ' + (state.name? state.name: name);
    });

    // Last, but not least. Attach the children
    this.appendChild(h1);
    this.appendChild(input);
},{
    // Some default properties
    name: 'Kompo'
});

// Setup state
const state = {
    name: ''
};

// Create instance of construct
// and initialize application with state
const a = app(hello(), state);

// Kick-off app and append to body
document.body.appendChild(a.start());
