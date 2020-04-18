import {KompoElement, selector} from "../types";

export function setState(Element: KompoElement, selector: selector): KompoElement {
    const kompo = Element.kompo;
    kompo.selector = selector;
    return Element;
}

export function getState(Element: KompoElement): any {
    const selector = Element.kompo.selector;
    return selector ?
        selector(Element.__kompo__.state) :
        Element.__kompo__.state
}

export function getSelector(Element: KompoElement): undefined | selector {
    return Element.kompo.selector;
}