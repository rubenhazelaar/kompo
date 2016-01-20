// Component and content creation classes and functions
import Component from '../../../src/component/Component.js';
import c, { createText } from '../../../src/dom/create.js';
import addExtensions from '../../../src/dom/extension.js';
addExtensions(); // Initialize without prefix

import AsyncAction from '../../../src/action/AsyncAction.js';
import Do from '../../../src/action/action.js';

class AjaxTodoApp extends Component {
    create() {
        // Create elements
        const root = c(),
            h1 = c('h1').txt('Ajax example - Kompo'),
            container = c('div'),
            a = c('a').h('javascript:void(0);').txt('Click me and load some data'),
            input = c('input'),
            p = c('p').txt('Successful XHR calls: '),
            span = p.append('span');
        container.classList.add('container');


        // Setup AsyncAction
        const action = new AsyncAction(); // Initialize without url

        // Triggered before sending the XHR
        action.before(action.do((action, state, Component) => {
            console.log('BEFORE SENDING');
        }));

        // Setup event handler with when helper, this function sends the XHR
        // It also returns current state and the component in which the action is fired
        this.on(a, 'click', action.when((e, action, state, Component) => {
            e.preventDefault();

            // Set url
            action.url = input.value;

            // Generate
            action.promise()
                // Callback triggers when XHR return successfull
                .then(action.do((action, state, Component) => {
                    console.log('SUCCESS');
                    // Get response (jsonResponse() is also available)
                    console.log(action.response());

                    state.successCount = state.successCount+1;

                    return true; // Updates the application, only use if
                    // something in the state has changed,
                    // You can also use:
                    // return new Do(<true|false>, statepart)
                    // In order to check if an array of object which is
                    // part of state is stale or not.
                }))
                // Callback triggered on error, when status code is not in the 200 range
                .catch(action.do((action, state, Component) => {
                    console.log('FAILURE');
                    // return true; // Updates the application
                }))
                // Callback which is called at the end regardless of success or failure
                .then(action.do((action, state, Component) => {
                    console.log('FINALLY');
                    // return true; // Updates the application
                }));

            return true; // Updates application
        }));

        this.react((state) => {
           span.replace(createText(state.successCount));
        });

        // Structure elements
        root
            .append(h1, false)
            .append('p').txt('Enter your URL below, make sure it supports cross domain calls. Check the console for the result')
            .parentAppend(container)
            .append(input, false)
            .append(a, false)
            .parentAppend(p);

        // Return the root
        return root;
    }
}

// Append component to body
document.body.append(new AjaxTodoApp().setState({
    successCount: 0
}));

