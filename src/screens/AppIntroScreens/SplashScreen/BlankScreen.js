import React, { useEffect } from "react";
import Loader from "../../../components/Loader/loader";
import { isEmptyObj } from "../../../lib";
import { instance } from "../../../utils";
import { useDispatch, } from "react-redux";
import { logoutSucces, UpdateProfile } from "../../../features";

export default BlankScreen = ({ navigation, route }) => {

    const dispatch = useDispatch();
    const getProfileData = async () => {
        instance.post('/customer_profile', {
            req: { "data": {} }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {

                    userData.result.profile_image = userData.result.profile_image ? userData?.image_path + userData?.result?.profile_image : '';
                    dispatch(UpdateProfile(userData));
                }
            }).catch(error => {
                AlertError(error.toString());
            });
    };

    useEffect(() => {
        if (route.params?.is_user_active === '0') {
            dispatch(logoutSucces());
        }
        if (route.params?.goto == 'MyProfile') {
            getProfileData();
        }
        route.params?.goto === 'MyProfile' ?
            navigation.navigate('AccountStack', { screen: route.params?.goto, 'params': { 'flow': 'BottomTab', "profileImg": 'true' } }) :
            isEmptyObj(route.params?.menu_url) ? navigation.navigate(route.params?.goto ? route.params?.goto : 'Home') : navigation.navigate(route.params?.goto == 'Wishlist' ? 'Wishlist' : 'HomeStack', { 'screen': route.params?.goto, "params": { 'menu_url': route.params?.menu_url } });
    }, [])

    return (
        <Loader />
    )
}
