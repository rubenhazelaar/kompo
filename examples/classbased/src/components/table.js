import {constructClass, react, append} from '../../../../src/component/component';

import TableRow from './TableRow';

export class Table {
    construct({columnFilter}) {
        const head = document.createElement('thead'),
            body = document.createElement('tbody'),
            frag = document.createDocumentFragment();

        this.on(this);

        react(this, state => {
            if (!Array.isArray(state) || state.length < 1) return;

            const keys = Object.keys(columnFilter(state[0]));
            this.appendRow(head, {
                filtered: keys,
                raw: state[0],
                columnElement: 'th'
            });

            for (let i = 0, l = state.length; i < l; ++i) {
                this.appendRow(frag, {
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
    }

    appendRow(parent, data) {
        append(parent, TableRow(data));
    }

    on() {
        delegate(this, 'tr', 'click', function(e) {
            e.preventDefault();
            console.log(this.kompo.props);
        });
    }
}

export default constructClass('table', Table, {
    columnFilter(data) {
        // Do nothing
        return data;
    }
});

// Delegate function from the kompo-util repository
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

// empty function from the kompo-util repository
function empty(el) {
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }
}
