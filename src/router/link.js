import component, {react, getRouter, hasSlot, slot, mount} from '../component/component';
import dispatch from '../state/dispatch';

export default component('a', function ({
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
        this.appendChild(document.createTextNode(child));
    } else if (child.hasOwnProperty('kompo')) {
        mount(this, child);
    } else if (child instanceof Node) {
        this.appendChild(child);
    } else if (hasSlot(this, 'child')) {
        slot(this, 'child');
    } else {
        throw new Error('Child should be a string, KompoElement, Node or a slot callback named "child"');
    }

    this.addEventListener(defaultEvent, (e) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
        router.goTo(url, title, data);
        dispatch(this, (state) => {
            state.url = url;
        });
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