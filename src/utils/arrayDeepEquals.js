export default function arrayDeepEquals(arr1, arr2) {
    // if the other arr1 is a falsy value, return
    if (!arr1 || !arr2)
        return false;

    // compare lengths - can save a lot of time
    if (arr1.length !== arr2.length)
        return false;

    for (var i = 0, l=arr1.length; i < l; i++) {
        // Check if we have nested arrays
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!deepEquals(arr1[i], arr2[i]))
                return false;
        }
        else if (arr1[i] !== arr2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}