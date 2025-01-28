import { Platform } from 'react-native';
import axios from 'axios';
import base64 from 'react-native-base64';
import setting from './setting';
import { store } from "../app/Store";
import DeviceInfo from 'react-native-device-info';

const apiFormPost = async (url, data, imageData = {}, imagekey = 'profile_image') => {

  let uniqueId = DeviceInfo.getDeviceId();
  const StoreData = store.getState();
  const formData = new FormData();

  let headers = {
    'Content-Type': 'multipart/form-data'
  }

  let requestData = { data: data }

  requestData['data']['domain'] = setting[setting.environment].domain

  if (StoreData.auth.data.slug) {
    requestData['data']['slug'] = StoreData.auth.data.slug
    headers['Authorization'] = `Bearer ${StoreData.auth.token}`;
  }

  //For landin Page
  if (StoreData.country?.country?.menu_url?._id) {
    requestData['data']['page_data'] = StoreData.country?.country?.menu_url
  }

  // console.log('url=======', url);
  // console.log('requestData=======', requestData);

  requestData['data']["country_id"] = requestData['data']["country_id"] ? requestData['data']["country_id"] : StoreData.country?.country?.country_id ? StoreData.country?.country?.country_id : "";
  requestData['data']["city_id"] = requestData['data']["city_id"] ? requestData['data']["city_id"] : StoreData.country?.country?.city_id ? StoreData.country?.country?.city_id : "";

  requestData['data']['browser_id'] = uniqueId
  requestData['device_id'] = ''
  requestData['device_token'] = ''
  requestData['api_type'] = 'mobile'
  requestData['device_type'] = Platform.OS === 'ios' ? 'ios' : 'android'

  let reqData = base64.encode(JSON.stringify(requestData));

  formData.append('req', reqData)
  formData.append('is_crypto', false);

  if (imageData?.path) {
    const imageUri = Platform.OS === "ios" ? imageData.path.replace("file://", "") : imageData.path;
    let imageprop = {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile_image.jpg",
    };
    formData.append(imagekey, imageprop)
  }

  //return axios.post('https://z6h1cmgcr8.execute-api.ap-south-1.amazonaws.com'+url, formData, {
  return axios.post(setting[setting.environment].api_image_post_url + url, formData, {
    timeout: 10000,
    headers: headers,
  })
    .then((response) => {
      let res = Object.assign({}, response, {
        data: base64.decode(response.data)
      })
      return res;
    }).catch(error => {
      return { status: "error", message: "somthing whent wrong" }

    });
}


export default apiFormPost;