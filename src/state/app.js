// @flow
import observe from './store';
import {render, setState} from '../component/component'

export default function app(root:KompoElement, state:any, router:?router):{start:() => KompoElement} {
    state = observe(state, root);

    // Make available for all Elements
    Object.defineProperty(Element.prototype, '__kompo__', {
        value: {
            root,
            state,
            router
        }
    });

    return {
        start: function (selector:?selector):KompoElement {
            if(selector) {
                setState(root, selector);
            }
            requestAnimationFrame(() => render(root));
            return root
        }
    };
}