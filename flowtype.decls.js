import Compoment from './src/component/Component.js';

/**
 * Declare all types use in Kompo
 */
type Component = Compoment;
type state = { [key: any]: any };
type props = { [key: any]: any };
type attributes = { [key: any]: any };
type options = { [key: any]: any };
type statefull = (state: state, Component: Component) => boolean | Component;
type nestCallback = (state: state, Component: Component) => Component | Node | DocumentFragment;
type KompoElement = string | Component | Element;
type ComponentPathCollection = { [key: string]: Array<Component> };