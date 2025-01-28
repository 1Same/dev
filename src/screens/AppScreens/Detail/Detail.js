import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, Platform, UIManager, Dimensions, Image, ScrollView, TouchableOpacity, ImageBackground, Modal, FlatList, TextInput, TouchableWithoutFeedback, Keyboard, AccessibilityActionInfo, findNodeHandle, Text } from 'react-native';
import styles from "./styles";
import stylesList from "../Listing/styles";
import { Button, Loader, ToastSuccess, ToastError, AlertError, RowColumn, ProductList, NewHeader, ProgressiveImage, ReviewRatingDetail, NewInputText } from "../../../components";
import { Size, Colors, Strings, Icon, ImagePath, BoldLabel, RegularLabel, Label, Spacer, Typography, GlobalConstant } from "../../../constants";
import RBSheet from "react-native-raw-bottom-sheet";
import { Formik, } from "formik";
import * as yup from 'yup'
import { instance, apiFormPost } from "../../../utils";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from 'react-native-element-dropdown';
import giftStyle from "../AddGift/styles";
import { setCounrtyData } from "../../../features"
import ImagePicker from "react-native-image-crop-picker";
import CalendarPicker from 'react-native-calendar-picker';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import RenderHtml from 'react-native-render-html';
import { dateFormat } from "../../../lib";
import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get('screen');

export default Detail = ({ navigation, route }) => {

    const focus = useIsFocused();
    const refLocationRBSheet = useRef();
    const dispatch = useDispatch();
    const [selectState, setSelectState] = useState('');
    const [selectCity, setSelectCity] = useState('');
    const [selectLocation, setSelectLocation] = useState();
    const [select, setSelect] = useState(0);
    const [check, setUncheck] = useState({ productSlug: '', check: false });
    const [checkEggless, setUncheckeEggless] = useState(false);
    const [isLoding, setLoding] = useState();
    const [isLodeMore, setIsLodeMore] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [stateArr, setStateArr] = useState([]);
    const [datePic, setDatePic] = useState('');
    const [selectDelivery, setSelectDelivery] = useState('');
    const [selectTime, setSelectTime] = useState('');
    const [locationArr, setLocationArr] = useState([]);
    const [blockTimeData, setBlockTimeData] = useState([]);
    const [deliveryType, setDeliveryType] = useState();
    const [timeData, setTimeData] = useState([]);
    const [comboProductList, setComboProductList] = useState([]);
    const [productData, setProductData] = useState();
    const [comboData, setComboData] = useState();
    const [upgradeOptionData, setUpgradeOptionData] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectAlpha, setSelectAlpha] = useState('');
    const [productDetailBaseOnCity, setProductDetailBaseOnCity] = useState();
    const [isLoadeMore, setIsLoadeMore] = useState(false);
    const [isDateLodeMore, setIsDateLodeMere] = useState(false);
    const [isDeliveryTypeLodeMore, setIsDeliveryTypeLodeMore] = useState(false);
    const [wishListLoader, setWishListLoader] = useState(false);
    const [userData, setUserData] = useState();
    const [showChangeCityModal, setShowChangeCityModal] = useState(false);
    const [showComboData, setShowComboData] = useState(false);
    const [uploadImage, setUploadImage] = useState('');
    const [upgrageOption, setUpgrageOption] = useState('standard');
    const [cityId, setCityId] = useState();
    const [cartCityId, setCartCityId] = useState();
    const [zipCode, setZipCode] = useState('')
    const [deliveryTypes, setDeliveryTypes] = useState();
    const [deliveryTimes, setTimeTypes] = useState();
    const [zipCodeTogal, setZipCodeTogal] = useState(false);
    const [zipCodeError, setZipCodeError] = useState();
    const [descriptionTopbar, setDescriptionTopbar] = useState('Care Guide');
    const [openSheet, setOpenSheet] = useState(0);
    const [recentlyProduct, setRecentlyProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState();
    const [selectDateType, setSelectDateType] = useState(0);
    const [searchCtyOrCountry, setSearchCtyOrCountry] = useState('');
    const [showCountry, setShowCountry] = useState([]);
    const [showCity, setShowCity] = useState([]);
    const country = useSelector((state) => state.country);
    const authData = useSelector((state) => state.auth);
    const heartActiveIcon = require('../../../assets/Images/Other/heartActive.png');
    const dropdownIcon = require('../../../assets/Images/Other/downArrow.png');
    const formikRef = useRef(null);

    let productSlug = route.params?.menu_url ? route.params?.menu_url?.slug : route.params?.productSlug;
    let productId = route.params?.menu_url ? route.params?.menu_url?._id : route.params?.productId;

    const [productDataGift, setproductDataGift] = useState([]);
    const [addonData, setAddonData] = useState([]);
    const [imagePath, setImagePath] = useState();
    const [showAddonGift, setShowAddonGift] = useState(false);
    const [productSlide, setProductSlider] = useState([]);

    useEffect(() => {
        getDetailData('', false);
        getAddGiftList(false);
    }, [country?.country?.currency_symbol]);

    //get_product_details api
    const getDetailData = async (cityId = '', loadData = true) => {

        (cityId == '' && loadData == false) && setWishListLoader(prev => ({ ...prev, 'singleWishList': true, }))
        loadData == true ? setLoding(true) : setLoding(false);

        instance.post('/get_product_details', {
            req: { "data": { "product_slug": check?.productSlug ? check?.productSlug : productSlug, "city_id": cityId } }
        }).then(async (response) => {

            const userData = JSON.parse(response?.data)
            if (userData?.status === 'success') {
                setImageUrl(userData.image_path);
                setStateArr(userData?.productDeliveryCityList);
                setShowCity(userData?.productDeliveryCityList);
                setProductData(userData?.result);
                setComboProductList(userData?.comboProductList);
                setUserData(userData);
                setSelectCity(userData.city_data?.city_name ? userData.city_data?.city_name : '');
                setProductSlider([{ "image": userData?.result?.product_image, "_id": userData?.result._id }]);

                if (cityId == '') {
                    setCityId(userData.city_data?._id ? userData.city_data?._id : userData?.userCartData?.city_id);
                    setCartCityId(userData?.userCartData?.city_id);
                    setSelectState(userData?.userCartData?.city_name);
                } else {
                    setCityId(cityId);
                };

                if (userData?.result?.flower_display_varient === 1 && userData?.result?.varientopt === 1) {
                    setUpgradeOptionData([
                        { _id: 1, title: 'CLASSIC', description: userData.result?.dtqtext1, unSelectIcon: ImagePath.Other.flower, selctIcon: ImagePath.Other.flowerCamel, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' },
                        { _id: 2, title: 'DOUBLE THE QUANTITY', description: userData.result?.dtqtext2, unSelectIcon: ImagePath.Other.flowerBouquet, selctIcon: ImagePath.Other.flowersBouquetCamel, newPrice: userData?.result?.product_price_detail?.double_price, selectQuantity: 'double_the_quantity' },
                    ]);
                } else if (userData?.result?.varientopt === 2) {
                    setUpgradeOptionData([
                        { _id: 1, title: 'CLASSIC', description: userData.result?.ttvtext1, unSelectIcon: ImagePath.Other.flower, selctIcon: ImagePath.Other.flowerCamel, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' },
                        { _id: 2, title: 'DELUXE', description: userData.result?.ttvtext2, unSelectIcon: ImagePath.Other.flowerBouquet, selctIcon: ImagePath.Other.flowersBouquetCamel, newPrice: userData?.result?.product_price_detail?.deluxe_price, selectQuantity: 'deluxe' },
                        { _id: 3, title: 'PREMIUM', description: userData.result?.ttvtext3, unSelectIcon: ImagePath.Other.flowersPremiumBlack, selctIcon: ImagePath.Other.flowersPremium, newPrice: userData?.result?.product_price_detail?.premium_price, selectQuantity: 'premium' },
                    ]);
                } else if (userData?.result?.cake_display_varient === 1 && userData?.result?.cakevarientopt == 1) {
                    setUpgradeOptionData([
                        { _id: 1, title: 'CLASSIC', description: userData.result?.cakedtqtext1, unSelectIcon: ImagePath.Other.flower, selctIcon: ImagePath.Other.flowerCamel, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' },
                        { _id: 2, title: 'MAKE IT SPECAIL', description: userData.result?.cakedtqtext2, unSelectIcon: ImagePath.Other.flowerBouquet, selctIcon: ImagePath.Other.flowersBouquetCamel, newPrice: userData?.result?.product_price_detail?.special_price, selectQuantity: 'make_it_special' },
                    ])
                } else if (userData?.result?.cakevarientopt === 2) {
                    setUpgradeOptionData([
                        { _id: 1, title: 'CLASSIC', description: userData.result?.cakettvtext1, unSelectIcon: ImagePath.Other.flower, selctIcon: ImagePath.Other.flowerCamel, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' },
                        { _id: 2, title: 'MAKE IT SPECAIL', description: userData.result?.cakettvtext2, unSelectIcon: ImagePath.Other.flowerBouquet, selctIcon: ImagePath.Other.flowersBouquetCamel, newPrice: userData?.result?.product_price_detail?.mkspecial_price, selectQuantity: 'make_it_special' },
                        { _id: 3, title: 'Make IT EXTRA SPECAIL', description: userData.result?.cakettvtext3, unSelectIcon: ImagePath.Other.flowersPremiumBlack, selctIcon: ImagePath.Other.flowersPremium, newPrice: userData?.result?.product_price_detail?.mkextspecial_price, selectQuantity: 'make_it_extra_special' },
                    ]);
                } else {
                    setUpgradeOptionData([{ _id: 1, title: 'CLASSIC', description: userData.result?.dtqtext1, unSelectIcon: ImagePath.Other.flower, selctIcon: ImagePath.Other.flowerCamel, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' }])
                };
                setLoding(false)
                setWishListLoader(prev => ({ ...prev, 'singleWishList': false, "recentlyWishList": false, 'similarWishList': false, }))
                setIsLoadeMore(false);
            }
            else {
                console.log('productDetail else=========', userData?.message);
                ToastError(userData?.message);
            }
        }).catch(error => {
            console.log('catchError====Detail==', error);
            navigation.navigate('CatchError');
            setLoding(false);
            setIsLoadeMore(false);
            AlertError(Strings.Other.catchError);
        });
    };

    useEffect(() => {
        setSelectedProduct(productData?.product_image);
    }, [productData]);

    //delivery_country api
    const getCountryData = () => {
        instance.post('/delivery_country', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setShowCountry(userData?.deliveryCountries);
                setLocationArr(userData?.deliveryCountries);
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('catchError=====getCountryData=====', error);
        });
    };

    //check_product_detail_base_on_city api
    const productdetailbasecity = async (city_id) => {
        setIsLoadeMore(true);
        instance.post('/check_product_detail_base_on_city', {
            req: {
                "data": {
                    "city_id": city_id ? city_id : cityId,
                    "product_id": productId,
                    "country_id": country.country?.country_id,
                    "zip_code": userData?.website_data?.zip_based_delivery === 1 ? zipCode : ''
                }
            }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);

            if (userData?.status === 'success') {
                setBlockTimeData(userData);
                // setIsLoadeMore(false);
                setZipCodeTogal(userData.status === 'success' ? true : false);
                setZipCodeError(userData?.message);
            }
            else {
                ToastError(userData?.message);
                setZipCodeError(userData?.message)
                setIsLoadeMore(false)
            }
        }).catch(error => {
            console.log('productdetailbasecity=====catch======', error);
            AlertError(Strings.Other.catchError);
            setIsLoadeMore(false);
        });
    };

    const checkProductDetailBaseOnCity = (city_id) => {
        setIsLoadeMore(true);
        instance.post('/check_product_detail_base_on_city', {
            req: {
                "data": {
                    product_id: productId,
                    country_id: country.country?.country_id,
                    city_id: city_id ? city_id : cityId
                }
            }
        }).then(async (response) => {

            const userData = JSON.parse(response.data);

            if (userData.status === 'success') {
                setProductDetailBaseOnCity(userData?.result)
                productdetailbasecity(city_id);
            }
            else {
                setIsLoadeMore(false);
                ToastError(userData?.message);
            }
        }).catch(error => {
            console.log('checkProductDetailBaseOnCity=====catch======', error);
            setIsLoadeMore(false);
            AlertError(Strings.Other.catchError)
        });
    };

    // default country set 
    useEffect(() => {
        locationArr?.map((ress) => {
            if (ress?.country_id === country.country?.country_id) {
                setSelectLocation(ress?.country_name);
                AsyncStorage.setItem('country_id', country.country?.country_id);
            }
        });
    }, [locationArr, selectLocation, country,])

    // delivery_option_base_on_date api
    const deliveryOptionbaseDate = async (date) => {
        setIsDateLodeMere(true);
        instance.post('/delivery_option_base_on_date', {
            req: {
                "data": {
                    product_slug: productSlug,
                    city_id: cityId,
                    delivery_date: date,
                    product_id: productId
                }
            }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);

            if (userData.status === 'success') {
                userData?.result.length == 0 && ToastSuccess('Delivery not available on this date')
                setDeliveryType(userData);
                setIsDateLodeMere(false);
            }
            else {
                setIsDateLodeMere(false);
                ToastError(userData?.message);
            }
        }).catch(error => {
            console.log('deliveryOptionbaseDate=====catch======', error);
            AlertError(Strings.Other.catchError);
            setIsDateLodeMere(false);
        });
    };

    // delivery_time_base_on_shipping_method api
    const Deliverytimebaseshipping = async (shipping_Type) => {
        // console.log('Deliverytimebaseshipping===========');
        setIsDeliveryTypeLodeMore(true);
        setDeliveryTypes(shipping_Type)
        instance.post('/delivery_time_base_on_shipping_method', {
            req: {
                "data": {
                    product_slug: productSlug, city_id: cityId,
                    delivery_date: datePic, product_id: productId,
                    delivery_mode: shipping_Type
                }
            }
        }).then(async (response) => {

            const userData = JSON.parse(response.data);

            if (userData.status === 'success') {
                setTimeData(userData?.result);
                // console.log('userData?.result=====', userData?.result);

                if (userData?.result?.length == 1) {
                    formikRef?.current.handleChange('time')(userData?.result[0]?.timeSlot)
                    setSelectTime(userData?.result[0])
                    setTimeTypes(userData?.result[0]?.timeSlot)
                }
                setIsDeliveryTypeLodeMore(false);
            }
            else {
                setIsDeliveryTypeLodeMore(false);
                ToastError(userData?.message);
            }
        }).catch(error => {
            console.log('Deliverytimebaseshipping=====catch======', error);
            AlertError(Strings.Other.catchError);
            setIsDeliveryTypeLodeMore(false);
            setIsLoadeMore(false)
        });
    };

    // focus action useEffect
    useEffect(() => {
        if (focus == true) {
            getDetailData();
            getCountryData();
            recentlyRiewedProduct();
            setSelectCity('');
            setSelectTime('');
            setSelectDelivery('');
            setDatePic('');
            setShowChangeCityModal(false);
            setUncheck({ ...check, 'check': false });
            setZipCode('');
            setZipCodeTogal(false)
            setZipCodeError();
            setUploadImage();
            setSelectAlpha('');
            getAddGiftList();
            setTimeData([]);
        }
    }, [focus]);

    // togal description type array
    const expandData = [
        { _id: '1', description: Strings.detail.description, },
        { _id: '2', description: Strings.detail.flowerCareUnit, },
    ];

    //select Platform togal description
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    };

    // alphabet dropdown
    const data = [
        { value: 'A' }, { value: 'B' },
        { value: 'C' }, { value: 'D' },
        { value: 'E' }, { value: 'F' },
        { value: 'G' }, { value: 'H' },
        { value: 'I' }, { value: 'J' },
        { value: 'K' }, { value: 'L' },
        { value: 'M' }, { value: 'N' },
        { value: 'O' }, { value: 'P' },
        { value: 'Q' }, { value: 'R' },
        { value: 'S' }, { value: 'T' },
        { value: 'U' }, { value: 'V' },
        { value: 'W' }, { value: 'X' },
        { value: 'Y' }, { value: 'Z' },
    ];

    // default combo product id set function
    const comboFun = async (val) => {
        comboProductList?.map((res) => {
            const updateId = val == undefined ? comboProductList[0]?._id : val
            if (res?._id === updateId) {
                setComboData(res);
            }
        })
    };

    //default combo id set function
    useEffect(() => {
        comboFun();
    }, [comboProductList]);

    const getAddGiftList = async (islode) => {

        setLoding(islode == false ? false : true)
        instance.post('/get_addon_product_list', {
            req: { "data": { 'product_slug': productSlug, 'country_id': country.country?.country_id, 'city_id': cityId } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data)
            if (userData.status === 'success') {
                setproductDataGift(userData?.result);
                setImagePath(userData?.image_path);
                setLoding(false)
            } else {
                setLoding(false)
            }
        }).catch(error => {
            console.log('getAddGiftList==========catch=====', error);
            navigation.navigate('CatchError')
            setLoding(false);
            AlertError(Strings.Other.catchError);
        })
    };

    const openGallery = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                mediaType: 'photo',
            });
            const fileExtension = image.path.split('.').pop().toLowerCase();
            if (!GlobalConstant?.allowedFileTypes?.includes(fileExtension)) {
                formikRef.current.setErrors({ abpersonalisedMugs: 'Invalid file type,Only jpg,png,webp,or gif are allowed.' })
                return;
            }
            setUploadImage(image);
        } catch (error) {
            console.log('Image picker error:', error);
        }
    };

    const AddToCart = async (addonD) => {
        let cityName = (selectCity ? selectCity : (userData?.userCartData?.country_id === country?.country?.country_id) && (userData?.website_data?.zip_based_delivery === 0) ? selectState : '');
        const requestData = {
            product_slug: addonD?.concat(addonData),
            country_id: country.country?.country_id,
            city_id: cityId,
            delivery_date: datePic,
            delivery_mode: deliveryTypes,
            delivery_time: deliveryTimes,
            from_time: selectTime?.from_time,
            to_time: selectTime?.to_time,
        }
        apiFormPost("/add_to_cart", requestData, uploadImage, 'personalised_image').then(async (response) => {
            const userData = JSON?.parse(response?.data);
            if (userData?.status === 'success') {
                productDataGift?.length === 0 ? setShowAddonGift(false) : setShowAddonGift(!showAddonGift);
                let oldCityData = country?.country
                let newCityData = {
                    "city_name": cityName,
                    "city_id": cityId,
                    "isFromLandingPage": false
                }
                let currCityData = { ...oldCityData, ...newCityData };
                dispatch(setCounrtyData(currCityData))
                navigation?.navigate('ShoppingCart')
                setIsLodeMore(false);
            }
            else {
                console.log('userData else===========', userData?.message);
                ToastError(userData?.message);
                setIsLodeMore(false);
            }
        }).catch(error => {
            console.log('AddToCart======catch=====', error);
            AlertError(Strings.Other.catchError);
            setIsLodeMore(false);
        });
    };

    const productRequestData = {
        "_id": productId,
        "upgrade_option": upgrageOption,
        "shipping_for": 'city',
        "add_vase": check?.check == true ? 1 : 0,
        "add_eggless": checkEggless == true ? 1 : 0,
        "slug": productSlug,
        "quantity": '',
        "action_type": 'add',
        "is_personalised_product": uploadImage ? 1 : 0,
        "alphabet_name": selectAlpha ? selectAlpha : '',
    };

    const addAddon = (item) => {
        let updatedData = [...addonData, {
            "_id": item?._id,
            "slug": item?.slug,
            "quantity": 1,
            "upgrade_option": "standard",
            "action_type": "add",
            "is_personalised_product": 0,
        }];
        setAddonData(updatedData);
    };

    const updateAddonQty = (item, val) => {
        let updatedData = addonData?.map((data) => {
            if (data.slug == item.slug)
                return {
                    "slug": data?.slug,
                    "quantity": val,
                    "is_personalised_product": data?.is_personalised_product,
                    "action_type": data?.action_type,
                    "upgrade_option": data?.upgrade_option
                }
            else
                return data
        });
        setAddonData(updatedData);
    };

    const removeAddon = (item) => {
        let updatedData = addonData.filter((data) => {
            if (data?.slug !== item?.slug)
                return data
        });
        setAddonData(updatedData);
    };

    const comboButtonData = () => {
        const comboDataApi = {
            "upgrade_option": upgrageOption,
            "is_personalised_product": uploadImage ? 1 : 0,
            "add_vase": 0,
            "add_eggless": 0,
            "slug": comboData?.slug,
            "quantity": "",
            "action_type": "add",
        }
        setAddonData([productRequestData, comboDataApi])
    };

    const zipCodeFun = async () => {
        if (zipCode) {
            productdetailbasecity();
            setDatePic('');
            setSelectDelivery('');
            setSelectTime('');
        }
    };

    const isAddedAsAddon = (slug) => {
        return addonData?.find((item) => item.slug === slug)
    };

    const onChangeCity = () => {
        if (userData?.userCartData?.city_name == undefined) {
            AddToCart([productRequestData]);
        } else {
            if ((cityId !== cartCityId)) {
                setShowChangeCityModal(true);
            } else {
                AddToCart([productRequestData]);
            }
        }
    };

    const onSubmit = async () => {
        if (selectDelivery !== '' && selectTime !== '') {
            if (productDataGift?.length === 0) {
                onChangeCity();
            } else {
                console.log('else======');
                setShowAddonGift(true);
                (showComboData == true) && comboButtonData();
            }
        }
    };

    const onCityChangepPopup = function () {

        return (
            showChangeCityModal == true &&
            <Modal
                animationType="none"
                transparent={true}
                visible={showChangeCityModal}
                onRequestClose={() => {
                    setShowChangeCityModal(!showChangeCityModal);
                }}>
                <View style={{ backgroundColor: productDataGift?.length === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.01)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', width: '69%', height: '21%', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingHorizontal: 5 }}>
                        <View style={{}}>
                            <Label text={`Your cart has product to ${selectState}, Do you wish to empty ${selectState} cart?`} />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, width: '100%', justifyContent: 'center' }}>

                            <Button style={{ marginRight: 5, width: 70, backgroundColor: Colors.Black }}
                                onPress={() => AddToCart([productRequestData])}
                                primaryButton
                                title='Yes'
                            />

                            <Button style={{ backgroundColor: Colors.Red, marginLeft: 5, width: 70 }}
                                onPress={() => { setShowChangeCityModal(!showChangeCityModal), setShowAddonGift(false) }}
                                primaryButton
                                title='Cancel'
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    };

    const addGift = () => {

        return (
            showAddonGift == true &&
            <Modal
                animationType="none"
                transparent={false}
                visible={showAddonGift}
                onRequestClose={() => {
                    setShowAddonGift(!showAddonGift);
                }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>

                    <View style={{ height: '100%', width: '100%', backgroundColor: Colors.White }}>

                        {isLoding ?
                            <Loader />
                            :
                            <>
                                <FlatList
                                    style={{ marginLeft: '1%' }}
                                    data={productDataGift}
                                    numColumns={3}
                                    ListHeaderComponent={<>
                                        <View style={styles.rowContainer}>
                                            <Label style={{ fontSize: 18, fontFamily: Typography.RobotoBold }} text={Strings.detail.GIFTADDONS} />
                                            <TouchableOpacity onPress={() => setShowAddonGift(false)} activeOpacity={0.7} style={{ right: 12 }} hitSlop={styles.hitSlop}>
                                                <Image style={{ width: 17, height: 17, }} source={ImagePath.Home.crossPink} resizeMode="contain" />
                                            </TouchableOpacity>
                                        </View>
                                    </>}
                                    ListFooterComponent={<Spacer style={{ marginTop: 0, height: 65, width: '100%' }} />}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        let isadded = isAddedAsAddon(item?.slug);
                                        return (
                                            <>
                                                <ProductList
                                                    style={{ margin: '1.4%', }}
                                                    clickOnAddonButton={() => (isadded) ? removeAddon(item) : addAddon(item)}
                                                    onClickProduct={() => (isadded) ? removeAddon(item) : addAddon(item)}
                                                    disabled={(isadded?.quantity == undefined || isadded?.quantity == 1) ? false : true}
                                                    productImage={productDataGift && { uri: imagePath + item?.product_image }}
                                                    productPriceStyle={{ color: Colors.RossoCorsa, fontSize: 12 }}
                                                    productName={item?.product_name}
                                                    productNameStyle={{ fontSize: 12, textAlign: 'center', }}
                                                    productPrice={`${item?.product_price ? `${country?.country?.currency_symbol} ` + item?.product_price : ''}`}
                                                    addonButton
                                                    clickOnIncrement={() => { (isadded) ? updateAddonQty(item, isadded?.quantity + 1) : addAddon(item) }}
                                                    clictOnDecrement={() => { (isadded) ? isadded?.quantity === 1 ? removeAddon(item) : updateAddonQty(item, isadded?.quantity - 1) : '' }}
                                                    value={(isadded) ? isadded?.quantity : 0}
                                                    rupeesIconStyle={{ tintColor: Colors.RossoCorsa, bottom: 1, width: 11, height: 11 }}
                                                    addonIcon={(isadded) ? ImagePath.Home.addAddon : ImagePath.Home.addon}
                                                    addonIconStyle={{ width: (isadded) ? 30 : 20, height: (isadded) ? 30 : 20 }}
                                                    addonViewStyle={{ top: (isadded) ? 2 : 8, right: (isadded) ? 0 : 5 }}
                                                />
                                                {productDataGift?.length > 0 && onCityChangepPopup()}
                                            </>
                                        )
                                    }}
                                />
                            </>
                        }

                        {!isLoding && isLodeMore ?
                            <Loader mainContainer={{ bottom: 10, position: "absolute", }}
                            />
                            :
                            <View style={{ backgroundColor: Colors.White, padding: '2.5%' }}>
                                <Button
                                    style={giftStyle.button}
                                    primaryButton
                                    title={addonData?.length > 0 ? `CONTINUE` : Strings.Home.continueWA}
                                    titleStyle={giftStyle.buttonTitle}
                                    onPress={() => onChangeCity()}
                                />
                            </View>
                        }
                    </View>
                </SafeAreaView>
            </Modal>
        )
    };

    const setCountryData = (data) => {
        AsyncStorage.setItem('country_id', data?.country_id);
        let oldCountryData = country?.country;
        let newCountryData = {
            "country_id": data?.country_id,
            "country_name": data?.country_name,
            "country_image": data?.country_image,
            "country_iso_code": data?.country_iso_code,
            "city_name": "",
            "city_id": "",
            "menu_url": data?.menu_url,
            "isFromLandingPage": data?.menu_url?.page_type == "landing" ? true : false,
        }

        let currCountryData = { ...oldCountryData, ...newCountryData };
        setSelectLocation(data?.country_name ? data?.country_name : oldCountryData?.default_country_name);
        dispatch(setCounrtyData(currCountryData));
        getDetailData('', true)
        recentlyRiewedProduct();
    };

    // formik validation
    const ValidationSchema = yup.object().shape({
        abpersonalisedMugs: productData?.personalised_mugs === 1 && yup.string().required('Personalised image is required.'),
        alphabet: productData?.alphabetical_products === 1 && yup.string().required('Alphabet name is required.'),
        zipCode: userData?.website_data?.zip_based_delivery === 1 && yup.string().required("Please enter zipcode."),
        city: yup.string().required("Please select a city."),
        date: yup.date().required("Please select a date."),
        delivery: yup.string().required('Please select a delivery.'),
        time: yup.string().required('Please select a time.'),
    });

    const recentlyRiewedProduct = () => {
        instance.post('/recently_viewed_product', {
            req: { "data": { type: "most_viewed", product_slug: productSlug } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData?.status === 'success') {
                setRecentlyProduct(userData?.result)
                setWishListLoader(prev => ({ ...prev, "recentlyWishList": false, 'similarWishList': false, }))
            }
        }).catch(error => {
            console.log("recentlyRiewedProduct=====catch====", error);
            AlertError(Strings.Other.catchError);
        });
    };

    // add_to_wishlist api
    const AddWishlistProduct = (slug, apiType) => {
        if (authData.data?.slug) {
            setWishListLoader(prev => ({ ...prev, 'singleWishList': apiType == undefined ? true : false, "recentlyWishList": apiType == 'seeWhatOther' ? true : false, 'similarWishList': apiType == 'recommended' ? true : false, 'apiType': apiType }))
            instance.post('/add_to_wishlist', {
                req: { "data": { "product_slug": slug } }
            }).then(async (response) => {
                const userData = JSON.parse(response?.data);

                if (userData?.status === 'success') {
                    if (apiType == 'seeWhatOther') {
                        recentlyRiewedProduct();
                    } else {
                        getDetailData('', false);
                    }
                    ToastSuccess(userData?.message)
                }
                else {
                    ToastError(userData?.message);
                    setWishListLoader(prev => ({ ...prev, 'singleWishList': false, "recentlyWishList": false, 'similarWishList': false }))
                }
            }).catch(error => {
                console.log('AddWishlistProduct==========catch==', error);
                AlertError(Strings.Other.catchError);
                setWishListLoader(prev => ({ ...prev, 'singleWishList': false, "recentlyWishList": false, 'similarWishList': false }))
            });
        } else {
            navigation.navigate('Login', { showmsg: 'yes' });
        }
    };

    // remove_from_wishlist api
    const removeWishlistProduct = (slug, apiType) => {
        setWishListLoader(prev => ({ ...prev, 'singleWishList': apiType == undefined ? true : false, "recentlyWishList": apiType == 'seeWhatOther' ? true : false, 'similarWishList': apiType == 'recommended' ? true : false, 'apiType': apiType }))
        instance.post('/remove_from_wishlist', {
            req: { "data": { "product_slug": slug } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);

            if (userData?.status === 'success') {
                if (apiType == 'seeWhatOther') {
                    recentlyRiewedProduct();
                } else {
                    getDetailData('', false);
                }
                ToastSuccess(userData?.message);
            }
            else {
                ToastError(userData?.message);
                setWishListLoader(prev => ({ ...prev, 'singleWishList': false, "recentlyWishList": false, 'similarWishList': false }))
            }
        }).catch(error => {
            console.log('removeWishlistProduct==========catch==', error);
            AlertError(Strings.Other.catchError);
            setWishListLoader(prev => ({ ...prev, 'singleWishList': false, "recentlyWishList": false, 'similarWishList': false }))
        });
    };

    const closeSheet = (item) => {
        if (openSheet == 0) {
            setCountryData(item);

        } else if (openSheet == 1) { //city select
            checkProductDetailBaseOnCity(item?.city_id);
            setSelectCity(item?.city_name)
            getDetailData(item.city_id, false);
            setTimeData([])
            setDatePic('');
            setSelectTime('');
            setSelectDelivery('');
        } else if (openSheet == 2) { //date select
            setSelectDelivery(item?.shipping_method_name);
            Deliverytimebaseshipping(item?.type);
            setSelectTime('');
        } else if (openSheet == 3) {
            setSelectTime(item);
            setTimeTypes(item?.timeSlot)
        }
        refLocationRBSheet.current?.close();
    };

    const source = {
        html: descriptionTopbar == 'Care Guide' ? userData?.result?.left_content : userData?.result?.right_content
    };
    const scrollViewRef = useRef(null)
    const windowHeight = Dimensions.get('window').height;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const refarr = {
        "uploadImage": useRef(null),
        "alphabet": useRef(null),
        "zipCode": useRef(null),
        "city": useRef(null),
        "date": useRef(null),
        "delivery": useRef(null),
        "time": useRef(null),
    };

    const handleFormSubmission = (errors, values) => {
        if (Object?.keys(errors).length > 0) {
            const inputField = refarr[productData?.personalised_mugs === 1 && uploadImage == undefined ? "uploadImage" : Object.keys(errors)[0]?.toString()]?.current

            inputField?.measureLayout(
                scrollViewRef?.current, (x, y, width, height) => {
                    const offsetY = y - windowHeight * 0.4;
                    scrollViewRef?.current?.scrollTo({ x: 0, y: offsetY, animated: true });
                }
            );
            return;
        }
    };

    const deliveryDate = (date) => {
        if (date == 'tomorrow') {
            deliveryOptionbaseDate(dateFormat(tomorrow));
            formikRef?.current.handleChange('date')(dateFormat(tomorrow));
            setDatePic(dateFormat(tomorrow))
            formikRef?.current.handleChange('delivery')('');
            formikRef?.current.handleChange('time')('');
            setSelectTime('');
            setSelectDelivery('');
            return tomorrow;

        } else {
            formikRef?.current.handleChange('time')('');
            deliveryOptionbaseDate(dateFormat(date));
            formikRef?.current.handleChange('date')(dateFormat(date));
            setDatePic(dateFormat(date))
            formikRef?.current.handleChange('delivery')('');
            setSelectTime('');
            setSelectDelivery('');
        }
    };

    const [indexSelected, setIndexSelected] = useState(0);
    const carouselRef = useRef(null);
    const flatListRef = useRef(null);

    const onSelect = (indexSelected) => {
        setIndexSelected(indexSelected);
        carouselRef.current.snapToItem(indexSelected);
    };

    const searchData = (searchVal = '') => {
        const dataToFilter = openSheet === 0 ? locationArr || [] : stateArr || [];
        const result = dataToFilter.filter((item) =>
            openSheet === 0
                ? item?.country_name?.toLowerCase().includes(searchVal.toLowerCase())
                : item?.city_name?.toLowerCase().includes(searchVal.toLowerCase())
        );
        if (openSheet === 0) {
            setShowCountry(result);
        } else {
            setShowCity(result);
        }
    };

    return (

        <SafeAreaView style={styles.mainContainer}>

            <NewHeader
                exploreIcon
            />
            {isLoding ?
                <Loader />
                :
                <ScrollView ref={scrollViewRef} style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <Formik
                        validationSchema={ValidationSchema}
                        enableReinitialize={true}
                        innerRef={formikRef}
                        initialValues={{
                            abpersonalisedMugs: uploadImage ? uploadImage?.toString() : '',
                            city: (selectCity ? selectCity : (userData?.userCartData?.country_id === country?.country?.country_id) && (userData?.website_data?.zip_based_delivery === 0) ? selectState : ''),
                            date: datePic ? datePic : '',
                            delivery: selectDelivery ? selectDelivery : '',
                            time: selectTime ? selectTime?.timeSlot : '',
                            alphabet: selectAlpha ? selectAlpha : '',
                            zipCode: zipCode ? zipCode : '',
                        }}
                        onSubmit={values => onSubmit()}
                    >
                        {({ handleChange, handleSubmit, touched, values, errors, validateForm }) => (
                            <View style={{ flex: 1 }}>
                                <>
                                    <View style={{ flex: 1 }} >
                                        <View style={{}}>

                                            {upgradeOptionData &&
                                                <FlatList
                                                    data={upgradeOptionData}
                                                    numColumns={3}
                                                    scrollEnabled={false}
                                                    ListHeaderComponent={
                                                        <View>
                                                            {selectedProduct == undefined ?
                                                                <SkeletonPlaceholder>
                                                                    <SkeletonPlaceholder.Item
                                                                        height={width}
                                                                        width={width}
                                                                    />
                                                                </SkeletonPlaceholder>
                                                                :
                                                                <>
                                                                    <View style={{}}>
                                                                        <View style={{}}>
                                                                            <Carousel
                                                                                ref={carouselRef}
                                                                                layout="default"
                                                                                data={productData?.product_other_image ? productSlide?.concat(productData?.product_other_image) : productSlide}
                                                                                loop={false}
                                                                                autoplay={false}
                                                                                sliderWidth={width}
                                                                                itemWidth={width}
                                                                                onSnapToItem={(index) => setIndexSelected(index)}
                                                                                renderItem={({ item, index }) => {
                                                                                    return (
                                                                                        <ProgressiveImage
                                                                                            source={{ uri: imageUrl + item?.image }}
                                                                                            style={{ width: width, height: width }}
                                                                                        />
                                                                                    )
                                                                                }}
                                                                            />
                                                                        </View>

                                                                        <TouchableOpacity onPress={() => productData?.is_in_wishlist == 1 ? removeWishlistProduct(productSlug) : AddWishlistProduct(productSlug)}
                                                                            style={styles.likeContainer} activeOpacity={0.7} disabled={wishListLoader?.singleWishList ? true : false}>
                                                                            {wishListLoader?.singleWishList ? <Loader loadStyle={styles.wishlistLoader} size={'small'} /> :
                                                                                <Icon source={productData?.is_in_wishlist == 1 ? heartActiveIcon : ImagePath.Other?.heartIcon}
                                                                                    style={styles.wishlistIcon}
                                                                                />
                                                                            }
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </>
                                                            }

                                                            <View style={{ marginTop: 11, alignItems: "center", justifyContent: 'center' }}>
                                                                <FlatList
                                                                    ref={flatListRef}
                                                                    data={selectedProduct == undefined ? [{}, {}] : productData?.product_other_image ? productSlide?.concat(productData?.product_other_image) : productSlide}
                                                                    horizontal={true}
                                                                    showsHorizontalScrollIndicator={false}
                                                                    showsVerticalScrollIndicator={false}
                                                                    contentContainerStyle={{ paddingHorizontal: 12 }}
                                                                    renderItem={({ item, index }) => {
                                                                        return (
                                                                            <>
                                                                                {selectedProduct == undefined ?
                                                                                    <SkeletonPlaceholder>
                                                                                        <SkeletonPlaceholder.Item
                                                                                            height={44}
                                                                                            width={44}
                                                                                            marginRight={10}
                                                                                            borderRadius={5}
                                                                                        />
                                                                                    </SkeletonPlaceholder>
                                                                                    :
                                                                                    <TouchableOpacity
                                                                                        onPress={() => onSelect(index)}
                                                                                        activeOpacity={0.9}
                                                                                    >
                                                                                        <ProgressiveImage
                                                                                            style={{
                                                                                                width: 44, height: 44, marginRight: 11, borderRadius: 5, borderWidth: 1,
                                                                                                borderColor: item?.image ? index === indexSelected ? Colors.Camel : Colors.White : index == 0 ? Colors.Camel : Colors.White,
                                                                                                opacity: index === indexSelected ? null : 0.99 && indexSelected && index == 0 && index != 0 ? 0.5 : null ? null : 0.5,
                                                                                            }}
                                                                                            source={imageUrl && { uri: imageUrl + item?.image }}
                                                                                            resizeMode={'contain'}
                                                                                        />
                                                                                    </TouchableOpacity>
                                                                                }
                                                                            </>
                                                                        )
                                                                    }}
                                                                />
                                                            </View>

                                                            <View style={{ paddingHorizontal: '3%', marginTop: 25, }}>
                                                                {selectedProduct == undefined ?
                                                                    <SkeletonPlaceholder>
                                                                        <SkeletonPlaceholder.Item
                                                                            height={30}
                                                                            width={'80%'}
                                                                        />
                                                                    </SkeletonPlaceholder>
                                                                    :
                                                                    <Label style={styles.productName} text={productData?.product_name ? productData?.product_name : ''} numberOfLines={1} />
                                                                }

                                                                {userData?.result?.product_status == 1 ?
                                                                    userData?.result?.product_price == 0 ?
                                                                        <View style={{ marginTop: 15 }}>
                                                                            <Label style={{ color: Colors.Red }} text={'Sorry ! This product is not available on selected City.'} />
                                                                        </View>
                                                                        :
                                                                        <>
                                                                            {selectedProduct == undefined ?
                                                                                <SkeletonPlaceholder>
                                                                                    <SkeletonPlaceholder.Item
                                                                                        height={30}
                                                                                        width={'35%'}
                                                                                        marginTop={23}
                                                                                    />
                                                                                </SkeletonPlaceholder>
                                                                                :
                                                                                <RowColumn
                                                                                    onClick={() => ''}
                                                                                    viewStyle={{ marginTop: 5 }}
                                                                                    labelStyle1={{ color: Colors.RossoCorsa, fontSize: 22, fontFamily: Typography.poppinsSemiBold }}
                                                                                    ratingIconStyle={{ width: 20, height: 20, tintColor: Colors.Red, bottom: 1.5 }}
                                                                                    title1={`${country?.country?.currency_symbol} ${userData?.result?.product_price ? userData?.result?.product_price : '0'}`}
                                                                                    labelStyleView2={{ borderBottomWidth: 1, borderBottomColor: Colors.RoyalBlue }}
                                                                                    labelStyle2={{ color: Colors.RoyalBlue, marginLeft: 0, fontFamily: Typography.RobotoMedium, fontSize: 16 }}
                                                                                />}
                                                                        </>
                                                                    :
                                                                    null
                                                                }

                                                                <View style={[{ marginTop: userData?.result?.product_status ? 5 : 15, alignItems: selectedProduct == undefined ? null : "center", flexDirection: selectedProduct == undefined ? null : 'row', }]}>
                                                                    {selectedProduct == undefined ?
                                                                        <SkeletonPlaceholder>
                                                                            <SkeletonPlaceholder.Item
                                                                                height={30}
                                                                                width={'35%'}
                                                                            />
                                                                        </SkeletonPlaceholder>
                                                                        : <>
                                                                            <View style={[styles.ratingContainer, {}]}>
                                                                                <Label text={userData?.result?.rating_avg ? userData?.result?.rating_avg.toString() : '0'} style={styles.ratingCount} />
                                                                                <View style={{ marginLeft: 1.5 }}>
                                                                                    <Icon source={ImagePath.Other?.singleStar} style={[styles.ratingIcon, { marginLeft: 2 }]} />
                                                                                </View>
                                                                            </View>

                                                                            <View style={{ marginLeft: 10 }}>
                                                                                <RegularLabel title={`${productData?.review_count ? productData?.review_count.toString() : '0'} Reviews`} regularStyle={{ color: Colors.WaterBlue, fontSize: 14 }} />
                                                                            </View>
                                                                        </>}
                                                                </View>

                                                            </View>

                                                            {userData?.result?.product_status == 1 &&
                                                                <View>
                                                                    <Spacer style={styles.borderSpacer} />
                                                                    <View style={{ marginLeft: wp('3%'), }}>
                                                                        <BoldLabel title={Strings.detail.upgradeOptionAvailable} boldStyle={styles.upgradeStyle} />
                                                                    </View>
                                                                </View>
                                                            }

                                                            <Spacer style={{ marginTop: 12 }} />
                                                        </View>
                                                    }
                                                    ListFooterComponent={
                                                        <>
                                                            <View style={{ marginTop: 16 }}>
                                                                <View>
                                                                    {userData?.result?.product_status == 1 ?
                                                                        <View style={{ paddingHorizontal: '3%' }}>
                                                                            {productData?.add_vase === 1 ?
                                                                                selectedProduct == undefined ?
                                                                                    <SkeletonPlaceholder>
                                                                                        <SkeletonPlaceholder.Item
                                                                                            height={30}
                                                                                            width={'70%'}
                                                                                            marginTop={Size.xm}
                                                                                        />
                                                                                    </SkeletonPlaceholder> :

                                                                                    <TouchableOpacity onPress={() => setUncheck({ ...check, 'check': !check?.check })}
                                                                                        activeOpacity={0.7}
                                                                                        style={{ flexDirection: "row", alignItems: "center", marginTop: Size.xm, }}>
                                                                                        <ImageBackground
                                                                                            source={ImagePath.Other.unCheckedBox}
                                                                                            style={styles.backgroundContainer}
                                                                                        >
                                                                                            <Icon style={{ width: Size.xm2, height: Size.xm2 }}
                                                                                                source={check?.check && ImagePath.Other.correct} resizeMode='contain' />
                                                                                        </ImageBackground>
                                                                                        <View style={{ marginLeft: Size.xs3 }}>
                                                                                            <RegularLabel title={'Arrange in Glass Vase :'} regularStyle={{ fontSize: 14 }} />
                                                                                        </View>

                                                                                        <RegularLabel title={`${country?.country?.currency_symbol} ${productData?.product_price_detail?.vase_price ? productData?.product_price_detail?.vase_price : '0'}`}
                                                                                            regularStyle={{ marginLeft: Size.xs3, fontSize: 14 }}
                                                                                        />
                                                                                    </TouchableOpacity> : null}

                                                                            {productData?.add_eggless == 1 ?
                                                                                <TouchableOpacity onPress={() => setUncheckeEggless(!checkEggless)}
                                                                                    activeOpacity={0.7}
                                                                                    style={{ flexDirection: "row", alignItems: "center", marginTop: Size.xm, }}>
                                                                                    <ImageBackground
                                                                                        source={ImagePath.Other.unCheckedBox}
                                                                                        style={styles.backgroundContainer}
                                                                                    >
                                                                                        <Icon style={{ width: Size.xm2, height: Size.xm2 }}
                                                                                            source={checkEggless && ImagePath.Other.correct} resizeMode='contain' />
                                                                                    </ImageBackground>
                                                                                    <View style={{ marginLeft: Size.xs3 }}>
                                                                                        <RegularLabel title={'Make Cake Eggless :'} regularStyle={{ fontSize: 15 }} />
                                                                                    </View>

                                                                                    <RegularLabel title={`${country?.country?.currency_symbol} ${productData?.product_price_detail?.eggless_price}`}
                                                                                        regularStyle={{ marginLeft: Size.xs3, fontSize: 15 }}
                                                                                    />
                                                                                </TouchableOpacity> : null}


                                                                            {productData?.personalised_mugs === 1 &&
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }} ref={refarr["uploadImage"]}>
                                                                                    <TouchableOpacity activeOpacity={0.6} onPress={() => openGallery()}
                                                                                        style={[styles.sheetContainer, { width: uploadImage ? wp('80%') : wp('94%'), marginTop: 0, justifyContent: 'space-between', paddingHorizontal: 9, height: 40, }]}>
                                                                                        <Label state={{ fontSize: 15 }} text={'Upload image'} />

                                                                                        <View style={{ marginRight: 3 }}>
                                                                                            <Icon source={ImagePath.webIcons.attachments} style={{ height: 15, width: 15, }} />
                                                                                        </View>
                                                                                    </TouchableOpacity>
                                                                                    {uploadImage &&
                                                                                        <View style={{ marginLeft: 5, }}>
                                                                                            <Image style={{ width: 45, height: 40, }} source={{ uri: uploadImage?.path }} resizeMode="cover" />
                                                                                        </View>
                                                                                    }
                                                                                </View>
                                                                            }

                                                                            {((errors.abpersonalisedMugs && touched.abpersonalisedMugs) && productData?.personalised_mugs === 1) &&
                                                                                <View style={{ marginLeft: 4 }}>
                                                                                    <RegularLabel regularStyle={styles.error} title={errors.abpersonalisedMugs} />
                                                                                </View>
                                                                            }

                                                                            {/* Alfhabetical Products */}

                                                                            <View>
                                                                                {productData?.alphabetical_products === 1 &&
                                                                                    <View style={{}} ref={refarr["alphabet"]}>
                                                                                        <Dropdown
                                                                                            style={[styles.dropdown]}
                                                                                            placeholderStyle={styles.placeholderStyle}
                                                                                            selectedTextStyle={styles.selectedTextStyle}
                                                                                            inputSearchStyle={styles.inputSearchStyle}
                                                                                            iconStyle={styles.iconStyle}
                                                                                            itemTextStyle={{ color: Colors.Black, }}
                                                                                            data={data}
                                                                                            search
                                                                                            maxHeight={250}
                                                                                            labelField="value"
                                                                                            valueField="value"
                                                                                            placeholder={'Select Alphabets'}
                                                                                            searchPlaceholder=""
                                                                                            value={values.alphabet}
                                                                                            onChange={(item) => {
                                                                                                handleChange('alphabet')(item.value);
                                                                                                setSelectAlpha(item.value);
                                                                                            }}
                                                                                            renderLeftIcon={() => null} />
                                                                                    </View>
                                                                                }

                                                                                {errors.alphabet && touched.alphabet &&
                                                                                    <View style={{ marginLeft: 4 }}>
                                                                                        <RegularLabel regularStyle={styles.error} title={errors.alphabet} />
                                                                                    </View>
                                                                                }

                                                                            </View>
                                                                        </View>
                                                                        :
                                                                        selectedProduct == undefined ?
                                                                            <SkeletonPlaceholder>
                                                                                <SkeletonPlaceholder.Item
                                                                                    height={30}
                                                                                    marginHorizontal={10}
                                                                                />
                                                                            </SkeletonPlaceholder>
                                                                            :
                                                                            <View style={{ flex: 1 }}>
                                                                                <View style={{ flex: 1, marginLeft: 10 }}>
                                                                                    <Label style={[styles.descriptionHeading, { fontSize: 13, color: Colors.FerrariRed }]} text={"Product is currently unavailable for this country"} />
                                                                                </View>
                                                                                <View style={{ marginLeft: 10, }}>
                                                                                    <Text onPress={() => {
                                                                                        searchData('')
                                                                                        setSearchCtyOrCountry('');
                                                                                        refLocationRBSheet.current?.open('')
                                                                                        setOpenSheet(0)
                                                                                    }}
                                                                                        style={[styles.descriptionHeading, { color: Colors.Camel, fontSize: 13, textDecorationLine: 'underline' }]}>Change Location</Text>
                                                                                </View>
                                                                            </View>

                                                                    }

                                                                    <View style={{}}>
                                                                        <Spacer style={[styles.borderSpacer,]} />
                                                                        {
                                                                            userData?.result?.in_stock == 1 ?
                                                                                <View style={{ paddingHorizontal: '3%' }}>

                                                                                    {userData?.website_data?.zip_based_delivery == 1 ?
                                                                                        <View style={[styles.inputTextContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                                                                                            <TextInput style={styles.inputText}
                                                                                                ref={refarr["zipCode"]}
                                                                                                placeholder="Enter Zipcode"
                                                                                                onChangeText={(text) => {
                                                                                                    setZipCode(text);
                                                                                                    handleChange('zipCode')(text);
                                                                                                    setZipCodeTogal(false);
                                                                                                }}
                                                                                            />
                                                                                            <Button
                                                                                                onPress={() => { handleSubmit(), zipCodeFun(), Keyboard.dismiss(), handleFormSubmission(errors, values); }}
                                                                                                disabled={zipCodeTogal}
                                                                                                style={{ width: 70, borderRadius: 5, height: 48, backgroundColor: Colors.Secondary.Black }}
                                                                                                primaryButton
                                                                                                title='click'
                                                                                            />
                                                                                        </View>
                                                                                        :
                                                                                        <View style={{ marginTop: productData?.alphabetical_products === 1 || productData?.personalised_mugs === 1 ? 10 : 0 }}>
                                                                                            <Label style={styles.dropdownName} text={Strings.Other.checkProductDelivery} />

                                                                                            <View style={[styles.sheetContainer]}>
                                                                                                <TouchableOpacity onPress={() => {
                                                                                                    searchData('')
                                                                                                    setSearchCtyOrCountry('');
                                                                                                    refLocationRBSheet.current?.open('');
                                                                                                    setOpenSheet(0);
                                                                                                }}
                                                                                                    activeOpacity={0.7}
                                                                                                    style={styles.courncyView}>
                                                                                                    <View style={{ marginLeft: 7 }}>
                                                                                                        <RegularLabel title={`${country?.country?.country_name ? country?.country?.country_name : country?.country?.default_country_name}`} regularStyle={{ fontSize: 15, fontFamily: Typography.poppinsRegular }} />
                                                                                                    </View>
                                                                                                    <Image source={ImagePath.Other?.edit} style={styles.edit} resizeMode="contain" />
                                                                                                </TouchableOpacity>

                                                                                                <TouchableOpacity accessible ref={refarr["city"]} activeOpacity={0.7} onPress={() => {
                                                                                                    searchData('')
                                                                                                    setSearchCtyOrCountry('');
                                                                                                    refLocationRBSheet.current?.open('');
                                                                                                    setOpenSheet(1);
                                                                                                }}
                                                                                                    style={styles.stateRowView}>
                                                                                                    <View style={{ marginLeft: 4 }}>
                                                                                                        <RegularLabel title={values.city ? values.city : Strings.detail.selectCity} regularStyle={{ fontSize: 15, fontFamily: Typography.poppinsRegular }} />
                                                                                                    </View>
                                                                                                    <Image source={dropdownIcon} style={{ height: 12, width: 12, }} resizeMode="contain" />
                                                                                                </TouchableOpacity>
                                                                                            </View>

                                                                                            {(touched.city && errors.city) && (userData?.website_data?.zip_based_delivery === 0) &&
                                                                                                <View style={{}}>
                                                                                                    <RegularLabel regularStyle={styles.error} title={errors.city} />
                                                                                                </View>}
                                                                                        </View>
                                                                                    }

                                                                                    {((touched.zipCode && errors.zipCode) && userData?.website_data?.zip_based_delivery == '0') &&
                                                                                        <RegularLabel regularStyle={styles.error} title={errors.zipCode} />
                                                                                    }

                                                                                    {
                                                                                        isLoadeMore ?
                                                                                            <Loader mainContainer={{ marginTop: 5 }} loadStyle={{ elevation: 0 }} />
                                                                                            :
                                                                                            (productDetailBaseOnCity?.productAssignOnCity?.is_available_in_city === 0) ?
                                                                                                <View style={{ paddingVertical: 7, elevation: 1, backgroundColor: 'rgb(232, 235, 234)', alignItems: 'center', borderRadius: 5, marginTop: 10 }}>
                                                                                                    <Label style={{}} text={`Sorry ! This product is not available in ${selectState}. Please `} />
                                                                                                    <View style={{ flexDirection: 'row' }}>
                                                                                                        <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: Colors.Camel }} onPress={() => navigation.navigate('Landing')} activeOpacity={0.7}>
                                                                                                            <Label style={{ color: Colors.Camel }} text={'click here'} />
                                                                                                        </TouchableOpacity>
                                                                                                        <Label style={{}} text={`. to view all products available in ${selectState} .`} />
                                                                                                    </View>
                                                                                                </View>
                                                                                                :
                                                                                                <>
                                                                                                    {userData?.result?.product_price !== 0 && (values?.city !== '' || zipCodeError === '') ?
                                                                                                        <View style={{ marginTop: 16 }} >
                                                                                                            <Label style={styles.dropdownName} text={Strings.detail.selectDate} />

                                                                                                            <View style={[styles.sheetContainer, { borderWidth: 0 }]} ref={refarr["date"]}>
                                                                                                                <TouchableOpacity onPress={() => { deliveryDate(new Date()), setSelectDateType(1) }} style={[styles.deliveryTypeView, {
                                                                                                                    width: wp('31.2%'),
                                                                                                                    borderColor: selectDateType == 1 ? Colors.Black : Colors.Concord,
                                                                                                                    backgroundColor: selectDateType == 1 ? Colors.Fantasy : Colors.White
                                                                                                                }]} activeOpacity={0.7}>
                                                                                                                    <RegularLabel title={`Today, ${dateFormat(new Date(), 'DD MMM')}`} regularStyle={styles.calenderName} />
                                                                                                                </TouchableOpacity>

                                                                                                                <TouchableOpacity onPress={() => { deliveryDate('tomorrow'), setSelectDateType(2) }} style={[styles.deliveryTypeView, {
                                                                                                                    width: wp('31.2%'),
                                                                                                                    borderColor: selectDateType == 2 ? Colors.Black : Colors.Concord,
                                                                                                                    backgroundColor: selectDateType == 2 ? Colors.Fantasy : Colors.White
                                                                                                                }]} activeOpacity={0.7}>
                                                                                                                    <RegularLabel title={`Tomorrow, ${dateFormat(tomorrow, 'DD MMM')}`} regularStyle={styles.calenderName} />
                                                                                                                </TouchableOpacity>

                                                                                                                <TouchableOpacity onPress={() => { handleChange('time')(''), setSelectDateType(3), setShowDatePicker(true) }} style={[styles.deliveryTypeView, {
                                                                                                                    width: wp('31.2%'),
                                                                                                                    borderColor: selectDateType == 3 ? Colors.Black : Colors.Concord,
                                                                                                                    backgroundColor: selectDateType == 3 ? Colors.Fantasy : Colors.White
                                                                                                                }]} activeOpacity={0.7}>
                                                                                                                    <RegularLabel title={(datePic && values.date && selectDateType == 3) ? dateFormat(values?.date, 'ddd, DD MMM') : Strings.detail.selectDate} regularStyle={styles.calenderName} />
                                                                                                                </TouchableOpacity>
                                                                                                            </View>

                                                                                                            {(touched.date && errors.date) &&
                                                                                                                <RegularLabel regularStyle={styles.error} title={errors.date} />
                                                                                                            }
                                                                                                        </View>
                                                                                                        :
                                                                                                        null}

                                                                                                    {isDateLodeMore ?
                                                                                                        <Loader mainContainer={{ marginTop: 5 }} loadStyle={{ elevation: 0 }} />
                                                                                                        :
                                                                                                        (datePic && values.date !== '' && deliveryType?.result?.length > 0) ?
                                                                                                            <View>

                                                                                                                <Label style={[styles.dropdownName, { marginTop: 16 }]} text={Strings.detail.selectDeliveryType} />

                                                                                                                <View style={[styles.sheetContainer, { borderWidth: 0 }]} ref={refarr["delivery"]}>
                                                                                                                    {deliveryType?.result?.map((item, index) => {
                                                                                                                        return (
                                                                                                                            <View style={[styles.deliveryTypeView, {
                                                                                                                                borderColor: item?.shipping_method_name == values?.delivery ? Colors.Black : Colors.Concord,
                                                                                                                                backgroundColor: item?.shipping_method_name == values?.delivery ? Colors.Fantasy : Colors.White
                                                                                                                            }]} key={index}>
                                                                                                                                <TouchableOpacity onPress={() => {
                                                                                                                                    handleChange('delivery')(item?.shipping_method_name)
                                                                                                                                    setSelectDelivery(item?.shipping_method_name);
                                                                                                                                    Deliverytimebaseshipping(item?.type);
                                                                                                                                    setSelectTime('');
                                                                                                                                }} style={[styles.dateView]} activeOpacity={0.7}>
                                                                                                                                    <RegularLabel title={item?.shipping_method_name} regularStyle={styles.calenderName} />
                                                                                                                                </TouchableOpacity>
                                                                                                                            </View>
                                                                                                                        )
                                                                                                                    })}
                                                                                                                </View>

                                                                                                                {timeData[0]?.midNighMessage ?
                                                                                                                    <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}>
                                                                                                                        <View style={{ flex: 1 }}>
                                                                                                                            <Label text={`${timeData[0]?.midNighMessage}`} />
                                                                                                                        </View>
                                                                                                                        <Label style={{ color: Colors.Red }} text={` ${timeData[0]?.deliveryDate}`} />
                                                                                                                    </View> : null}

                                                                                                                {(touched.delivery && errors?.delivery) &&
                                                                                                                    <RegularLabel regularStyle={styles.error} title={errors.delivery} />
                                                                                                                }
                                                                                                            </View>
                                                                                                            : null}
                                                                                                </>}

                                                                                    {isDeliveryTypeLodeMore ?
                                                                                        <Loader mainContainer={{ marginTop: 5 }} loadStyle={{ elevation: 0 }} />
                                                                                        :
                                                                                        (selectDelivery && values?.delivery !== '' && datePic && userData?.result?.product_price !== 0) ?
                                                                                            <View style={{ marginTop: 16 }}>
                                                                                                <Label style={[styles.dropdownName]} text={Strings.detail.selectTime} />

                                                                                                {timeData?.length == 1 ?
                                                                                                    <View style={[styles.deliveryTypeView, { borderColor: Colors.Black, marginTop: 8, backgroundColor: Colors.Fantasy, width: wp('42%'), }]}>
                                                                                                        <RegularLabel title={values.time} regularStyle={[styles.calenderName, { fontSize: 13 }]} />
                                                                                                    </View>
                                                                                                    :
                                                                                                    <TouchableOpacity accessible ref={refarr["time"]} activeOpacity={0.6} onPress={() => { setOpenSheet(3), refLocationRBSheet.current?.open('') }}
                                                                                                        style={[styles.sheetContainer, { marginTop: 8, justifyContent: 'space-between', paddingHorizontal: 9, backgroundColor: values.time ? Colors.Fantasy : Colors.White }]}>
                                                                                                        <RegularLabel title={(selectTime && values.time) ? values.time : Strings.detail.selectTime} regularStyle={[styles.calenderName, { fontSize: 13 }]} />
                                                                                                        <View style={{ marginRight: 3 }}>
                                                                                                            <Icon source={dropdownIcon} style={{ height: 12, width: 12, }} />
                                                                                                        </View>
                                                                                                    </TouchableOpacity>}

                                                                                                {(touched.time && errors?.time) &&
                                                                                                    <RegularLabel regularStyle={styles.error} title={errors.time} />
                                                                                                }
                                                                                            </View>
                                                                                            : null}

                                                                                    {/* product Combo */}

                                                                                    <View style={{}}>
                                                                                        {comboProductList?.length > 0 &&
                                                                                            <View style={{ borderBottomColor: Colors.GreyGoose, borderBottomWidth: 0.6, paddingVertical: 10 }}>
                                                                                                <FlatList
                                                                                                    data={comboProductList}
                                                                                                    scrollEnabled={false}
                                                                                                    horizontal
                                                                                                    showsVerticalScrollIndicator={false}
                                                                                                    showsHorizontalScrollIndicator={false}
                                                                                                    renderItem={({ item, index }) => {
                                                                                                        return (
                                                                                                            <TouchableOpacity onPress={() => { comboFun(item?._id) }}
                                                                                                                style={{ flex: 1 }} key={index}>
                                                                                                                <View style={{ borderBottomWidth: item?._id === comboData?._id ? 1 : 0, padding: 7, }}>
                                                                                                                    <RegularLabel title={`Combo #${index + 1}`} />
                                                                                                                </View>
                                                                                                            </TouchableOpacity>
                                                                                                        );
                                                                                                    }} />

                                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                                                                                    <View style={styles.comboProductStyle}>
                                                                                                        <Image style={stylesList.flowerIcon} source={imageUrl && { uri: imageUrl + productData?.product_image }} resizeMode="stretch" />

                                                                                                        <View style={{ marginVertical: 10, marginHorizontal: 10, alignItems: 'center' }}>
                                                                                                            <RowColumn
                                                                                                                viewStyle={{ marginBottom: 3 }}
                                                                                                                titleStyle={{ marginLeft: 0 }}
                                                                                                                title={productData?.rating_avg ? productData?.rating_avg.toString() : '0'}
                                                                                                                ratingIcon={ImagePath.Other.singleStar}
                                                                                                                title1={`(${productData?.review_count ? productData?.review_count.toString() : '0'})`}
                                                                                                                labelStyle={stylesList.deliveryLabel}
                                                                                                                labelStyle1={[stylesList.deliveryLabel, { marginLeft: 10 }]} />

                                                                                                            <RegularLabel
                                                                                                                regularStyle={stylesList.regularText}
                                                                                                                title={productData?.product_name}
                                                                                                                numberOfLines={1}
                                                                                                                ellipsizeMode={'tail'} />

                                                                                                            <Label style={stylesList.boldText} text={`${country?.country?.currency_symbol} ${productData?.product_price ? productData?.product_price.toString() : '0'}`} />
                                                                                                        </View>
                                                                                                    </View>


                                                                                                    <View style={[styles.comboProductStyle, styles.comboProduct]}>
                                                                                                        <Image style={stylesList.flowerIcon} source={imageUrl && { uri: imageUrl + comboData?.product_image }} resizeMode="stretch" />

                                                                                                        <View style={{ marginVertical: 10, marginHorizontal: 10, alignItems: 'center' }}>
                                                                                                            <RowColumn
                                                                                                                viewStyle={{ marginBottom: 3 }}
                                                                                                                titleStyle={{ marginLeft: 0 }}
                                                                                                                title={`${comboData?.rating_avg ? comboData?.rating_avg.toString() : '0'}`}
                                                                                                                ratingIcon={ImagePath.Other.singleStar}
                                                                                                                title1={`(${comboData?.review_count ? comboData?.review_count.toString() : '0'})`}
                                                                                                                labelStyle={stylesList.deliveryLabel}
                                                                                                                labelStyle1={[stylesList.deliveryLabel, { marginLeft: 10 }]} />

                                                                                                            <RegularLabel
                                                                                                                regularStyle={stylesList.regularText}
                                                                                                                title={comboData?.product_name}
                                                                                                                numberOfLines={1}
                                                                                                                ellipsizeMode={'tail'} />

                                                                                                            <View style={{}}>
                                                                                                                <Label style={stylesList.boldText} text={`${country?.country?.currency_symbol ? country?.country?.currency_symbol : ''} ${comboData?.product_price ? comboData?.product_price : 0}`} />
                                                                                                            </View>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                </View>

                                                                                                <View style={{ marginTop: 12, marginLeft: 3 }}>
                                                                                                    <Label text={`${Strings.ShoppingCart.total} : ${productData?.product_price + comboData?.product_price}`} />

                                                                                                    <Button onPress={() => {
                                                                                                        handleSubmit();
                                                                                                        if (errors?.city == undefined && errors?.delivery == undefined && errors?.time == undefined) {
                                                                                                            setShowComboData(true);
                                                                                                        }
                                                                                                    }}
                                                                                                        style={{ width: '60%', marginTop: 10, backgroundColor: Colors.Secondary.Black }}
                                                                                                        primaryButton
                                                                                                        title={'Buy Now'} />
                                                                                                </View>
                                                                                            </View>}

                                                                                    </View>

                                                                                </View>
                                                                                :
                                                                                selectedProduct != undefined &&
                                                                                <View style={{ flex: 1, marginLeft: 10 }}>
                                                                                    <Label style={[styles.descriptionHeading, { fontSize: 13, color: Colors.FerrariRed }]} text={"Product is currently out of stock"} />
                                                                                </View>
                                                                        }
                                                                    </View>
                                                                </View>
                                                                <Spacer style={[styles.descriptionBorderSpacer, { marginTop: userData?.result?.in_stock && userData?.result?.product_status ? 10 : 30, }]} />

                                                                {/*Description Flower Care Unit */}
                                                                {(userData?.result?.left_content || userData?.result?.right_content) &&
                                                                    <>
                                                                        <View style={styles.descriptionContainer}>
                                                                            {expandData?.map((item) => {
                                                                                return (
                                                                                    <TouchableOpacity onPress={() => setDescriptionTopbar(item?.description)} activeOpacity={0.7} key={item?._id}
                                                                                        style={[styles.descriptionView, { borderColor: item.description == descriptionTopbar ? Colors.DoveGray : Colors.White }]}>
                                                                                        <Label style={styles.descriptionHeading} text={item.description} />
                                                                                    </TouchableOpacity>
                                                                                )
                                                                            })}
                                                                        </View>

                                                                        <View style={{ paddingHorizontal: 5 }}>
                                                                            <RenderHtml
                                                                                contentWidth={width}
                                                                                source={source}
                                                                                tagsStyles={{
                                                                                    body: {
                                                                                        whiteSpace: 'normal',
                                                                                        color: 'gray'
                                                                                    },
                                                                                    ol: {
                                                                                        paddingLeft: 24,
                                                                                        paddingRight: 10,
                                                                                    },
                                                                                    li: {
                                                                                        marginBottom: 10,
                                                                                        color: 'black',
                                                                                    },
                                                                                    p: {
                                                                                        paddingHorizontal: 10,
                                                                                        marginVertical: 5,
                                                                                        lineHeight: 20,
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </View>

                                                                        <Spacer style={[styles.ratingBorderSpacer, { marginBottom: 0, marginTop: 23 }]} />
                                                                    </>
                                                                }

                                                                {/* <ReviewRatingDetail productId={route?.params?.productId} /> */}
                                                                {userData?.result?._id && <ReviewRatingDetail productId={userData?.result?._id} />}

                                                                {/* Recommended For You */}
                                                                {(userData?.relatedProductList?.length > 0 && imageUrl) &&
                                                                    <View style={{}}>
                                                                        <View style={[styles.recentlyProduct, { marginTop: 20 }]}>
                                                                            <BoldLabel title={'Recommended For You'} boldStyle={styles.upgradeStyle} />
                                                                        </View>
                                                                        <FlatList
                                                                            data={userData?.relatedProductList}
                                                                            horizontal
                                                                            showsVerticalScrollIndicator={false}
                                                                            showsHorizontalScrollIndicator={false}
                                                                            ListFooterComponent={<Spacer style={{ marginTop: 0, marginRight: 10 }} />}
                                                                            renderItem={({ item, index }) => {
                                                                                return (
                                                                                    <View key={item?._id}>
                                                                                        <ProductList
                                                                                            onClickProduct={() => {
                                                                                                setUncheck({ ...check, 'productSlug': item?.slug })
                                                                                                getDetailData('', true), navigation.push("Detail", { 'menu_url': item })
                                                                                            }}
                                                                                            style={styles.recentlyViewProduct}
                                                                                            productNameView={{ width: wp('44%'), alignItems: 'flex-start', paddingVertical: 0, marginTop: 10, paddingHorizontal: 8 }}
                                                                                            productImageStyle={styles.recentlyviewIcon}
                                                                                            productImage={{ uri: imageUrl + item?.product_image }}
                                                                                            productName={item?.product_name}
                                                                                            numberOfLines={1}
                                                                                            rupeesIconStyle={{ width: 12.5, height: 12.5, top: 0.5 }}
                                                                                            productPrice={`${country?.country?.currency_symbol} ${item?.product_price ? item?.product_price : '0'}`}
                                                                                            oldPrice={`${country?.country?.currency_symbol} ${item?.product_price_detail.old_price}`}
                                                                                            productPriceStyle={{ fontSize: 14, fontFamily: Typography.RobotoBold }}
                                                                                            productOldPricePriceStyle={{ fontSize: 13, fontFamily: Typography.LatoMedium }}
                                                                                            rating_avg={item?.rating_avg}
                                                                                            review_count={item.review_count}
                                                                                            delivery_frequency={item?.delivery_frequency}
                                                                                            onClick={() => {
                                                                                                item?.is_in_wishlist == 1 ? removeWishlistProduct(item?.slug, 'recommended') : AddWishlistProduct(item?.slug, 'recommended')
                                                                                                setWishListLoader(prev => ({ ...prev, 'selecttedSPId': item?._id }))
                                                                                            }}
                                                                                            heartIcon={item?.is_in_wishlist == 1 ? heartActiveIcon : ImagePath.Other?.heartIcon}
                                                                                            loader={item._id == wishListLoader?.selecttedSPId && wishListLoader?.similarWishList}
                                                                                        />
                                                                                    </View>
                                                                                )
                                                                            }}
                                                                        />
                                                                    </View>
                                                                }

                                                                {/* See What Other Customers Are Buying */}
                                                                <Spacer style={{ height: 15 }} />
                                                                {(recentlyProduct?.length > 0 && imageUrl) &&
                                                                    <View>
                                                                        <View style={styles.recentlyProduct}>
                                                                            <BoldLabel title={'See What Other Customers Are Buying'} boldStyle={styles.upgradeStyle} />
                                                                        </View>
                                                                        <FlatList
                                                                            data={recentlyProduct}
                                                                            horizontal
                                                                            showsVerticalScrollIndicator={false}
                                                                            showsHorizontalScrollIndicator={false}
                                                                            ListFooterComponent={<Spacer style={{ marginTop: 0, marginRight: 10 }} />}
                                                                            renderItem={({ item, index }) => {

                                                                                return (
                                                                                    <View key={item?._id} >
                                                                                        <ProductList
                                                                                            onClickProduct={() => {
                                                                                                setUncheck({ ...check, 'productSlug': item?.slug })
                                                                                                getDetailData('', true), navigation.push("Detail", { 'menu_url': item })
                                                                                            }}
                                                                                            style={styles.recentlyViewProduct}
                                                                                            productImageStyle={styles.recentlyviewIcon}
                                                                                            productNameView={{ width: wp('44%'), alignItems: 'flex-start', paddingVertical: 0, marginTop: 10, paddingHorizontal: 8 }}
                                                                                            productImage={{ uri: imageUrl + item?.product_image }}
                                                                                            productName={item?.product_name}
                                                                                            numberOfLines={1}
                                                                                            rupeesIconStyle={{ width: 12.5, height: 12.5, top: 0.5 }}
                                                                                            productPrice={`${country?.country?.currency_symbol} ${item?.product_price ? item?.product_price : '0'}`}
                                                                                            oldPrice={`${country?.country?.currency_symbol} ${item?.product_price_detail.old_price}`}
                                                                                            rating_avg={item?.rating_avg}
                                                                                            review_count={item.review_count}
                                                                                            delivery_frequency={item?.delivery_frequency}
                                                                                            onClick={() => {
                                                                                                item?.is_in_wishlist == 1 ? removeWishlistProduct(item?.slug, 'seeWhatOther') : AddWishlistProduct(item?.slug, 'seeWhatOther')
                                                                                                setWishListLoader(prev => ({ ...prev, 'selecttedRPId': item?._id }))
                                                                                            }}
                                                                                            heartIcon={item?.is_in_wishlist == 1 ? heartActiveIcon : ImagePath.Other?.heartIcon}
                                                                                            productPriceStyle={{ fontSize: 14, fontFamily: Typography.LatoBold }}
                                                                                            productOldPricePriceStyle={{ fontSize: 13, fontFamily: Typography.LatoMedium }}
                                                                                            loader={item._id == wishListLoader?.selecttedRPId && wishListLoader?.recentlyWishList}
                                                                                        />
                                                                                    </View>
                                                                                )
                                                                            }}
                                                                        />
                                                                    </View>
                                                                }

                                                                {datePic && deliveryType?.seasonal_date?.seasonal_content &&
                                                                    <View style={styles.dateSelectMessage}>
                                                                        < Label style={styles.dateSelectMessageText} text={deliveryType?.seasonal_date?.seasonal_content} />
                                                                    </View>}

                                                                {datePic && deliveryType?.special_delivery_msg?.status === "success" &&
                                                                    <View style={styles.dateSelectMessage}>
                                                                        < Label style={styles.dateSelectMessageText} text={deliveryType?.special_delivery_msg?.special_date_result?.special_content} />
                                                                    </View>}

                                                                {datePic && deliveryType?.product_hike_price?.hike_price_text &&
                                                                    <View style={styles.dateSelectMessage}>
                                                                        < Label style={styles.dateSelectMessageText} text={deliveryType?.product_hike_price?.hike_price_text} />
                                                                    </View>}

                                                                <Spacer styles={{ marginTop: 0, height: 35, width: '100%' }} />
                                                            </View>
                                                        </>
                                                    }
                                                    showsHorizontalScrollIndicator={false}
                                                    showsVerticalScrollIndicator={false}
                                                    renderItem={({ item, index }) => {

                                                        return (
                                                            userData?.result?.product_status == 1 ?
                                                                <ProductList
                                                                    onClickProduct={() => { setSelect(index), setUpgrageOption(item?.selectQuantity) }}
                                                                    style={[styles.upgradeOptionContainer, {
                                                                        borderColor: select == index ? Colors.Secondary.Black : '#00000052',
                                                                        backgroundColor: select == index ? Colors.Fantasy : Colors.White,
                                                                        marginLeft: index == 0 ? wp('3%') : wp('2%')
                                                                    }]}
                                                                    productNameView={{ marginTop: 8 }}
                                                                    productImage={select == index ? item.selctIcon : item.unSelectIcon}
                                                                    productImageStyle={{ width: Size.x5l, height: Size.x5l, }}
                                                                    productNameStyle={{ fontSize: 12, fontFamily: Typography.poppinsSemiBold, color: Colors.Dune, textAlign: 'center', }}
                                                                    productPriceStyle={{ fontSize: 14, fontFamily: Typography.RobotoBold }}
                                                                    productName={item.title}
                                                                    description={item?.description}
                                                                    rupeesIconStyle={{ top: 1 }}
                                                                    productPrice={`${country?.country?.currency_symbol} ${item?.newPrice ? item?.newPrice : 0}`}
                                                                />
                                                                :
                                                                <View />
                                                        );
                                                    }} />
                                            }
                                        </View>

                                        {(showChangeCityModal == true && productDataGift?.length === 0) && onCityChangepPopup()}
                                        {/* contry  RBSheet*/}
                                        <RBSheet
                                            ref={refLocationRBSheet}
                                            closeOnDragDown={true}
                                            closeOnPressMask={true}
                                            customStyles={{
                                                container: {
                                                    borderTopLeftRadius: 36,
                                                    borderTopRightRadius: 36,
                                                    height: 'auto',
                                                },
                                                wrapper: {
                                                    backgroundColor: "rgba(142, 142, 147, 0.42)"
                                                },
                                                draggableIcon: {
                                                    backgroundColor: Colors.Black
                                                },
                                                draggableIcon: {
                                                    backgroundColor: Colors.Black
                                                }
                                            }}
                                        >
                                            <View style={{ marginHorizontal: Size.m011 }}>
                                                <RegularLabel style={styles.sheetTitle} title={
                                                    openSheet == 0 ? "Select Location" :
                                                        openSheet == 1 ? "Select City" :
                                                            openSheet == 2 ? "Select Delivery" : "Select Time"
                                                } />
                                            </View>

                                            {(openSheet === 0 || openSheet == 1) &&
                                                <View>
                                                    <NewInputText
                                                        containerStyle={{ height: 42, borderColor: Colors.Camel, marginTop: 10 }}
                                                        placeholder={`Search Delivery ${openSheet === 0 ? 'Country' : 'City'}`}
                                                        name="Search"
                                                        value={searchCtyOrCountry}
                                                        onChangeText={(text) => {
                                                            setSearchCtyOrCountry(text);
                                                            searchData(text);
                                                        }}
                                                    />
                                                    <Spacer style={styles.citiesTopBorder} />
                                                </View>
                                            }

                                            <FlatList
                                                style={{ margin: Size.m011, height: '30%' }}
                                                showsVerticalScrollIndicator={false}
                                                showsHorizontalScrollIndicator={false}
                                                data={openSheet == 0 ? showCountry : openSheet == 1 ? showCity : openSheet == 2 ? deliveryType?.result : timeData}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <TouchableOpacity style={styles.cityContain}
                                                            onPress={() => {
                                                                item?.shipping_method_name && handleChange('delivery')(item?.shipping_method_name);
                                                                item?.timeSlot && handleChange('time')(item?.timeSlot);
                                                                closeSheet(item)
                                                            }} key={item?._id} disabled={item?.is_available == 0 ? true : false}>
                                                            <View>
                                                                <Label style={{ fontSize: 14, }} text={
                                                                    item?.country_name ? item?.country_name
                                                                        : item?.city_name ? item?.city_name :
                                                                            item?.shipping_method_name ? `${item?.shipping_method_name}` : item?.timeSlot
                                                                } />
                                                                {(item?.timeSlot && item?.is_available == 0) && <View style={[styles.disCountBoder, { backgroundColor: Colors.SmokeyGrey, borderColor: Colors.SmokeyGrey }]} />}
                                                            </View>
                                                            <Icon source={((country?.country.country_name == item?.country_name) || (values?.city == item?.city_name) || (values?.delivery == item?.shipping_method_name) || (values?.time == item?.timeSlot)) ? ImagePath.Other?.radioBlack : ImagePath.Other?.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />
                                                        </TouchableOpacity>

                                                    )
                                                }}
                                            />
                                        </RBSheet>

                                        {/* date  Modal*/}
                                        {showDatePicker && (
                                            <Modal
                                                animationType="none"
                                                transparent={true}
                                                visible={showDatePicker}
                                                onRequestClose={() => {
                                                    setShowDatePicker(!showDatePicker);
                                                }}>
                                                <TouchableWithoutFeedback onPress={() => showDatePicker == true && setShowDatePicker(false)} >
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }} >
                                                        <TouchableOpacity style={{ width: '93%', backgroundColor: Colors.White, borderRadius: 5 }} activeOpacity={10} disabled={false}>

                                                            <CalendarPicker
                                                                disabledDates={productDetailBaseOnCity?.block_date_list ? productDetailBaseOnCity?.block_date_list : blockTimeData?.result?.block_date_list}
                                                                startFromMonday={true}
                                                                allowRangeSelection={false}
                                                                scaleFactor={375}
                                                                minDate={new Date()}
                                                                headerWrapperStyle={{ width: '100%', marginTop: 5 }}
                                                                todayBackgroundColor={Colors.WhiteLinen}
                                                                selectedDayTextColor={Colors.Black}
                                                                previousTitleStyle={{ color: Colors.Black }}
                                                                nextTitleStyle={{ color: Colors.Black }}
                                                                selectedStartDate={datePic ? datePic : ''}
                                                                onDateChange={(date, type) => {
                                                                    deliveryDate(date)
                                                                    setShowDatePicker(!showDatePicker);
                                                                }}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </Modal>

                                        )}

                                        {/* addGift */}
                                        {addGift()}
                                    </View>
                                </>
                            </View>
                        )}
                    </Formik>
                </ScrollView>}
            {isLoding ?
                <View />
                :
                userData?.result?.product_status == 1 &&
                ((zipCodeTogal == true && zipCodeError === '' && userData?.website_data?.zip_based_delivery === 1) || userData?.website_data?.zip_based_delivery === 0) && userData?.result?.in_stock == 1 &&
                <View style={styles.buttonMainCon}>
                    <Button
                        disabled={userData.result.product_price === 0 ? true : false}
                        style={[styles.bottonContainers, { opacity: userData.result.product_price === 0 ? 0.7 : 0.99 }]}
                        onPress={() => {
                            formikRef.current.submitForm()
                            setShowComboData(false)
                            formikRef.current.validateForm().then((validationErrors) => {
                                handleFormSubmission(validationErrors, formikRef.current.values);
                            })
                        }}
                        title={Strings.detail.GIFTADDONS}
                        labelStyle={styles.buttonName}
                    />

                    <Button
                        disabled={userData.result.product_price === 0 ? true : false}
                        style={[styles.bottonContainers, { opacity: userData.result.product_price === 0 ? 0.7 : 0.99, backgroundColor: Colors.Secondary.Black, flexDirection: 'row-reverse' }]}
                        onPress={() => {
                            formikRef.current.submitForm()
                            setShowComboData(false)
                            formikRef.current.validateForm().then((validationErrors) => {
                                handleFormSubmission(validationErrors, formikRef.current.values);
                            });
                        }}
                        title={Strings.detail.addToCart}
                        labelStyle={[styles.buttonName, { color: Colors.White, marginRight: 10 }]}
                        icon
                    />
                </View>
            }

        </SafeAreaView >
    )
};