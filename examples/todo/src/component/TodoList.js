// Component and content creation classes and functions
import Component from '../../../../src/component/Component.js';
import c, { createFragment } from '../../../../src/dom/create.js';

import Collection, { remove } from '../../../../src/component/Collection.js';

import Todo from './Todo.js';

export default class TodoList extends Component {
    create() {
        const root = c('ul');
        root.classList.add(this.props.className);

        // Recreates all Todos on every update
        // Can be augmented with action/reaction pattern
        //const frag = createFragment();
        //this.react((state) => {
        //    // Create todos
        //    for(let i = 0, l = state.todos.length; i < l; i++) {
        //        const todo = state.todos[i];
        //            // Pseudo > CollectionWrapper(state(part?), Todo)
        //        frag.append(new Todo(i,todo));
        //    }
        //
        //    root.empty().append(frag)
        //});

        // Pools one type of component and gives it their respective state
        // Also take care of growing and shrinking of the collection
        this.mount(new Collection(root, this.state.todos, Todo, {
            props: { // Pass props to all Todo components
                removeText: 'Delete'
            }
        }));

        // Delegated action to specific collection components
        // Notice the fourth parameter which returns this item.
        // Self represents the Component in which the action is called
        this.on(root, '.js-Todo-completeToggle', 'click', (e, state, self, child) => {
            const todo = state.todos[child.state.index];
            todo.done = !todo.done;
            return true;
        });

        this.on(root, '.js-Todo-delete', 'click', (e, state, self, child) => {
            remove(state.todos, child.state.index);
            return true;
        });

        return root;
    }
}
