import {instance} from "./";


export const getApiData = (url,data={}) =>{

    return instance.get(url, {
    req: { "data": data }
    })
    .then(function (response) {
        const siteData = JSON.parse(response.data);
        return siteData;
    }).catch(error => {
        return {status : "error", message : "somthing whent wrong!"} 
    });
}


export const postApiData = (url,data={}) =>{

    return instance.post(url, {
    req: { "data": data }
    })
    .then(function (response) {
        const siteData = JSON.parse(response.data);
       return siteData;
    }).catch(error => {
        return {status : "error", message : "somthing whent wrong!"} 
    });
}
