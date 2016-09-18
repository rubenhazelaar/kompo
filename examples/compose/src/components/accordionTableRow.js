import construct from '../../../../src/component/component';

export default construct('tr', function({display, filtered, raw, columnElement, rowSlot}) {
    const length = Array.isArray(filtered)? 
            filtered.length: 
            Object.keys(filtered).length,
        c = this.appendChild(document.createElement(columnElement));
    
    c.setAttribute('colspan', length);
    rowSlot(c, filtered, raw);

    this.style.display = display;
}, {
    display: 'none',
    filtered: [],
    raw: [],
    columnElement: 'td',
    index: undefined,
    rowSlot(c, filtered, raw) {}
});