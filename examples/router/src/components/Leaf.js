import component, {getRouter, react} from '../../../../src/component/component';

export default component('div', function ({heading, paramIndex}) {
    this.setAttribute('data-type', 'Leaf');

    // Create Elements
    const h2 = document.createElement('h2'),
        span = document.createElement('span');

    h2.textContent = heading;

    // Append children
    this.appendChild(h2);
    this.appendChild(span);

    const r = getRouter(this);

    // Show parameter if it is set
    react(this, () => {
        const params = r.getParams();
        if (params.length > 0) {
            span.textContent = 'Param at index ' + paramIndex + ' = ' + params[paramIndex];
        }
    });

}
, {
    heading: 'Leaf component',
    paramIndex: 0
});
