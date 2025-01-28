import React, { useEffect, useState } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerMenu from './DrawerMenu';
import BottomTab from './BottomTab';
import { getComp, checkInterNet } from '../../lib';
import {
    AddAddress,
    AddGift,
    AddNewReminder,
    AddressBook,
    AllowNotification,
    BlankScreen,
    Calender,
    ChangePassword,
    Cms,
    Faq,
    ForgotPassword,
    Login,
    NewPassword,
    Notification,
    OrderHistory,
    Otp,
    Payment,
    SelectAddress,
    SignUp,
    SplashScreen,
    CatchError,
    SuccessMessage,
    Summary,
    Wishlist,
    SocialLogin,
    PaymentFailed,
    TrackOrder,
    PersonalizedMessage,
    CustomerReviews,
    Home,
} from '../../screens';

import { useDispatch } from 'react-redux';
import { instance } from '../../utils';
import { UpdateProfile } from '../../features';
import { AlertError } from '../../components';
import { navigationRef } from '../../lib/navigationService';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MyDrawerNav = ({ navigation }) => {
    const [swipeEnabled, setSwipeEnabled] = useState(false)
    useEffect(() => {
        const test = navigationRef.current?.addListener('state', async (e) => {
            let screenName = navigationRef.current?.getCurrentRoute().name;
            (screenName === 'Home' || screenName === 'Landing') ? setSwipeEnabled(true) : setSwipeEnabled(false);
        });
        return test;
    }, [navigation]);

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerPosition: 'left',
                drawerType: 'front',
                headerShown: false,
                drawerStyle: { width: '80%' },
            }}
            drawerContent={(props) => <DrawerMenu {...props} />}
        >
            <Drawer.Screen name='HomeScreen' component={BottomTab} options={{ swipeEnabled: swipeEnabled, }} />
        </Drawer.Navigator>
    );
}

// export const navigationRef = React.createRef();

function AppNavigator() {
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
                AlertError(error.toString())
            });
    };

    checkInterNet();
    useEffect(() => {
        getProfileData();
    }, [])

    return (

        <NavigationContainer ref={navigationRef}
            screenOptions={{
                gestureEnabled: true, // Enable swipe-back gesture
            }}>
            <Stack.Navigator screenOptions={{ headerShown: false, }}>
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="MyDrawerNav" component={MyDrawerNav} />
                <Stack.Screen name="Faq" component={getComp(Faq)} />
                <Stack.Screen name="BlankScreen" component={getComp(BlankScreen)} />
                <Stack.Screen name="CatchError" component={getComp(CatchError)} />
                <Stack.Screen name="Cms" component={getComp(Cms)} />

                <Stack.Screen name="SocialLogin" component={getComp(SocialLogin, 1)} />
                <Stack.Screen name="Login" component={getComp(Login, 1)} />
                <Stack.Screen name="SignUp" component={getComp(SignUp, 1)} />
                <Stack.Screen name="OTP" component={getComp(Otp, 1)} />
                <Stack.Screen name="ForgotPassword" component={getComp(ForgotPassword, 1)} />
                <Stack.Screen name="NewPassword" component={getComp(NewPassword, 1)} />
                <Stack.Screen name="CustomerReviews" component={getComp(CustomerReviews)} />

                <Stack.Screen name="SuccessMessage" component={getComp(SuccessMessage, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="Notification" component={getComp(Notification, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="OrderHistory" component={getComp(OrderHistory, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="TrackOrder" component={getComp(TrackOrder, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="Wishlist" component={getComp(Wishlist, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="Calender" component={getComp(Calender, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="AddNewReminder" component={getComp(AddNewReminder, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="Payment" component={getComp(Payment, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="AddressBook" component={getComp(AddressBook, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="AddAddress" component={getComp(AddAddress, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="SelectAddress" component={getComp(SelectAddress, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="ChangePassword" component={getComp(ChangePassword, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="AddGift" component={getComp(AddGift, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="Summary" component={getComp(Summary, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="AllowNotification" component={getComp(AllowNotification, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="PaymentFailed" component={getComp(PaymentFailed, 2)} initialParams={{ showmsg: 'yes' }} />
                <Stack.Screen name="PersonalizedMessage" component={getComp(PersonalizedMessage, 2)} initialParams={{ showmsg: 'yes', screenName: 'PersonalizedMessage' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default AppNavigator;