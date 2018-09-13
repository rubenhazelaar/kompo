import {render, getProps, constructClass} from '../../../../src/component/component';

import {Table} from './Table';
import TableRow from './TableRow';
import AccordionTableRow from './AccordionTableRow';

export class AccordionTable extends Table {
    appendRow(parent, props) {
        const tableProps = getProps(this),
            tr = TableRow(props);
        props.defaultClass = tableProps.rowClass;
        parent.appendChild(tr);
        render(tr);
        if(typeof props.index !== 'undefined') {
            const atr = AccordionTableRow(Object.assign(props, tableProps));
            parent.appendChild(atr);
            render(atr)
        }

    }
    on() {
        const tableProps = getProps(this);
        delegate(this, '.' + tableProps.rowClass, 'click', function(e) {
            e.preventDefault();
            const next = this.nextSibling;
            if(next) {
                next.style.display = next.style.display === 'none'?
                    null: 'none';
            }
        });
    }
}

export default constructClass('table', AccordionTable, {
    rowSlot(c, filtered, raw) {},
    rowClass: 'clickableRow'
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