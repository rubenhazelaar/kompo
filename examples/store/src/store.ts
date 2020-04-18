import construct from '../../../src/component/construct';
import react from '../../../src/component/react';
import {getState} from '../../../src/component/state';
import {ignore, resetIgnore} from '../../../src/state/store';
import app from '../../../src/component/app';
import {state} from "../../../src/types";
import testStore from './tests/store'

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

    // testStore(getState(this));

    const reactFn = (state: state) => {
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

