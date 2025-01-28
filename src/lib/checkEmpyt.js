
export const isEmptyObj = (obj) => {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


export const isEmptystr = (str) => {
   if(str == '' || str == null || str === undefined){
    return false;
   }
    return true;
}