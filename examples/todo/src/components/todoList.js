import construct, {react, mount, unmount, unmountAll, mountIndex, debugLifeCycle} from '../../../../src/component/component';
import dispatch from '../../../../src/state/dispatch';

import todo from './todo';

// Run matches polyfill for examples, see kompo-util for the polyfill
(function(): void {
    if (!Element.prototype.matches) {
        const ep: Element = Element.prototype;

        if (ep.webkitMatchesSelector) // Chrome <34, SF<7.1, iOS<8
            ep.matches = ep.webkitMatchesSelector;

        if (ep.msMatchesSelector) // IE9/10/11 & Edge
            ep.matches = ep.msMatchesSelector;

        if (ep.mozMatchesSelector) // FF<34
            ep.matches = ep.mozMatchesSelector;
    }
}());

export default construct('ul', function ({defaultClass, deleteClass, todoComponent}) {
    this.classList.add(defaultClass);

    const ul = this;
    delegate(this, 'li', 'click', function(e) {
        e.preventDefault();
        if(e.target.classList.contains(deleteClass)) {
            // use ul here to make sure the 
            // dispatch callback returns the right state
            dispatch(ul, todos => {
                todos.splice(mountIndex(ul, this), 1);
            });
            unmount(this);
        }
    });

    react(this, todos => {
        // First unmount and remove all previous todos...
        unmountAll(this);
        empty(this);

        // .. and then insert the changed array of todos ...
        const frag = document.createDocumentFragment();
        for (let i = 0, l = todos.length; i < l; ++i) {
            const t = todoComponent({
                deleteClass
            });

            debugLifeCycle(t); // Track each of the todos

            // ... and then mount to the list
            mount(this, t, todos => todos[i]);

            // Add to a fragment
            frag.appendChild(t);
        }

        // ... and append to the list
        this.appendChild(frag);
    });
}, {
    defaultClass: 'TodoList',
    deleteClass: 'TodoDelete',
    todoComponent: todo
});

function empty(el) {
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }
}

function delegate(Element:Element, selector:string, type:string, listener:{ (e:Event): void }) {
    Element.addEventListener(type, function (e):void {
        for (let target = e.target; target && target != this; target = target.parentNode) {
            // loop parent nodes from the target to the delegation node
            if (target.matches(selector)) {
                listener.bind(target)(e);
                break;
            }
        }
    }, false);
}