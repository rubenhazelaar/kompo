import {constructComponent, constructFn, KompoElement, props} from '../types';

/**
 * Creates a compnent from an Element
 *
 * @param tag
 * @param constructFn
 * @param defaultProps
 * @returns {function()}
 */
export default function construct(tag: string, constructFn: constructFn, defaultProps: Object = {}): constructComponent {
    return (props?: props): KompoElement => {
        const c = kompo(document.createElement(tag));
        c.kompo.props = Object.assign({}, defaultProps, props || {});
        c.construct = constructFn;
        return c;
    };
}

export function kompo(Element: Element): KompoElement {
    const ke = <KompoElement>Element;

    ke.kompo = {
        initial: true,
        props: {},
        defaultProps: {},
        mounts: [],
        statefulls: [],
        slots: {},
        routed: undefined,
        selector: undefined,
        unmount: undefined,
        debug: false,
        level: 0
    };

    return ke;
}

export function getProps(Element: KompoElement): props {
    return Element.kompo.props;
}