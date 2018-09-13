import construct, {react, getState} from '../../../src/component/component';
import {ignore, resetIgnore} from '../../../src/state/store';
import app from '../../../src/state/app';

let state = {
    todos: [
        {
            description: 'Create documentation',
            done: true
        }, {
            description: 'Make tests',
            done: false
        }
    ],
    title: 'Rubens todo\'s',
    statistics: {
        amount: 2
    },
    name: ''
};

// Create a component from a div element
const hello = construct('div', function({name}) {
    // Create its children
    const h1 = document.createElement('h1'),
        input = document.createElement('input');

    // Add some even listeners in which
    // the dispatch function dispatches
    // changes to the state
    input.addEventListener('keyup', () => {
        const state = getState(this);
        state.name = input.value;
    });

    // React to a state change (triggered by dispatch())
    react(this, state => {
        console.log(123);
        h1.textContent = 'Hello world, this is ' + (state.name? state.name: name);
    });

    const reactFn = state => {
        console.log('timeout set');
        ignore(state, reactFn);
        setTimeout(() => {
            state.name = 'AJAX';
        }, 3000);
    };
    react(this, reactFn);

    // Last, but not least. Attach the children
    this.appendChild(h1);
    this.appendChild(input);
},{
    // Some default properties
    name: 'Kompo'
});

// Create instance of construct
// and initialize application with state
const a = app(hello(), state);

// Kick-off app and append to body
document.body.appendChild(a.start());

