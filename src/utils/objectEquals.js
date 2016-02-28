// @flow
export default function objectEquals(obj1: { [key: any]: any }, obj2: { [key: any]: any }): boolean {
    const obj1k: Array<any> = Object.keys(obj1),
        obj2k: Array<any> = Object.keys(obj2);
    if (obj1k.length !== obj2k.length) return false;
    for (var i = 0, len = obj1k.length; i < len; i++){
        if (obj1[obj1k[i]] !== obj2[obj2k[i]]){
            return false;
        }
    }
    return true;
}
