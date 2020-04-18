import construct from '../../../../src/component/construct';
import {KompoElement} from "../../../../src/types";

export default construct('tr', function(this: KompoElement, {display, filtered, raw, columnElement, rowSlot}) {
    const length = Array.isArray(filtered)? 
            filtered.length: 
            Object.keys(filtered).length,
        c = this.appendChild(document.createElement(columnElement));
    
    c.setAttribute('colspan', length);
    rowSlot(c, filtered, raw);

    (<HTMLElement><unknown>this).style.display = display;
}, {
    display: 'none',
    filtered: [],
    raw: [],
    columnElement: 'td',
    index: undefined,
    rowSlot(c: Element, filtered: any[], raw: any[]) {}
});