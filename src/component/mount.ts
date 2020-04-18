import {KompoElement, mounts, selector} from "../types";

import render from './render';
import {setState} from "./state";

export default function mount(parent: KompoElement, child: KompoElement | Array<KompoElement> | Mountable | Array<Mountable>, selector?: selector): void {
    if (Array.isArray(child)) {
        _mountAll(parent, child, selector);
    } else {
        _mount(parent, child, selector)
    }
}

function _mount(parent: KompoElement, child: KompoElement | Mountable, selector?: selector): void {
    if (child instanceof Mountable) {
        selector = child.useParentSelector ? parent.kompo.selector : child.selector;
        if (selector) {
            setState(child.Element, selector);
        }
        child = child.Element;
    } else if (selector) {
        setState(child, selector);
    }

    render(child);

    // Protection if same element is appended multiple times
    const mounts = parent.kompo.mounts;
    if (mounts.indexOf(child) === -1) {
        child.kompo.unmount = () => {
            mounts.splice(mounts.indexOf(<KompoElement>child), 1);
        };
        mounts.push(child);
    }
}

function _mountAll(parent: KompoElement, children: Array<KompoElement> | Array<Mountable>, selector?: selector): void {
    // Mount all children ...
    for (let i = 0, l = children.length;
         i < l;
         ++i
    ) {
        _mount(parent, children[i], selector);
    }
}

export function unmount(Element: KompoElement): void {
    if (Element.kompo.unmount) {
        Element.kompo.unmount();
    }
}

export function unmountAll(Element: KompoElement): void {
    Element.kompo.mounts = [];
}

export function mountIndex(parent: KompoElement, child: KompoElement): Number {
    return parent.kompo.mounts.indexOf(child);
}


export function getMounts(Element: KompoElement): mounts {
    return Element.kompo.mounts;
}

export class Mountable {
    Element: KompoElement;
    selector?: selector;
    useParentSelector: boolean;

    constructor(Element: KompoElement, selector?: selector, useParentSelector?: boolean) {
        this.Element = Element;
        this.selector = selector;

        if (!this.selector) {
            this.useParentSelector = true;
        } else {
            this.useParentSelector = typeof (useParentSelector) !== 'undefined' ? useParentSelector : false;
        }
    }
}

export function mountable(Element: KompoElement, selector: selector, useParentSelector: boolean): Mountable {
    return new Mountable(Element, selector, useParentSelector);
}