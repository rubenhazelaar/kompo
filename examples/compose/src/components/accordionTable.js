import {append, compose, getProps} from '../../../../src/component/component';
import merge from '../../../../src/util/merge';

import table from './table';
import tableRow from './tableRow';
import accordionTableRow from './accordionTableRow';

export default compose(table, {
    rowSlot(c, filtered, raw) {},
    appendRow(table, parent, props) {
        const tableProps = getProps(table);
        props.defaultClass = tableProps.rowClass;
        append(parent, tableRow(props));
        if(typeof props.index !== 'undefined') {
            append(parent, accordionTableRow(
                merge(props, tableProps)
            ));
        }

    },
    on(table) {
        const tableProps = getProps(table);
        delegate(table, '.' + tableProps.rowClass, 'click', function(e) {
            e.preventDefault();
            const next = this.nextSibling;
            if(next) {
                next.style.display = next.style.display === 'none'?
                    null: 'none';
            }
        });
    },
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