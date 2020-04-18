import {constructComponent, props} from "../types";

/**
 * Adds properties to an existing component,
 * making it possible to compose a component with
 * different behavior.
 *
 * @param constructComponent
 * @param composeProps
 * @returns {function()}
 */
export default function compose(constructComponent:constructComponent, composeProps:props = {}):constructComponent {
    return (props = {}) => {
        return constructComponent(Object.assign(composeProps, props));
    };
}

