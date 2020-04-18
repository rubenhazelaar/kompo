import {KompoElement} from "../types";

import construct from '../component/construct';
import react from '../component/react';
import getRouter from '../component/getRouter';
import slot, {hasSlot} from '../component/slot';
import mount, {Mountable} from '../component/mount';
import {getState} from '../component/state';

export default construct('a', function (this: KompoElement, {
    url, child, classNames, data, title, defaultEvent, activeClass, onClick
}) {
    // First add classes
    for (let i = 0, l = classNames.length; i < l; ++i) {
        this.classList.add(classNames[i]);
    }

    const router = getRouter(this);

    react(this, () => {
        if (router.isUrl(url)) {
            this.classList.add(activeClass);
        } else {
            this.classList.remove(activeClass);
        }
    });

    this.setAttribute('href', url);

    if (typeof child === 'string') {
        this.textContent = child;
    } else if (child instanceof Mountable) {
        mount(this, child);
        this.appendChild(child.Element);
    } else if (child.hasOwnProperty('kompo')) {
        mount(this, child);
        this.appendChild(child);
    } else if (child instanceof Node) {
        this.appendChild(child);
    } else if (hasSlot(this, 'child')) {
        slot(this, 'child');
    } else {
        throw new Error('Child should be a string, KompoElement, Node or a slot callback named "child"');
    }

    this.addEventListener(defaultEvent, (e: Event) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
        router.goTo(url, title, data);
        const state = getState(this);
        state.url = url;
    });
}, {
    url: '',
    child: '',
    classNames: [],
    data: undefined, // Data to push with pushState()
    title: '',
    defaultEvent: 'click',
    activeClass: 'active',
    onClick: undefined
})