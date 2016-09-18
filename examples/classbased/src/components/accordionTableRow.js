import {constructClass} from '../../../../src/component/component';

class AccordionTableRow {
    construct({display, filtered, raw, columnElement, rowSlot}) {
        const length = Array.isArray(filtered)?
                filtered.length:
                Object.keys(filtered).length,
            c = this.appendChild(document.createElement(columnElement));

        c.setAttribute('colspan', length);
        rowSlot(c, filtered, raw);

        this.style.display = display;
    }
}

export default constructClass('tr', AccordionTableRow, {
    display: 'none',
    filtered: [],
    raw: [],
    columnElement: 'td',
    index: undefined,
    rowSlot(c, filtered, raw) {}
});