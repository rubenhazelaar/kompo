import construct from '../../../../src/component/construct';
import react from '../../../../src/component/react';
import mount, {unmountAll, mountIndex} from '../../../../src/component/mount';
import {getState} from '../../../../src/component/state';

import todo from './todo';
import {KompoElement} from "../../../../src/types";
import {dispatch} from "../../../../src/state/store";

export default construct('ul', function ({defaultClass, deleteClass, todoComponent}) {
    this.classList.add(defaultClass);

    const ul = this;
    delegate(this, 'li', 'click', function(this: KompoElement, e) {
        e.preventDefault();
        if(e.target && (<Element>e.target).classList.contains(deleteClass)) {
            // use ul here to make sure the 
            // dispatch callback returns the right state
            dispatch(ul, todos => {
                todos.splice(mountIndex(ul, this), 1);
            })
        }
    });

    react(this, todos => {
        // First unmount and remove all previous todos...
        unmountAll(this);
        empty(this);
        console.log('RESET', todos);

        // .. and then insert the changed array of todos ...
        const frag = document.createDocumentFragment();
        for (let i = 0, l = todos.length; i < l; ++i) {
            const t = todoComponent({
                deleteClass
            });

            // debugLifeCycle(t); // Track each of the todos

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

function empty(el: Element) {
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }
}

function delegate(Element:Element, selector:string, type:string, listener:{ (e:Event): void }) {
    Element.addEventListener(type, function (this: Element, e):void {
        for (let target = <Element>e.target; target && target != this; target = <Element>target.parentNode) {
            // loop parent nodes from the target to the delegation node
            if ((target).matches(selector)) {
                listener.bind(target)(e);
                break;
            }
        }
    }, false);
}