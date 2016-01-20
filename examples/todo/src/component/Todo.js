// Component and content creation classes and functions
import Component from '../../../../src/component/Component.js';
import c, { createFragment, createText } from '../../../../src/dom/create.js';
import reaction from '../../../../src/action/reaction.js';

export default class Todo extends Component {
    create() {
        // Create element
        const root = c('li'),
            completeToggle = c('a').h('javascript:void(0);'),
            del = c('a').h('javascript:void(0);').txt(this.props.removeText || 'X');
        root.classList.add('Todo');
        completeToggle.classList.add('js-Todo-completeToggle');
        del.classList.add('js-Todo-delete','Todo-delete');

        // Do two different changes in one reaction
        this.react(reaction((state, previous) => {
            const description = state.description;

            if(description != previous) {
                completeToggle.replace(createText(description));
            }

            if(state.done)  {
                root.classList.add('Todo--isCompleted');
            } else {
                root.classList.remove('Todo--isCompleted');
            }

            return description;
        }));

        // Structure elements
        root
            .append(completeToggle, false)
            .append(del, false);

        return root;
    }
}
