import construct, {react, getRouter} from '../../../../src/component/component';
import {swap} from '../../../../src/router/router';

export default construct('div', function ({heading}) {
    this.setAttribute('data-type', 'Branch');
    
    // Create Elements
    const h2 = document.createElement('h2');
    h2.textContent = heading;

    // Append children
    this.appendChild(h2);

    const r = getRouter(this);
    react(this, () => {
        swap(this, r);
    });
}, {
    heading: 'Branch construct'
});
