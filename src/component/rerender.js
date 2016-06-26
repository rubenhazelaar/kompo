// @flow
import Component from './Component';
import RAF from '../utils/requestAnimationFrame';

/**
 * Rerenders (Component::update + Component::after) from
 * closest encountered root
 * 
 * @param C {Component}
 */
export default function rerender(C: Component) {
    const root: Component = C.getRoot();
    if(root === null) {
        RAF(C.update.bind(C));
        RAF(C.after.bind(C));
    } else {
        RAF(root.update.bind(root));
        RAF(root.after.bind(root));
    }
    RAF(C.after.bind(C));
}