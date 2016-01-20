import Component from '../../../../src/component/Component.js';
import c from '../../../../src/dom/create.js';
import action, { Do } from '../../../../src/action/action.js';

export default class Dashboard extends Component {
    create() {
        /**
         * Setup statefull Elements
         */
        // Input element
        const input = c('input');
        this.on(input,'keyup', action((e, state)=> {
            if(state.user.name != e.target.value) {
                state.user.name = e.target.value;
                return new Do(true, state.user); // return true if state has changed
            }
            return new Do(false, state.user);
        }));
        this.react((state)=>{
            if(input.value !== state.user.name) {
                input.value = state.user.name;
            }
        });

        /**
         * Structure elements
         */
        // Create root of component
        const fragment = c(),
            heading = c('h2').txt('Dashboard'),
            content = c('div');
        content.classList.add('content');

        // Append children
        fragment
            .append(heading, false)
            .append(input, false)
            .append(content);

        // Return root
        return fragment;
    }
}
