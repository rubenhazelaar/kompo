/**
 * Declare all types use in Kompo
 */
type state = any;
type props = { [key: any]: any };
type attributes = { [key: any]: any };
type options = { [key: any]: any };
type statefull = (state:state) => void;
type router = { goTo: (u:string, title:string, data:any) => void; get: (parent:Element) => Element;}
type slotCallback = (Element:KompoElement) => void;
type selector = (state:state)=>state;
type createFn = (props:props)=>void

declare class KompoElement extends Element {
    kompo: {
        initial:boolean;
        props:props;
        defaultProps:props;
        mounts: Array<KompoElement>;
        statefulls: Array<statefull>;
        slots: { [key: string]: slotCallback };
        routed: ?KompoElement;
        selector: ?selector;
        state: ?state;
    };
    __kompo__: {
        root: KompoElement;
        state: state;
        router: router;
    };
    create: createFn;
}
