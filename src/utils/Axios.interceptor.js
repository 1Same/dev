import { Platform } from 'react-native';
import axios from 'axios';
import base64 from 'react-native-base64';
import setting from './setting';
import { store } from "../app/Store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { ToastSuccess } from '../components';
import { navigationRef } from '../lib/navigationService';

let instance = axios.create({
    baseURL: setting[setting.environment].api_url,
    timeout: 10000,
    headers: { 'Content-Type': 'multipart/form-data' },
});
// Add a request interceptor
instance.interceptors.request.use(async (request) => {
    let uniqueId = DeviceInfo.getDeviceId();
    const StoreData = store.getState();

    let requestData = request?.data?.req;
    requestData['data']['currency'] = StoreData.country.country.currency_symbol
    requestData['data']['domain'] = setting[setting.environment].domain

    if (StoreData.auth.data.slug) {
        requestData['data']['slug'] = StoreData.auth.data.slug //Dev User
        request.headers.Authorization = `Bearer ${StoreData.auth.token}`;
    }

    requestData['data']["country_id"] = requestData['data']["country_id"] ? requestData['data']["country_id"] : StoreData.country?.country?.country_id ? StoreData.country?.country?.country_id : "";
    requestData['data']["country_code"] = requestData['data']["country_iso_code"] ? requestData['data']["country_iso_code"] : StoreData.country?.country?.country_iso_code ? StoreData.country?.country?.country_iso_code : "";

    if (request.url != "/customer_address_list") {
        requestData['data']["city_id"] = requestData['data']["city_id"] ? requestData['data']["city_id"] : StoreData.country?.country?.city_id ? StoreData.country?.country?.city_id : "";
    }

    requestData['data']['browser_id'] = uniqueId
    requestData['device_id'] = ''
    requestData['device_token'] = ''
    requestData['api_type'] = 'mobile'
    requestData['device_type'] = Platform.OS === 'ios' ? 'ios' : 'android'

    if (request?.url == '/get_product_list') {
        // console.log("requestData==>>>>>>>>>>>>", request?.url, '+', requestData);
    }

    let postData = base64.encode(JSON.stringify(requestData));
    request.data.req = postData
    return request;
}, (error) => {
    console.log('requestError=======', error);
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(async (response) => {
    const StoreData = store.getState();
    // Do something with response data
    let res = Object.assign({}, response, {
        data: base64.decode(response.data)
    })
    const userData = JSON.parse(res?.data)
    if (userData?.is_user_active === 0 && userData?.is_user_active !== undefined && StoreData?.auth?.token) {
        await AsyncStorage.setItem("userData", '');
        ToastSuccess("Logout successfully");
        navigationRef.navigate('BlankScreen', { "goTo": 'Home', "is_user_active": '0' })
        return res;
    }
    else {
        return res;
    }
}, (error) => {
    // Do something with response error
    console.log('responseError=====catch====', error);
    return Promise.reject(error);
});
export default instance;