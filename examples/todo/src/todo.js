// Component and content creation classes and functions
import Component from '../../../src/component/Component.js';
import c from '../../../src/dom/create.js';
import addExtensions from '../../../src/dom/extension.js';
addExtensions(); // Initialize without prefix

import TodoList from './component/TodoList.js';
import TodoAdd from './component/TodoAdd.js';

// Setup root component
class TodoApp extends Component {
    create() {
        // Create components
        const list = this.mount(new TodoList({
            className: 'TodoList'
        })),
            todoAdd = this.mount(new TodoAdd({
                addText: 'Add'
            }));

        // Create elements
        const root = c(),
            h1 = c('h1').txt('Todo example - Kompo');

        // Structure elements
        root
            .append(h1, false)
            .append(list, false)
            .append(todoAdd);

        // Return the root
        return root;
    }
}



// Append component to body; No todos in the state yet
document.body.append(new TodoApp().setState({
    todos: [{
        description: 'Create documentation',
        done: true
    },{
        description: 'Make tests',
        done: false
    }]
}));

