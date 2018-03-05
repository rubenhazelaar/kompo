/**
 * Declare all types use in Kompo
 */
type state = any;
type mounts = Array<KompoElement>;
type props = { [key: any]: any };
type attributes = { [key: any]: any };
type options = { [key: any]: any };
type statefull = (state:state) => void;
type router = { goTo: (u:string, title:string, data:any) => boolean; get: (parent:KompoElement) => KompoElement;}
type slotCallback = (Element:KompoElement) => void;
type selector = (state:state)=>state;
type constructFn = (props:props)=>void;
type constructComponent = (props:props)=> KompoElement;

declare class KompoElement extends Element {
    kompo: {
        initial:boolean;
        props:props;
        defaultProps:props;
        mounts: mounts;
        statefulls: Array<statefull>;
        slots: { [key: string]: slotCallback };
        routed: ?KompoElement;
        selector: ?selector;
        state: ?state;
        unmount: ?Function
    };
    __kompo__: {
        root: KompoElement;
        state: state;
        router: router;
    };
    construct: constructFn;
}
