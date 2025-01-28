import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, FlatList, SafeAreaView, Modal, PixelRatio } from 'react-native';
import { Colors, Size, Label, ImagePath, Icon, Spacer, Strings, } from "../../../constants";
import { Button, ToastError, AlertError, Loader, NewInputText, } from "../../../components";
import styles from "./styles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { instance } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { logoutSucces } from "../../../features";
import { Formik } from "formik";
import * as yup from 'yup'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default MyAccountMenu = ({ navigation }) => {

    const dispatch = useDispatch();
    const [selected, setSelected] = useState(false)
    const [showChangeCityModal, setShowChangeCityModal] = useState(false);
    const [getNotificationCount, setNotificationCount] = useState('');
    const fontScale = PixelRatio?.getFontScale();
    const getFontSize = size => size / fontScale;
    const authData = useSelector((state) => state.auth);
    const focus = useIsFocused();
    const [profileImage, setProfileImage] = useState(authData.data?.profile_image);
    const [isLoding, setIsLoding] = useState(false);

    const closeScreen = () => {
        navigation.navigate('BlankScreen');
    };

    const deleteAccountPopup = function () {
        const signUpValidationSchema = yup.object().shape({
            deleteAccount: yup.string().required('Enter DELETE')
                .matches('DELETE', "Please Fill (DELETE)"),
        })

        return (
            showChangeCityModal == true &&
            <Modal
                animationType="none"
                transparent={true}
                visible={showChangeCityModal}
                onRequestClose={() => {
                    setShowChangeCityModal(!showChangeCityModal);
                }}>
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={styles.deleteAccountMainView}>
                        <Formik
                            initialValues={{ deleteAccount: '' }}
                            validationSchema={signUpValidationSchema}
                            onSubmit={deleteAccount}
                        >
                            {({
                                handleChange, handleBlur, handleSubmit, touched, values, errors
                            }) => (

                                <View style={[styles.deleteAccountContain, { height: errors.deleteAccount ? 220 : 200, }]}>
                                    <Label style={{ textAlign: 'center', lineHeight: 20 }} text={Strings.Other.deleteAccountDe} />

                                    <NewInputText
                                        mainContainerStyle={{ marginHorizontal: 0 }}
                                        containerStyle={styles.inputView}
                                        placeholder={'DELETE'}
                                        name="Delete Account"
                                        value={values.deleteAccount}
                                        onChangeText={handleChange('deleteAccount')}
                                        onBlur={handleBlur('deleteAccount')}
                                        touched={touched.deleteAccount}
                                        errors={errors.deleteAccount}
                                    />

                                    <View style={[styles.profileContainer, { width: '100%', marginTop: 12, }]}>
                                        <View style={{ width: '50%' }}>
                                            <Button style={{ marginRight: 10, backgroundColor: Colors.Black, height: 45, }}
                                                onPress={handleSubmit}
                                                primaryButton
                                                title='Yes'
                                            />
                                        </View>
                                        <View style={{ width: '50%' }}>
                                            <Button style={{ backgroundColor: Colors.Red, marginLeft: 10, height: 45, }}
                                                onPress={() => { setShowChangeCityModal(!showChangeCityModal) }}
                                                primaryButton
                                                title='Cancel'
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
        )
    };

    const getNotification = () => {
        instance.post('/get_notification_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setNotificationCount(userData?.total_record);
            }
        }).catch(error => {
            console.log('getNotification=====catch=====', error);
        });
    }

    const deleteAccount = () => {
        setIsLoding(true);
        instance.post('/customer_delete_account', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON?.parse(response?.data);
            if (userData.status === 'success') {
                dispatch(logoutSucces());
                await AsyncStorage.setItem("userData", '');
                navigation.navigate('BlankScreen', { "goto": 'Home' });
            }
            else {
                ToastError(userData?.message);
            }
            setIsLoding(false);
            setShowChangeCityModal(!showChangeCityModal);

        }).catch(error => {
            setIsLoding(false);
            setShowChangeCityModal(!showChangeCityModal);
            AlertError(Strings.Other.catchError);
        });
    };

    useEffect(() => {
        getNotification()
        if (focus == true) {
            getNotification()
            setProfileImage(authData.data?.profile_image ? authData.data?.profile_image : '')
        }
    }, [focus, profileImage]);

    const otherData = [
        {
            id: '2',
            'title': 'Order History',
            'icon': ImagePath.MyAccountMenu.order,
            'goto': 'OrderHistory'
        },
        {
            id: '3',
            'title': 'Add Reminder',
            'icon': ImagePath.MyAccountMenu.reminder,
            'goto': 'Calender'

        },
        {
            id: '4',
            'title': 'My Wishlist',
            'icon': ImagePath.MyAccountMenu.wishlist,
            'goto': 'Wishlist'
        },
        {
            id: '5',
            'title': 'Address Book',
            'icon': ImagePath.MyAccountMenu.addressbook,
            'goto': 'AddressBook'
        },
        // {
        //     id: '6',
        //     'title': 'Rate & Review',
        //     'icon': ImagePath.MyAccountMenu.ratting,
        //     'goto': ''
        // },
        {
            id: '7',
            'title': 'Change Password',
            'icon': ImagePath.MyAccountMenu.changepass,
            'goto': 'ChangePassword'
        },
        {
            id: '8',
            'title': 'Notifications',
            'icon': ImagePath.MyAccountMenu.notification,
            'goto': 'Notification'
        },
        {
            id: '9',
            'title': 'Delete Account',
            'icon': ImagePath.MyAccountMenu.logout,
            'goto': 'delete-account',

        },
    ];

    const selectData = (val) => {
        setSelected(val)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {isLoding ?
                <Loader mainContainer={{ marginTop: 5 }} loadStyle={{ elevation: 0 }} />
                :
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: Colors.Secondary.Black, height: hp('37%') }}>
                        <View style={[styles.goback]}>
                            <TouchableOpacity onPress={() => { closeScreen() }} hitSlop={styles.hitSlop} >
                                <Icon source={ImagePath.MyAccountMenu.crossPink} style={styles.backicon} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.topContainer]}>
                            <View style={[styles.profileimage, {}]}>
                                <FastImage
                                    style={[styles.profileimageicon]}
                                    source={(profileImage == undefined || profileImage === '') || (authData.data?.slug == undefined) ? ImagePath.Other.emptyUser : {
                                        uri: profileImage,
                                        priority: FastImage.priority.high,
                                        cache: FastImage.cacheControl.immutable
                                    }}
                                    tintColor={profileImage ? null : Colors.Primary.Camel}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>

                            <View style={[styles.profileRightContainer]}>
                                <Label style={[styles.userName, { fontSize: getFontSize(20) }]} text={authData.data?.full_name} />
                                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: Size.xs1 }}>
                                    <Button
                                        style={styles.editButtonContainer}
                                        onPress={() => { navigation.navigate('EditMyProfile') }}
                                        swiperButton
                                        Images={ImagePath.MyAccountMenu.edit}
                                        ImagesStyle={styles.editButton}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.profileBottomContainer}>
                        <FlatList
                            data={otherData}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) =>
                                <View style={{}}>
                                    <TouchableOpacity
                                        style={[styles.profileContainer, styles.RowColumnItem]}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            selectData(item.id), item?.goto == '' ? '' : item.goto === 'Dashboard'
                                                ? navigation.navigate('DashboardStack', { screen: "Dashboard" }) : item.goto === 'delete-account'
                                                    ? setShowChangeCityModal(!showChangeCityModal) : navigation.navigate(item?.goto)
                                        }}>
                                        <Icon style={[styles.RowColumnIcon, { tintColor: item.id == selected ? Colors.Camel : Colors.Black }]} source={item.icon} />
                                        <Label text={item.title} style={[styles.RowColumnItemlabel, { color: item.id == selected ? Colors.Camel : Colors.Black }]} />
                                        {/* {(item?.title === 'Notifications' && getNotificationCount > 0) &&
                                            <View style={{ borderWidth: 2, borderColor: Colors.Camel, borderRadius: 100, padding: 4, marginLeft: 25 }}>
                                                <Label text={getNotificationCount} style={{ color: Colors.Camel }} />
                                            </View>} */}
                                    </TouchableOpacity>
                                    <Spacer style={[styles.boderView, { borderWidth: otherData?.length - 1 == index ? 0 : 0.5 }]} />
                                </View>
                            }
                        />
                    </View>
                </View>}
            {showChangeCityModal == true && deleteAccountPopup()}
        </SafeAreaView >
    )
};