import {KompoElement, router} from "../types";

/**
 * Gets the router from an Element. The router is
 * add globally to the Element prototype
 *
 * @param Element
 * @returns {router}
 */
export default function getRouter(Element: KompoElement): router {
    return Element.__kompo__.router;
}