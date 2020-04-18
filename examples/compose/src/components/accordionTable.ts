import render from '../../../../src/component/render';
import compose from '../../../../src/component/compose';
import { getProps} from '../../../../src/component/construct';

import table, {delegate} from './table';
import tableRow from './tableRow';
import accordionTableRow from './accordionTableRow';
import {KompoElement, props} from "../../../../src/types";

export default compose(table, {
    rowSlot(c: Element, filtered: any[], raw: any[]) {},
    appendRow(table: KompoElement, parent: KompoElement, props: props) {
        const tableProps = getProps(table),
            tr = tableRow(props);
        props.defaultClass = tableProps.rowClass;
        parent.appendChild(tr);
        render(tr);
        if(typeof props.index !== 'undefined') {
            const atr = accordionTableRow(Object.assign(props, tableProps));
            parent.appendChild(atr);
            render(atr)
        }

    },
    on(table: KompoElement) {
        const tableProps = getProps(table);
        delegate(table, '.' + tableProps.rowClass, 'click', function(this: Element,e) {
            e.preventDefault();
            const next = <HTMLElement>this.nextSibling;
            if(next) {
                next.style.display = next.style.display === 'none'?
                    'block': 'none';
            }
        });
    },
    rowClass: 'clickableRow'
});