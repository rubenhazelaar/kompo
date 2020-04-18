import construct from '../../../../src/component/construct';
import react from '../../../../src/component/react';
import render from '../../../../src/component/render';

import tableRow from './tableRow';
import {KompoElement} from "../../../../src/types";

export default construct('table', function({appendRow, columnFilter, on}) {
    const head = document.createElement('thead'),
        body = document.createElement('tbody'),
        frag = document.createDocumentFragment();

    on(this);

    react(this, state => {
        if(!Array.isArray(state) || state.length < 1) return;
        
        const keys = Object.keys(columnFilter(state[0]));
        appendRow(this, head, {
            filtered: keys,
            raw: state[0],
            columnElement: 'th'
        });
        
        for(let i = 0, l = state.length; i < l; ++i) {
             appendRow(this, frag, {
                 filtered: columnFilter(state[i]),
                 raw: state[i],
                 index: i
             });
        }
        
        empty(body);
        body.appendChild(frag);
    });

    this.appendChild(head);
    this.appendChild(body);
}, {
    appendRow(table: KompoElement, parent: KompoElement, data: any[]) {
        const tr = tableRow(data);
        parent.appendChild(tr);
        render(tr);
    },
    columnFilter(data: any[]) {
        // Do nothing
        return data;
    },
    on(table: KompoElement) {
        delegate(table, 'tr', 'click', function(this: KompoElement, e: Event) {
            e.preventDefault();
            console.log(this.kompo.props);
        });
    }
});

// Delegate function from the kompo-util repository
export function delegate(Element:Element, selector:string, type:string, listener:{ (e:Event): void }) {
    Element.addEventListener(type, function (this: Element, e: Event):void {
        for (let target: EventTarget | null = e.target; target && target != this; target = (<Element>target).parentNode) {
            // loop parent nodes from the target to the delegation node
            if ((<Element>target).matches(selector)) {
                listener.bind(target)(e);
                break;
            }
        }
    }, false);
}

// empty function from the kompo-util repository
function empty(el: Element) {
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }
}
