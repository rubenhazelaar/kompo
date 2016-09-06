// @flow
import observe from './observe';
import {render} from '../component/component'

export default function app(root:KompoElement, state:any, router:?router):{start:() => void} {
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
        start: function ():KompoElement {
            render(root);
            return root
        }
    };
}