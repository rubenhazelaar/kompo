// Component and content creation classes and functions
import construct, {mount} from '../../../src/component/component';
import app from '../../../src/state/app';
import dispatch from '../../../src/state/dispatch';

// Example components with self-explanatory name
import todoList from './components/todoList';
import add from './components/add';

// Create root component
const root = construct('div', function({}) {
    const tl = todoList({
        // Here we could overwrite the key 'todoComponent'
        // in order to compose the list with a todo construct
        // which behaves differently
    }),
        ta = add({
            defaultClass: 'TodoAdd',
            addCallback: value => {
                dispatch(this, state => {
                    state.push({
                        description: value,
                        done: false
                    });
                });
            }
        });

    mount(this, tl);
    mount(this, ta);
});

// An state with some todo's
const state = [
    {
        description: 'Create documentation',
        done: true
    }, {
        description: 'Make tests',
        done: false
    }
];

// Create instance of root
const r = root();

// Append todoList to body
document.body.appendChild(r);

// Kick-off application
app(r, state).start();