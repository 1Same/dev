import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Modal, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Icon, RegularLabel, Size, BoldLabel, ImagePath } from "../../constants";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { instance } from '../../utils';
import { useDispatch, useSelector } from "react-redux";
import { setCounrtyData } from "../../features"
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


export default Header = (props) => {

    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const authData = useSelector((state) => state.auth);
    const countryData = useSelector((state) => state.country);
    const [getCurrData, setGetCurrData] = useState([]);
    const [currCurrency, setCurrCurrency] = useState(countryData.country.currency_symbol || '');
    const [notificationCount, setNotificationCount] = useState(0);
    const [openPopup, setOpenPopup] = useState(false);
    let oldCountryData;
    let newCountryData;
    let currCountryData;

    const menu = require('../../assets/Images/Home/Icon.png');
    const uaeflowerslogo = require('../../assets/Images/Home/uaeflowers-logo.png');
    const heart = require('../../assets/Images/Home/heart.png');
    const downArrow = require('../../assets/Images/Other/downArrow.png');

    const getNotification = () => {
        instance.post('/get_notification_list', {
            req: { "data": { "page": 1 } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                if (userData.result.length != 0) {
                    setNotificationCount(userData.result.length)
                } else {
                    // ToastError(userData?.message)
                }
            }
        }).catch(error => {
            // AlertError(error.toString())
        });
    }

    useEffect(() => {
        if (isFocused == true) {
            getNotification();
        }
    }, [isFocused])

    const getCurrency = (data) => {
        instance.post('/get_currency_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setGetCurrData(userData.result)
            }
            else {
                // ToastError('Failed to load')
            }

        }).catch(error => {
            // AlertError(Strings.Other.catchError)
        });
    };

    useEffect(() => {
        getCurrency();
    }, [])


    return (
        <SafeAreaView style={{ height: 60, justifyContent: "center" }}>
            <View style={{ paddingHorizontal: '3%', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.6}>
                        <Icon style={styles.menuIcon} source={menu} />
                    </TouchableOpacity>

                    <View style={{ bottom: 3, marginLeft: 6, }}>
                        <Image style={{}} source={uaeflowerslogo} resizeMode="cover" />
                    </View>

                </View>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Notification')} activeOpacity={0.6} hitSlop={styles.hitSlop}>
                        <Icon style={{ width: 28, height: 28 }} source={ImagePath.Other.notificationBell} />
                        {notificationCount > 0 && authData.data?.slug ? (
                            (<View style={styles.badgeContainer}>
                                <Text style={{}}>{notificationCount}</Text>
                            </View>)
                        ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setOpenPopup(!openPopup)} style={styles.currDropdownStyle} >
                        <Text style={{ color: Colors.Black }}>{currCurrency}</Text>
                        <Icon source={downArrow} style={styles.currencyDropdownIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{}} activeOpacity={0.6} onPress={() => navigation.navigate('Wishlist')} hitSlop={styles.hitSlop}>
                        <Icon style={styles.likeIcon} source={heart} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* {getCurrData != '' && openPopup && */}
            {openPopup &&
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={openPopup}
                    onRequestClose={() => {
                        setOpenPopup(false);
                    }}>

                    {/* <TouchableWithoutFeedback onPress={() => setOpenPopup(false)} > */}
                    <TouchableOpacity onPress={() => setOpenPopup(false)} activeOpacity={0.7} style={{ backgroundColor: 'rgba(0,0,0,0.05)', flex: 1, alignItems: 'flex-end' }} >
                        <ScrollView style={styles.scrollContainer}>
                            {/* <TouchableOpacity activeOpacity={10} disabled={false}> */}
                            {getCurrData?.map((item, index) => {
                                const isLastIndex = index === getCurrData.length - 1;
                                return (
                                    <View key={item._id}>
                                        <TouchableOpacity onPress={() => {
                                            oldCountryData = countryData.country,
                                                newCountryData = {
                                                    "currency_symbol": item.currency_code
                                                },
                                                currCountryData = { ...oldCountryData, ...newCountryData },
                                                dispatch(setCounrtyData(currCountryData)),
                                                setCurrCurrency(item.currency_code),
                                                setOpenPopup(false)
                                        }}
                                            style={[styles.currencyContainer]} activeOpacity={0.6} >
                                            <View style={{ width: 40 }}>
                                                <BoldLabel title={item.sign} boldStyle={{ fontSize: 13, }} />
                                            </View>
                                            <RegularLabel title={`${item.currency_code} ${'-'} ${item.title}`} regularStyle={{ fontSize: 12 }} />
                                        </TouchableOpacity>
                                        {!isLastIndex && <Spacer style={{ marginTop: 0, height: 1, backgroundColor: Colors.RegentGrey }} />}
                                    </View>
                                )
                            })}
                            {/* </TouchableOpacity> */}
                        </ScrollView>
                    </TouchableOpacity>
                    {/* </TouchableWithoutFeedback> */}
                </Modal>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: '3%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        width: Size.xxxl,
    },
    badgeContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 15,
        minHeight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    uaeflowerslogo: {
        width: 20,
        height: 35,
    },
    likeIcon: {
        width: Size.xl,
        height: Size.l
    },
    dropdown: {
        width: 100,
    },
    currencyContainer: {
        width: 200,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: 'center',
    },
    currencyDropdownIcon: {
        width: 10,
        height: 10
    },
    currDropdownStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 2,
        width: 60,
        marginHorizontal: 5
    },
    scrollContainer: {
        backgroundColor: Colors.White,
        flexGrow: 0.4,
        marginTop: Platform.OS == 'ios' ? 106 : 60,
        marginRight: 15,
        elevation: 2,
        zIndex: 5
    },
    hitSlop: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    }
})



