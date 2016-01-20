// Component and content creation classes and functions
import Component from '../../../../src/component/Component.js';
import c, { createFragment, createText } from '../../../../src/dom/create.js';
import reaction from '../../../../src/action/reaction.js';

export default class TodoAdd extends Component {
    create() {
        // Create elements
        const root = c('div'),
            input = c('input').attr('placeholder', 'A new todo ...'),
            add = c('a').h('javascript:void(0);').txt(this.props.addText || '+');
        root.classList.add('TodoAdd');
        input.classList.add('js-Todo-addInput');
        add.classList.add('js-Todo-add','Todo-add');

        // Create actions on click and on enter (keyup)
        const addFunction = function(e, state){
            e.preventDefault();
            const code = e.which || e.keyCode;
            if(code === 13 || e.type === 'click') {
                if (input.value != '') {
                    state.todos.push({
                        description: input.value,
                        done: false
                    });
                    input.value = '';
                    return true;
                }
            }
        };

        // Define on click action
        this.on(input, 'keyup', addFunction);
        this.on(add, 'click', addFunction);

        // Structure elements
        root
            .append(input, false)
            .append(add, false);

        return root;
    }
}
