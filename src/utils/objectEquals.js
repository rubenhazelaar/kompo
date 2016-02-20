export default function objectEquals(obj1, obj2){
    const obj1k = Object.keys(obj1),
        obj2k = Object.keys(obj2);
    if (obj1k.length !== obj2k.length) return false;
    for (var i = 0, len = obj1k.length; i < len; i++){
        if (obj1[obj1k[i]] !== obj2[obj2k[i]]){
            return false;
        }
    }
    return true;
}
