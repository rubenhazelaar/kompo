import {state} from "../../../../src/types";

export default function (state: state) {
    /**
     * Simple top level mutations
     */
    console.groupCollapsed('SIMPLE TOP LEVEL');

    // Set existing key to state
    state.title = 'Somebody\'s todo\'s';

    // Get key from state
    console.log(state.title);

    // Delete key from state
    delete state.title;
    console.log(state);

    // Add new key to state
    state.newtitle = 'A new title';

    console.groupEnd();

    /**
     * Second level simple mutations
     */
    console.groupCollapsed('SIMPLE SECOND LEVEL');

    // Set a new amount
    state.statistics.amount = 3;

    // Get the amount
    console.log(state.statistics.amount);

    // Delete amount
    delete state.statistics.amount;

    // Add new amount to state
    state.statistics.amount = 2;

    console.groupEnd();

    /**
     * Third level simple mutations
     */
    console.groupCollapsed('SIMPLE THIRD LEVEL');

    // Set new title for first todo
    state.todos[1].description = 'Update documentation';

    // Get set title from first todo
    console.log(state.todos[1]);

    // Delete title from first todo
    delete state.todos[1].description;

    // Set new description for first todo
    state.todos[1].description = 'Create documentation';

    console.groupEnd();

    /**
     * Array mutations
     */
    console.groupCollapsed('ARRAY MUTATIONS');

    // Add new todo
    state.todos[2] = {
        description: 'New todo',
        done: false
    };

    // Add another todo
    state.todos.push({
        description: 'Second new todo',
        done: false
    });

    // Remove from todo array
    // IMPORTANT fires 'stateChange' event twice!
    state.todos.splice(2, 1);

    console.groupEnd();

    /**
     * Mutation after selectors
     */
    console.groupCollapsed('WITH SELECTOR');

    const selector = (state: state) => {
            return state.statistics;
        },
        part = selector(state);

    // Set a new amount
    part.amount = 4;

    // Get the amount
    console.log(part.amount);

    // Delete amount
    delete part.amount;

    // Add new amount to state
    part.amount = 2;

    console.log(state);

    console.groupEnd();
}
