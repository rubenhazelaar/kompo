import construct from '../../../../src/component/construct';
import react from '../../../../src/component/react';
import getRouter from '../../../../src/component/getRouter';
import {KompoElement} from "../../../../src/types";
import {swap} from '../../../../src/router/router';

export default construct('div', function (this: KompoElement, {heading}) {
    this.setAttribute('data-type', 'Branch');
    
    // Create Elements
    const h2 = document.createElement('h2');
    h2.textContent = heading;

    // Append children
    this.appendChild(h2);

    const r = getRouter(this);
    react(this, () => {
        // console.log('REACT BRANCH', heading);
        swap(this, r);
    });
}, {
    heading: 'Branch construct'
});