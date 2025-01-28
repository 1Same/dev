import React, { memo, useEffect, useRef, useState, } from "react";
import { View, TouchableOpacity, StyleSheet, FlatList, Dimensions, SafeAreaView } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { RowColumn, Button, NewInputText } from "../";
import { Strings, Typography, Colors, ImagePath, Size, Icon, Label, Spacer } from "../../constants";
import { instance } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setCounrtyData } from "../../features"
import { useNavigation, useIsFocused } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { height } = Dimensions.get('window');

const BottomSheet = (props) => {

    const { isLoading, openSheet = false } = props;
    const refRBSheet = useRef();
    const refRBSheet2 = useRef();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const countryData = useSelector((state) => state.country);
    const selectCountry = [`${Strings.Home.withinLoc}${countryData.country?.default_country_name}`, `${Strings.Home.outsideLoc}${countryData.country?.default_country_name}`];
    const [checked, setChecked] = useState(0);
    const [deliveryData, setDeliveryData] = useState([]);
    const [cityError, setCityError] = useState('');
    const [locationData, setLocationData] = useState([]);
    const [searchCtyOrCountry, setSearchCtyOrCountry] = useState('');
    const [showCityOrCountry, setShowCityOrCountry] = useState([]);
    const isFocused = useIsFocused();

    const getCountryData = () => {
        instance.post('/delivery_country', {
            req: { "data": { show_on: "show_on_modal" } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData?.status === 'success') {
                setLocationData({ "countryList": userData.deliveryCountries, "cityList": userData.deliveryCity, "image_url": userData.image_url, "allCities": userData?.allCities, 'city_image_url': userData?.city_image_url })
                setShowCityOrCountry({ "allCities": userData?.allCities, "countryList": userData.deliveryCountries, })
            }
        }).catch(error => {
            console.log("getCountryData catch error----------", error);
        });
    };

    useEffect(() => {
        async function fatchData() {
            if (openSheet == true) {
                refRBSheet.current.open();
                await AsyncStorage.setItem('location', 'true')
            }
        }
        fatchData();
        setTimeout(() => {
            getCountryData();
        }, 1000);
    }, []);

    useEffect(() => {
        setDeliveryData([]);
        setChecked(0);
    }, [isFocused])

    const selectCountryFun = (ress) => {
        console.log("ress---", ress)
        ress["checked"] = checked
        ress["flag_image"] = locationData.image_url + ress["country_mobile_image"]
        setDeliveryData(ress)
        if (checked == 0) {
            ress.city_name ? setCityError('') : setCityError('please select city')
        } else {
            ress.country_name ? setCityError('') : setCityError('please select Country')
        }
        refRBSheet2.current.close();
    };

    const setLocation = () => {
        if (checked == 0 && deliveryData?.city_name == undefined) {
            deliveryData.city_name ? setCityError('') : setCityError('please select city');

        } else if (checked == 1 && deliveryData?.country_name == undefined) {
            deliveryData.country_name ? setCityError('') : setCityError('please select Country');
        } else {
            if (cityError == '' && (deliveryData?.city_name || deliveryData?.country_name)) {
                let oldCountryData = countryData?.country
                let newCountryData = {
                    "country_id": deliveryData.country_id,
                    "country_image": deliveryData.country_mobile_image,
                    "image_url": locationData.image_url,
                    "menu_url": deliveryData.menu_url,
                    "isFromLandingPage": deliveryData?.menu_url?.page_type == "landing" ? true : false,
                }

                if (checked == 0) {
                    newCountryData["city_name"] = deliveryData.city_name
                    newCountryData["city_id"] = deliveryData.city_id
                    newCountryData["country_name"] = oldCountryData["default_country_name"]
                    newCountryData["country_iso_code"] = oldCountryData["default_country_iso_code"]
                } else {
                    newCountryData["city_name"] = ""
                    newCountryData["city_id"] = ""
                    newCountryData["country_name"] = deliveryData.country_name
                    newCountryData["country_iso_code"] = deliveryData.country_iso_code
                }

                let currCountryData = { ...oldCountryData, ...newCountryData };
                dispatch(setCounrtyData(currCountryData))
                refRBSheet.current.close();

                if (deliveryData?.menu_url?.page_type == "listing") {
                    navigation.navigate('Listing', { "menu_url": deliveryData?.menu_url })
                } else {
                    navigation.navigate('BlankScreen', { "goto": 'Landing' })
                }
            }
        }
    };

    const getCityName = () => {
        if (countryData.country?.city_id && countryData.country?.city_name) {
            return countryData.country?.city_name
        } else if (countryData.country?.default_country_id && countryData.country?.country_id && countryData.country?.country_name && countryData.country?.default_country_id != countryData.country?.country_id) {
            return countryData.country?.country_name
        }
        else {
            return Strings.Home.selectLocation
        }
    }

    const searchData = (searchVal = '') => {
        const dataToFilter = checked === 0 ? locationData?.allCities || [] : locationData?.countryList || [];
        const result = dataToFilter.filter((item) =>
            checked === 0
                ? item.city_name?.toLowerCase().includes(searchVal.toLowerCase())
                : item.country_name?.toLowerCase().includes(searchVal.toLowerCase())
        );
        if (checked === 0) {
            setShowCityOrCountry({ countryList: locationData?.countryList, allCities: result });
        } else {
            setShowCityOrCountry({ allCities: locationData?.allCities, countryList: result });
        }
    };

    return (
        <SafeAreaView>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {isLoading == true ?
                    <SkeletonPlaceholder >
                        <SkeletonPlaceholder.Item height={39} borderRadius={8} marginHorizontal={11} />
                    </SkeletonPlaceholder>
                    :
                    (!openSheet != null && openSheet != false) &&
                    <View style={styles.rowColumn}>
                        <RowColumn
                            onClick={() => refRBSheet.current.open()}
                            style={styles.icon}
                            Image={{ "countryFlag": 'countryFlag' }}
                            boder
                        />

                        <TouchableOpacity onPress={() => refRBSheet.current.open()}
                            style={[styles.shapeIconView, { height: '100%' }]} activeOpacity={0.7}>
                            <RowColumn
                                style={styles.locationIcon}
                                Image={ImagePath.Home.location}
                                label={getCityName()}
                                labelStyle2={{ fontSize: 12, fontFamily: Typography.LatoMedium }}
                                disabled={true}
                            />
                            <Icon style={styles.shapeIcon} source={ImagePath.Home.shape} />
                        </TouchableOpacity>
                    </View>}

                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    animationType='fade'
                    height={height * 0.40}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'rgba(0,0,0,0.6)'
                        },
                        container: {
                            borderTopLeftRadius: Size.l,
                            borderTopRightRadius: Size.l
                        },
                        draggableIcon: {
                            backgroundColor: "#fff"
                        }
                    }}
                >
                    <View style={styles.rbSheetContainer}>
                        <TouchableOpacity onPress={() => refRBSheet.current.close()}
                            style={{ width: '100%', alignItems: 'flex-end' }} hitSlop={styles.hitSlop}>
                            <Icon style={styles.croseIcon} source={ImagePath.Home.crossPink} />
                        </TouchableOpacity>

                        <Label style={styles.topTitle} text={Strings.Home.selectD} />
                        <View style={{ marginTop: Size.xs3 }}>
                            <Label style={styles.productTitle} text={Strings.Home.selectaProductAvailability} />
                        </View>

                        <Spacer />

                        <View style={styles.radioButtonContainer}>
                            {selectCountry?.map((countryName, key) => {
                                return (
                                    <View key={countryName}>
                                        <RowColumn
                                            onClick={() => { setChecked(key), setDeliveryData([]), setCityError(''), setSearchCtyOrCountry('') }}
                                            touchableStyle={[styles.radioButtonView]}
                                            style={styles.radioIcon}
                                            labelStyle2={styles.radioTitle}
                                            Image={checked == key ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite}
                                            label={countryName}
                                        />
                                    </View>
                                )
                            })}
                        </View>

                        <TouchableOpacity onPress={() => {
                            refRBSheet2.current?.open()
                            setSearchCtyOrCountry('')
                            searchData('')
                        }}
                            style={styles.selectCountry} activeOpacity={0.6} >
                            <Label style={styles.selectCountryTitle} text={
                                checked === 0 ? deliveryData.city_name ?
                                    deliveryData.city_name : Strings.Other.selectCity : deliveryData.country_name ?
                                    deliveryData.country_name : Strings.Other.selectCountry
                            } />
                            <Icon style={styles.shapeIcon} source={ImagePath.Home.shape} />
                        </TouchableOpacity>
                        <Label style={{ fontSize: 12, color: Colors.Red }} text={cityError} />
                        <Spacer style={styles.spacer} />
                        <Button
                            style={{ height: Size.x48, backgroundColor: Colors.Secondary.Black }}
                            onPress={() => setLocation()}
                            primaryButton
                            title={Strings.Home.continueShopping}
                        />
                    </View>

                    <RBSheet
                        ref={refRBSheet2}
                        closeOnDragDown={true}
                        closeOnPressMask={true}
                        height={height * 0.40}
                        customStyles={{
                            wrapper: {
                                backgroundColor: 'rgba(0,0,0,0)'
                            },
                            container: {
                                borderTopLeftRadius: Size.l,
                                borderTopRightRadius: Size.l
                            },
                            draggableIcon: {
                                backgroundColor: "#fff"
                            }
                        }}
                    >
                        <SafeAreaView style={{ flex: 1 }}>
                            {checked == 0 &&
                                <View style={{ justifyContent: 'center', paddingHorizontal: 20, marginVertical: 5 }}>
                                    <Label style={{ fontSize: 20, fontFamily: Typography.LatoBold }} text={Strings.Other.allCities} />
                                </View>}

                            <NewInputText
                                containerStyle={{ height: 42, borderColor: Colors.Camel, marginTop: 5 }}
                                placeholder={`Search Delivery ${checked === 0 ? 'City' : 'Country'}`}
                                name="Search"
                                value={searchCtyOrCountry}
                                onChangeText={(text) => {
                                    setSearchCtyOrCountry(text);
                                    searchData(text);
                                }}
                            />
                            {/* <Spacer style={styles.citiesTopBorder} /> */}

                            <FlatList
                                data={checked == 0 ? locationData.cityList : showCityOrCountry.countryList}
                                showsVerticalScrollIndicator={false}
                                ListFooterComponent={
                                    (checked == 0 && locationData?.allCities?.length > 0) &&
                                    <FlatList
                                        data={showCityOrCountry?.allCities}
                                        showsVerticalScrollIndicator={false}
                                        scrollEnabled={false}
                                        ListFooterComponent={<Spacer />}
                                        renderItem={({ item }) => {
                                            return (
                                                < RowColumn
                                                    onClick={() => selectCountryFun(item)}
                                                    touchableStyle={[styles.selectCountryView, { marginLeft: 8 }]}
                                                    // Image={(checked == 0 && item?.city_image) ? { uri: locationData?.image_url + item?.city_image } : ''}
                                                    label={item?.city_name}
                                                />
                                            )
                                        }}
                                    />
                                }
                                renderItem={({ item, index }) => {
                                    let country = locationData.countryList?.length - 1 == index
                                    return (
                                        <View style={{ marginBottom: checked == 1 ? country ? 25 : 10 : 2 }}>
                                            {item?.country_name != 'India' &&
                                                < RowColumn
                                                    onClick={() => selectCountryFun(item)}
                                                    touchableStyle={[styles.selectCountryView, { marginTop: checked == 0 ? 10 : 13, padding: 0, }]}
                                                    Image={(checked == 0 && item?.city_image) ? { uri: locationData?.city_image_url + item?.city_image } : checked == 1 && { "countryCode": item?.country_iso_code }}
                                                    label={checked == 0 ? item?.city_name : item?.country_name}
                                                />
                                            }
                                        </View>
                                    )
                                }}
                            />
                        </SafeAreaView>
                    </RBSheet>
                </RBSheet >
            </KeyboardAwareScrollView>
        </SafeAreaView >
    )
}
export default memo(BottomSheet);

const styles = StyleSheet.create({
    rowColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.FantasyNew,
        height: 39,
        paddingLeft: 13,
        paddingRight: 8,
        flex: 1,
        borderWidth: 0.5,
        borderColor: Colors.CreamBrulee,
        marginHorizontal: 11,
        borderRadius: 8
    },
    locationIcon: {
        width: Size.m,
        height: Size.l,
    },
    icon: {
        width: Size.xxll,
        height: Size.xxll
    },
    uaeIconStyle: {
        height: Size.xxxl,
        width: Size.xxxl
    },
    croseIcon: {
        width: Size.m1,
        height: Size.m1
    },
    rbSheetContainer: {
        paddingHorizontal: Size.m0,
        bottom: Size.xm1,
    },
    topTitle: {
        fontSize: Size.xl,
        fontFamily: Typography.LatoBold
    },
    productTitle: {
        fontSize: Size.m0,
        color: Colors.Mirage
    },
    radioButton: {
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderRadius: Size.xxl,
        height: Size.xxl,
        width: Size.xxl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioIcon: {
        width: Size.xl,
        height: Size.xl,
    },
    radioButtonContainer: {
        width: '80%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectCountry: {
        borderWidth: 1,
        borderColor: '#58585880',
        height: Size.x63,
        borderRadius: Size.xs1,
        paddingHorizontal: Size.xm1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: Size.l
    },
    selectCountryTitle: {
        fontSize: Size.m1
    },
    shapeIcon: {
        width: Size.xs2,
        height: Size.xm1 + 1
    },
    spacer: {
        marginTop: Size.xxl
    },
    radioTitle: {
        fontSize: Size.m0,
        fontFamily: Typography.LatoBold
    },
    radioButtonView: {
        flexDirection: 'row'
    },
    selectCountryView: {
        padding: 9,
        flex: 1,
        marginLeft: 18
    },
    shapeIconView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
    },
    hitSlop: {
        top: 8,
        bottom: 8,
        left: 8,
        right: 8
    },
    citiesTopBorder: {
        borderWidth: 1,
        width: '94%',
        height: 0.2,
        marginVertical: 10,
        backgroundColor: Colors.GreyGoose,
        marginLeft: '3%',
    },
});