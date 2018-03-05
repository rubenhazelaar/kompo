// @flow
import observe from './observe';
import {render, setState} from '../component/component'

export default function app(root:KompoElement, state:any, router:?router):{start:() => KompoElement} {
    state = observe(state);

    // Make available for all Elements
    Object.defineProperty(Element.prototype, '__kompo__', {
        value: {
            root: root,
            state: state,
            router: router
        }
    });

    return {
        start: function (selector:?selector):KompoElement {
            if(selector) {
                setState(root, selector);
            }
            requestAnimationFrame(() => {render(root)});
            return root
        }
    };
}