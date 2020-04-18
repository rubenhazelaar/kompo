import {KompoElement, slotCallback} from "../types";

/**
 * Mimics the slot functionality of
 * Web Components
 *
 * Slots are named, their name & location is
 * predefined in the component.
 *
 * @param Element
 * @param name
 * @param cb
 */
export default function slot(Element: KompoElement, name: string, cb?: slotCallback): void {
    if (arguments.length === 2) {
        Element.kompo.slots[name](Element);
        return
    }

    if (cb) {
        Element.kompo.slots[name] = cb;
        return
    }

    throw Error('invalid slot setting or calling');
}

/**
 * Checks whether a slot with the given name exists
 *
 * @param Element
 * @param name
 * @returns {boolean}
 */
export function hasSlot(Element: KompoElement, name: string): boolean {
    return !!Element.kompo.slots[name];
}
