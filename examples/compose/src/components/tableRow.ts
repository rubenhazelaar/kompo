import construct from '../../../../src/component/construct';

export default construct('tr', function({defaultClass, filtered, columnElement}) {
    let arr,
        isObject = false;
    if(!Array.isArray(filtered)) {
        arr = Object.keys(filtered);
        isObject = true;
    } else {
        arr = filtered;
    }

    if(defaultClass) this.classList.add(defaultClass);

    for(let i = 0, l = arr.length; i < l; ++i) {
        const c = this.appendChild(document.createElement(columnElement));
        c.textContent = filtered[isObject? arr[i]: i];
    }
}, {
    defaultClass: '',
    filtered: [],
    raw: [],
    columnElement: 'td',
    index: undefined
});