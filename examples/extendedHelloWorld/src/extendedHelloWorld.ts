import construct from '../../../src/component/construct';
import react from '../../../src/component/react';
import {getState} from '../../../src/component/state';
import app from '../../../src/component/app';
import {KompoElement} from "../../../src/types";

// Create a component from a div element
const hello = construct('div', function(this: KompoElement, {name}) {
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
