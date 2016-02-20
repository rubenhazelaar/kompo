import arrayDeepEquals from './arrayDeepEquals.js';

export default function objectDeepEquals(obj1, obj2) {
    //For the first loop, we only check for types
    const obj1k = Object.keys(obj1),
        obj2k = Object.keys(obj2),
        obj1l = obj1k.length,
        obj2l = obj2k.length;

    if(obj1l !== obj2l) return false;

    for(let i = 0, l = obj1l; i < l; ++i) {
        const propName = obj1k[i];
        //Check for inherited methods and properties - like .equals itself
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
        //Return false if the return value is different
        if (obj1.hasOwnProperty(propName) != obj2.hasOwnProperty(propName)) {
            return false;
        }
        //Check instance type
        else if (typeof obj1[propName] != typeof obj2[propName]) {
            //Different types => not equal
            return false;
        }
    }

    //Now a deeper check using other objects property names
    for(let i = 0, l = obj2l; i < l; ++i) {
        const propName = obj2k[i];
        //We must check instances anyway, there may be a property that only exists in obj2
        //I wonder, if remembering the checked values from the first loop would be faster or not
        if (obj1.hasOwnProperty(propName) != obj2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof obj1[propName] != typeof obj2[propName]) {
            return false;
        }
        //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
        if(!this.hasOwnProperty(propName))
            continue;

        //Now the detail check and recursion

        //This returns the script back to the array comparing
        if (obj1[propName] instanceof Array && obj2[propName] instanceof Array) {
            // recurse into the nested arrays
            if (!arrayDeepEquals(obj1[propName], obj2[propName]))
                return false;
        }
        else if (obj1[propName] instanceof Object && obj2[propName] instanceof Object) {
            // recurse into another objects
            if (!objectDeepEquals(obj1[propName], obj2[propName]))
                return false;
        }
        //Normal value comparison for strings and numbers
        else if(obj1[propName] !== obj2[propName]) {
            return false;
        }
    }
    //If everything passed, let's say YES
    return true;
}
