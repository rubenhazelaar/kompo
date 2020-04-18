/**
 * Checks if given variable is a function
 *
 * @param {*} functionToCheck
 * @returns {boolean}
 */
export default function isFunction(functionToCheck: any): boolean {
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
