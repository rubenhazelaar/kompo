// @flow
import {render} from '../component/component';

export default function dispatch(Element:KompoElement, cb:(state:state)=>void, noRender:boolean):void {
    if (!cb) return;

    const kompo = Element.kompo,
        state = kompo.selector ? kompo.selector(Element.__kompo__.state) : Element.__kompo__.state;

    if (!state) return;

    cb(state);
    if (!noRender) render(Element.__kompo__.root);
}