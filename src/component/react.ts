import {KompoElement, statefull} from "../types";

export default function react(Element: KompoElement, statefull: statefull): void {
    Element.kompo.statefulls.push(statefull);
}