import component, {react} from '../../../src/component/component';
import dispatch from '../../../src/state/dispatch';
import app from '../../../src/state/app';

const hello = component('div', function({name}) {
    const h1 = document.createElement('h1'),
        input = document.createElement('input');

    input.addEventListener('keyup', () => {
        dispatch(this, state => {
            state.name = input.value;
        });
    });

    react(this, state => {
        h1.textContent = 'Hello world, this is ' + (state.name? state.name: name);
    });

    this.appendChild(h1);
    this.appendChild(input);
},{
    name: 'Kompo'
});

// Setup state
const state = {
    name: ''
};

// Create instance of component
// and initialize application with state
const a = app(hello(), state);

// Kick-off app and append to body
document.body.appendChild(a.start());
