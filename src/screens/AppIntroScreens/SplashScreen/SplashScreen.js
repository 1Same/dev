import React, { useEffect } from "react";
import { SafeAreaView, Image } from 'react-native';
import { ImagePath, Strings } from "../../../constants";
import styles from "./styles";
import { instance } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setCounrtyData } from "../../../features"
import { AlertError } from "../../../components";

export default SplashScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const countryData = useSelector((state) => state.country);

    const getCountryData = async () => {
        instance.post('/delivery_country', {
            req: { "data": { show_on: "show_on_modal" } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData?.status === 'success') {
                if (userData.country_data?._id) {
                    dispatch(setCounrtyData({
                        "default_country_id": userData.country_data?._id ? userData.country_data?._id : '',
                        "default_country_name": userData.country_data?.country_name ? userData.country_data?.country_name : '',
                        "default_country_image": userData.country_data?.country_mobile_image ? userData.country_data?.country_mobile_image : '',
                        "default_currency_symbol": userData.country_data?.currency_symbol ? userData.country_data?.currency_symbol : '',
                        "default_country_iso_code": userData.country_data?.country_iso_code ? userData.country_data?.country_iso_code : '',
                        "zip_based_delivery": userData.website_data?.zip_based_delivery ? userData.website_data?.zip_based_delivery : 0,
                        "country_id": userData.country_data?._id ? userData.country_data?._id : '',
                        "country_iso_code": userData.country_data?.country_iso_code ? userData.country_data?.country_iso_code : '',
                        "country_name": userData.country_data?.country_name ? userData.country_data?.country_name : '',
                        "city_id": userData.country_data?.city_id ? userData.country_data?.city_id : '',
                        "city_name": userData.country_data?.city_name ? userData.country_data?.city_name : '',
                        "country_image": userData.country_data?.country_mobile_image ? userData.country_data?.country_mobile_image : '',
                        "currency_symbol": userData.country_data?.currency_symbol ? userData.country_data?.currency_symbol : '',
                        "image_url": userData.country_data?.image_url ? userData.country_data?.image_url : '',
                        "isFromLandingPage": false,
                    }));
                }
                navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'MyDrawerNav' }
                    ]
                });
            }
        }).catch(error => {
            console.log("getCountryData catch error ===splash-------", error);
            AlertError(Strings.Other.catchError);
        });
    };

    useEffect(() => {
        if (!countryData?.country?.country_id) {
            getCountryData();
        }
        else {
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'MyDrawerNav' }
                        // { name: 'Home' }
                    ]
                });
            }, 2000);
        }
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.iconSplashLogo} source={ImagePath.Intro.splashLogoUpdated} resizeMode="contain" />
        </SafeAreaView>
    )
}