import React, { useCallback, useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors, ImagePath, Size } from '../../constants';
import { instance } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import {
    Home,
    Detail,
    Landing,
    Listing,
    MyAccountMenu,
    ShoppingCart,
    EditMyProfile,
    MyProfile,
    ValentineDay,
} from '../../screens';
// import { navigationRef } from './AppNavigation';
import { useFocusEffect, useIsFocused, } from "@react-navigation/native";
import FastImage from 'react-native-fast-image';
import { setCounrtyData } from "../../features";
import { getComp, checkInterNet } from '../../lib';
import { navigationRef } from '../../lib/navigationService';

const HomeTab = createNativeStackNavigator();
const HomeStack = ({ route }) => {
    // console.log('route=======', route.params);
    const countryData = useSelector((state) => state.country);
    checkInterNet();
    return (
        <HomeTab.Navigator screenOptions={{ headerShown: false, }}>
            <HomeTab.Screen name="Home" component={countryData.country?.isFromLandingPage == false ? getComp(Home) : getComp(Landing)} />
            <HomeTab.Screen name="Landing" component={countryData.country?.isFromLandingPage == false ? getComp(Home) : getComp(Landing)} />
            <HomeTab.Screen name="ValentineDay" component={getComp(ValentineDay)} />
            <HomeTab.Screen name="Listing" component={getComp(Listing)} initialParams={{ showmsg: 'yes' }} />
            <HomeTab.Screen name="Detail" component={getComp(Detail)} initialParams={{ showmsg: 'yes' }} />
        </HomeTab.Navigator>
    )
};

const AccountTab = createNativeStackNavigator();
const AccountStack = ({ navigation, route }) => {
    checkInterNet();
    return (
        <AccountTab.Navigator screenOptions={{ headerShown: false, }}>
            {route.params?.params?.flow == 'BottomTab' &&
                <AccountTab.Screen name='MyAccountMenu' component={getComp(MyAccountMenu, 2)} initialParams={{ showmsg: 'yes' }} options={{ headerShown: false }} />
            }
            <AccountTab.Screen name='EditMyProfile' component={getComp(EditMyProfile, 2)} initialParams={{ showmsg: 'yes' }} options={{ headerShown: false }} />
            <AccountTab.Screen name='MyProfile' component={getComp(MyProfile, 2)} initialParams={{ showmsg: 'yes' }} options={{ headerShown: false }} />
        </AccountTab.Navigator>
    )
}

const Tab = createBottomTabNavigator();
const BottomTab = ({ navigation }) => {

    const focus = useIsFocused()
    const countryData = useSelector((state) => state.country);
    const authData = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [cartItomCounts, setCartItemCounts] = useState(0);
    const [bottomValue, setBottomValue] = useState('aa');
    const [currentScreen, setCurrentScreen] = useState('Home');
    const [checkProfileImageCount, setCheckProfileImageCount] = useState(0);
    const [profileImage, setProfileImage] = useState(authData.data?.profile_image ? authData.data?.profile_image : '');
    const BottomIcon = ImagePath?.Bottom;

    const selectBottomTab = (key) => {
        if (countryData?.country?.country_name !== countryData?.country?.default_country_name) { //add new code 
            navigation.navigate('Listing');
            return ''
        }
        setBottomValue(key)
        let oldCountryData = countryData.country
        if (key === currentScreen) {
            return;
        }
        let checkCurrentScreenWith = oldCountryData?.menu_url?.page_type
        if (key == 'Home' && currentScreen.toLocaleLowerCase() != checkCurrentScreenWith && oldCountryData["isFromLandingPage"]) {
            navigation.navigate("Landing");
        }
        else {
            if (key == "Home") {
                let newCountryData = {
                    "country_id": oldCountryData["default_country_id"],
                    "country_image": oldCountryData["default_country_image"],
                    "country_name": oldCountryData["default_country_name"],
                    "country_iso_code": oldCountryData["default_country_iso_code"],
                    "isFromLandingPage": false
                }
                let currCountryData = { ...oldCountryData, ...newCountryData };
                dispatch(setCounrtyData(currCountryData))
            }
            authData.data?.slug || key == "Home" ? navigation.navigate('BlankScreen', { 'goto': key }) : navigation.navigate("Login", { "showmsg": 'yes' })
        }
    };

    const cartItemCount = () => {
        instance.post('/get_cart_item_count', {
            req: {
                "data": {}
            }
        }).then(async (response) => {
            const cartCount = JSON.parse(response.data)
            if (cartCount.status === 'success') {
                setCartItemCounts(cartCount);
            }
        }).catch(error => {
            console.log('cartItemCount====catch=====', error);
        })
    };

    useEffect(() => {
        const test = navigationRef.current?.addListener('state', async (e) => {
            var arr = [
                "ShoppingCart",
                "Home",
                "Listing",
                "Detail",
                "Landing"
            ];
            let screenName = navigationRef.current?.getCurrentRoute().name;
            let selectTab = 'Home'
            setCurrentScreen(screenName);
            if (screenName == "Home" || screenName == "Landing" || screenName == "Listing") {
                selectTab = 'Home'
            }
            if (bottomValue != "MyAccountMenu" && bottomValue != "Dashboard" && screenName != "MyAccountMenu" && screenName != "Dashboard") {
                selectTab = 'Home'
            }
            if (screenName == "MyAccountMenu" || screenName == "EditMyProfile" || screenName == "MyProfile") selectTab = 'MyAccountMenu'
            if (screenName == "Dashboard") selectTab = 'Dashboard'
            setBottomValue(selectTab);
            if (arr?.indexOf(screenName) > -1) {
                cartItemCount();
            }
        });
        return test;
    }, [navigation]);

    useEffect(() => {
        setProfileImage(authData.data?.profile_image ? authData.data?.profile_image : '');
    }, [focus, profileImage,])

    useEffect(() => {
        cartItemCount();
    }, []);

    return (
        <Tab.Navigator
            initialRouteName="HomeStack"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                tabBarHideOnKeyboard: 'true',
                tabBarStyle: {
                    // height: 60,
                    // backgroundColor: "blue",
                }
            }}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    tabBarLabel: () => null,
                    headerShown: false,
                    tabBarIcon: () => (
                        // < TouchableOpacity onPress={() => selectBottomTab('Home')} activeOpacity={0.9} >
                        <Image style={{ tintColor: bottomValue == 'Home' || bottomValue == "Landing" ? null : Colors.Black }} source={bottomValue === 'Home' || bottomValue === "Landing" ? BottomIcon.homeBlack : BottomIcon.home} />
                        // </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen
                name={"Home"}
                component={HomeStack}
                initialParams={{ 'screenName': false }}
                options={{
                    tabBarLabel: () => null,
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.9} >
                            <Image style={{ tintColor: bottomValue != 'Dashboard' ? Colors.Black : null }} source={bottomValue === 'Dashboard' ? BottomIcon.categoryBlack : BottomIcon.dashboard} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen
                name="ShoppingCart"
                component={getComp(ShoppingCart)}
                options={{
                    tabBarLabel: () => null,
                    tabBarStyle: { display: 'none' },
                    tabBarBadge: cartItomCounts?.result?.count > 0 ? cartItomCounts?.result?.count : ' ',
                    tabBarBadgeStyle: { backgroundColor: cartItomCounts?.result?.count > 0 ? Colors.RossoCorsa : null, marginTop: cartItomCounts?.result?.count > 0 ? 3 : 0 },
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Image style={{ tintColor: bottomValue != 'ShoppingCart' ? Colors.Black : null }} source={bottomValue === 'ShoppingCart' ? BottomIcon.cartBlack : BottomIcon.cart} />
                    ),
                }}
            />
            <Tab.Screen
                name={"AccountStack"}
                component={AccountStack}
                options={{
                    tabBarLabel: () => { null, setProfileImage(authData.data?.profile_image ? authData.data?.profile_image : '') },
                    tabBarStyle: { display: authData.data?.slug ? 'flex' : 'none' },
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <TouchableOpacity onPress={async () => {
                            navigation.navigate("AccountStack", { screen: "MyAccountMenu", 'params': { 'flow': 'BottomTab' } })
                        }}
                            style={[styles.profileView, { backgroundColor: bottomValue === 'MyAccountMenu' ? Colors.Secondary.Black : null, }]} activeOpacity={0.9}>
                            {Platform.OS == 'android' ?
                                <FastImage
                                    style={{ width: Size.xxl, height: Size.xxl, borderRadius: bottomValue === 'MyAccountMenu' ? Size.x5l : bottomValue != 'MyAccountMenu' ? Size.xm1 : 0 }}
                                    source={authData.data?.slug ? (profileImage == undefined || profileImage === '') ? ImagePath.Other.emptyUser : {
                                        uri: profileImage,
                                        priority: FastImage.priority.high,
                                        cache: FastImage.cacheControl.immutable
                                    } : ImagePath.Other.emptyUser
                                    }
                                    resizeMode={FastImage.resizeMode.cover}
                                    tintColor={bottomValue === 'MyAccountMenu' && (profileImage == undefined || profileImage === '') ? Colors.White : null}

                                    onError={(e) => {
                                        if (checkProfileImageCount > 100) {
                                            setCheckProfileImageCount(0)
                                            setProfileImage('')
                                        }
                                        else {
                                            setCheckProfileImageCount(checkProfileImageCount + 1)
                                            setProfileImage(profileImage)
                                        }
                                    }}
                                />
                                :
                                < Image style={{ width: Size.xxl, height: Size.xxl, tintColor: bottomValue === 'MyAccountMenu' && (profileImage == undefined || profileImage === '') ? Colors.White : null, borderRadius: bottomValue === 'MyAccountMenu' ? Size.x5l : bottomValue != 'MyAccountMenu' ? Size.x5l : 0 }}
                                    source={authData.data?.slug ? (profileImage == undefined || profileImage == '') ? ImagePath.Other.emptyUser : { uri: profileImage } : ImagePath.Other.emptyUser} />
                            }
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tab.Navigator >
    );
}
export default BottomTab;

const styles = StyleSheet.create({
    profileView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 42,
        borderRadius: Size.xm,
        height: 42,
        backgroundColor: null
    }
});