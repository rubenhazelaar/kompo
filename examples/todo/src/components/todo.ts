import construct from '../../../../src/component/construct';
import react from '../../../../src/component/react';
import {getState} from '../../../../src/component/state';

export default construct('li', function ({defaultClass, deleteClass}) {
    const todo = document.createElement('a'),
        del = document.createElement('a');
    
    this.classList.add(defaultClass);
    del.textContent = 'x';
    del.classList.add(deleteClass);
    
    todo.addEventListener('click', e => {
        e.preventDefault();
        const state = getState(this);
        state.done = !state.done;
    });

    del.addEventListener('click', e => {
        e.preventDefault();
        remove(this);
    });

    react(this, state => {
        console.log('REACT');
        todo.textContent = state.description;
        if (state.done) {
            this.classList.add('Todo--isCompleted');
        } else {
            this.classList.remove('Todo--isCompleted');
        }
    });

    this.appendChild(todo);
    this.appendChild(del);
}, {
    defaultClass: 'Todo',
    deleteClass: 'TodoDelete',
    description: ''
});

function remove(el: Element):void {
    if (el.parentNode) {
        el.parentNode.removeChild(el);
    }
}