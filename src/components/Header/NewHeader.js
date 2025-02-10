import React, { memo, useEffect, useState, } from "react";
import { StyleSheet, View, TouchableOpacity, Keyboard, Modal, ScrollView, SafeAreaView, Platform, BackHandler, Dimensions } from 'react-native';
import { Icon, RegularLabel, Size, BoldLabel, Strings, ImagePath, Colors, HeaveyLabel } from "../../constants";
import { useNavigation } from '@react-navigation/native';
import { instance } from '../../utils';
import { useDispatch, useSelector } from "react-redux";
import { setCounrtyData } from "../../features"
import { InputTextHome } from "../InputText/InputText";
// import { navigationRef } from "../../navigation/AppNavigation/AppNavigation";
import { AlertError } from "../ToastNotification/ToastNotification";
import { navigationRef } from "../../lib/navigationService";

const { width, height } = Dimensions.get('screen');

const NewHeader = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const countryData = useSelector((state) => state.country);
    const [getCurrData, setGetCurrData] = useState([]);
    const [selected, setSelected] = useState(false)
    const [currCurrency, setCurrCurrency] = useState(countryData.country.currency_symbol ? countryData.country.currency_symbol : '');
    const [openPopup, setOpenPopup] = useState(false);
    let oldCountryData;
    let newCountryData;
    let currCountryData;

    const {
        title,
        titleStyle,
        exploreIcon,
        optionTag,
        optionOnPress,
        optionContainer,
        source,
        iconStyle,
        label,
        labelStyle,
        ClabelStyle,
        Clabel,
        ClearOnPress,
        clearStyle,
        wishListShow,
        onPress
    } = props;

    const heart = require('../../assets/Images/Home/heart.png');

    let screenName = navigationRef.current?.getCurrentRoute().name
    const likeFun = () => {
        setSelected(!selected)
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSelected(false);
        });

        return unsubscribe;
    }, [navigation]);

    const getCurrency = (data) => {
        instance.post('/get_currency_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setGetCurrData(userData?.result)
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError)
        });
    };

    useEffect(() => {
        getCurrency();
    }, [])

    const [searchData, setSearchData] = useState('');
    const [searchError, setSearchError] = useState('');

    const searchOrder = () => {
        if (searchData === '' || searchData == undefined) {
            setSearchError('Please enter product name.')
        } else {
            Keyboard.dismiss();
            setSearchError('');
            {
                screenName != "Listing" ? navigation.navigate('Listing', { "searchStr": searchData })
                    :
                    navigation.replace("Listing", { "searchStr": searchData })
            }
        }
    }

    const togglePopup = () => {
        setOpenPopup(!openPopup);
    };

    const goToNextScreen = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={{ backgroundColor: Colors.White, }}>
            <View style={[styles.mainContainer, {
                paddingVertical: title == 'Home' || title == 'Landing' || title == 'Message Card' ? 15 : 13,
                paddingLeft: title == 'Home' || title == 'Landing' ? 7 : 10,
            }]}>
                {title == 'Home' || title == 'Landing' ?
                    <View style={{ flexDirection: "row", flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ top: 2 }} hitSlop={styles.hitSlop} activeOpacity={0.7}>
                            <Icon source={ImagePath.Home.menu} style={{ width: 35, height: 30 }} />
                        </TouchableOpacity>

                        < View style={{ marginLeft: 8, }}>
                            <Icon source={ImagePath.Intro.splashLogoUpdated} style={{ height: 38, width: 145 }} />
                        </View>
                    </View>
                    :
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <TouchableOpacity activeOpacity={0.7} onPress={onPress ? onPress : () => goToNextScreen()}
                            style={{}} hitSlop={styles.hitSlop}>
                            <Icon source={ImagePath.Other.arrow_left_header} style={[styles.iconStyle, { width: 24 }]} />
                        </TouchableOpacity>

                        {title == 'Message Card' ?
                            <View style={{ marginLeft: Size.xm, width: "85%" }}>
                                <BoldLabel title={title} boldStyle={[titleStyle, { fontSize: 18 }]}
                                    numberOfLines={1}
                                />
                            </View>
                            : <View style={{ marginLeft: 8, }}>
                                <Icon source={ImagePath.Intro.splashLogoUpdated} style={{ height: 38, width: 145 }} />
                            </View>}
                        {/* <View style={{ marginLeft: Size.xm, }}>
                            <Icon source={ImagePath.Intro.splashLogoUpdated} style={styles.logoStyle} />
                        </View> */}
                        {/* <View style={{ marginLeft: Size.xm, width: "85%" }}>
                            <BoldLabel title={title} boldStyle={[titleStyle, { fontSize: 18 }]}
                                numberOfLines={1}
                            />
                        </View> */}
                    </View>
                }

                {exploreIcon &&
                    // <View style={[styles.exploreFunctionality, { width: wishListShow ? 70 : 110 }]}>
                    <View style={[styles.exploreFunctionality, { paddingRight: wishListShow ? 0 : 13 }]}>
                        {title === 'Shopping Cart' ? null :
                            < TouchableOpacity activeOpacity={0.7} disabled={getCurrData.length != '' ? false : true}
                                onPress={() => togglePopup()} style={styles.currencyMainContainer} hitSlop={styles.hitSlop}>
                                <HeaveyLabel title={countryData.country.currency_symbol ? countryData.country.currency_symbol : currCurrency} heaveyStyle={{ fontSize: 6.2 }} />
                            </TouchableOpacity>}

                        <TouchableOpacity style={{ marginHorizontal: 14 }} activeOpacity={0.7} onPress={() => likeFun()} hitSlop={styles.hitSlop}>
                            <Icon source={selected == true ? ImagePath.Home.close : ImagePath.Other.searchIcon} style={{ height: selected ? 18 : 20, width: selected ? 18 : 20 }} />
                        </TouchableOpacity>

                        {!wishListShow ? <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Wishlist')} hitSlop={styles.hitSlop}>
                            <Icon source={heart} style={styles.iconStyle} />
                        </TouchableOpacity> : null}
                    </View>
                }
                {
                    optionTag ?
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity activeOpacity={0.6} onPress={optionOnPress} style={optionContainer} hitSlop={styles.hitSlop}>
                                <Icon source={source} style={iconStyle} />
                                <BoldLabel title={label} boldStyle={labelStyle} />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.6} onPress={ClearOnPress} style={clearStyle}>
                                <BoldLabel title={Clabel} boldStyle={ClabelStyle} />
                            </TouchableOpacity>
                        </View>
                        : null
                }
            </View>
            {
                selected && (
                    <View style={{ marginBottom: 10 }}>
                        <InputTextHome
                            style={{ fontSize: Size.xm2, borderColor: Colors.Secondary.Black }}
                            placeholderColor='#000'
                            Image={ImagePath.Home.searchIcon}
                            placeholder={Strings.Home.search}
                            onChangeText={(e) => { setSearchData(e), setSearchError('') }}
                            onPress={searchOrder}
                            searchError={searchError}
                            onSubmitEditing={searchOrder}
                        />
                    </View>
                )
            }

            <View style={[styles.borderView, { height: title == 'Home' || title == 'Landing' ? 0 : Size.xs, }]} />

            {
                openPopup &&
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={openPopup}
                    onRequestClose={() => {
                        setOpenPopup(false);
                    }}>

                    <TouchableOpacity onPress={() => setOpenPopup(false)}
                        style={{ backgroundColor: 'rgba(0,0,0,0.05)', flex: 1, alignItems: 'flex-end' }} activeOpacity={10}>

                        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>

                            {getCurrData.length != '' && getCurrData?.map((item, index) => {
                                const isLastIndex = index === getCurrData.length - 1;
                                return (

                                    <View key={item._id}>
                                        <TouchableOpacity onPress={() => {
                                            oldCountryData = countryData.country,
                                                newCountryData = {
                                                    "currency_symbol": item.currency_code
                                                },
                                                // navigation.navigate('BlankScreen', { "goto": title, "menu_url": item })
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
                        </ScrollView>
                    </TouchableOpacity>
                </Modal>
            }
        </SafeAreaView >
    )
}

export default memo(NewHeader)

const styles = StyleSheet.create({
    logoStyle: {
        width: 80,
        height: 20,
        // backgroundColor: "red"
    },
    headerContainer: {
        paddingHorizontal: '3%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContainer: {
        backgroundColor: Colors.White,
        flexGrow: 0.4,
        marginTop: Platform.OS == 'ios' ? height * 0.11 : height * 0.0790,
        marginRight: 11,
        elevation: 3,
        zIndex: 5,
    },
    currencyContainer: {
        width: 200,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: 'center',
    },
    mainContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    exploreFunctionality: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    currencyMainContainer: {
        borderWidth: 1.5,
        borderColor: Colors.Black,
        borderRadius: 15,
        padding: 2,
        height: 23,
        width: 24,
        justifyContent: "center",
        alignItems: "center"
    },
    borderView: {
        marginTop: 0,
        backgroundColor: Colors.GreyGo,
    },
    iconStyle: {
        height: 20, width: 22
    },
    hitSlop: {
        top: 8,
        bottom: 8,
        left: 8,
        right: 8
    }
})