// Component and content creation classes and functions
import construct, {mount, getState, debugLifeCycle} from '../../../src/component/component';
import app from '../../../src/state/app';
import {dispatch, triggerUpdate} from '../../../src/state/store';

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
                const state = getState(this);
                state.push({
                    description: value,
                    done: false
                });
            }
        }),
        sortElement = document.createElement('a'),
        dispatchedSortElement = document.createElement('a'),
        silentDispatchedSortElement = document.createElement('a'),
        triggerUpdateElement = document.createElement('a');

    sortElement.href = 'javascript:void(0);';
    sortElement.textContent = 'sort';
    sortElement.classList.add('o-Btn');
    sortElement.addEventListener('click', e => {
        e.preventDefault();
         console.log('SORT');
        const state = getState(this);
         state.sort(sortAlpha);
    });

    dispatchedSortElement.href = 'javascript:void(0);';
    dispatchedSortElement.textContent = 'dispatched sort';
    dispatchedSortElement.classList.add('o-Btn');
    dispatchedSortElement.addEventListener('click', e => {
        e.preventDefault();
        dispatch(this, state => {
            console.log('SORT');
            state.sort(sortAlpha);
        })
    });

    silentDispatchedSortElement.href = 'javascript:void(0);';
    silentDispatchedSortElement.textContent = 'silent dispatched sort';
    silentDispatchedSortElement.classList.add('o-Btn');
    silentDispatchedSortElement.addEventListener('click', e => {
        e.preventDefault();
        dispatch(this, state => {
            console.log('SORT');
            state.sort(sortAlpha);
        }, true); // Sets dispatch to silent!
    });

    triggerUpdateElement.href = 'javascript:void(0);';
    triggerUpdateElement.textContent = 'trigger update';
    triggerUpdateElement.classList.add('o-Btn');
    triggerUpdateElement.addEventListener('click', e => {
        e.preventDefault();
        const state = getState(this);
        console.log('triggerUpdate');
        triggerUpdate(state);
    });
    
    // debugLifeCycle(tl); // Tracks life cycle of this component

    mount(this, tl);
    mount(this, ta);
    this.appendChild(tl);
    this.appendChild(ta);
    this.appendChild(sortElement);
    this.appendChild(dispatchedSortElement);
    this.appendChild(silentDispatchedSortElement);
    this.appendChild(triggerUpdateElement);
});

// An state with some todo's
const state = [
    {
        description: 'Make tests',
        done: false
    },
    {
        description: 'Create documentation',
        done: true
    }
];

// Create instance of root
const r = root();

// Append todoList to body
document.body.appendChild(r);

// Kick-off application
app(r, state).start();

function sortAlpha(a,b) {
    if (a.description < b.description) return -1;
    if (a.description > b.description) return 1;
    return 0;
}
