import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, SafeAreaView, Platform, UIManager, Dimensions, Image, ScrollView, TouchableOpacity, ImageBackground, Modal, FlatList, TextInput, TouchableWithoutFeedback, Keyboard, AccessibilityActionInfo, findNodeHandle, Text, LayoutAnimation } from 'react-native';
import styles from "./styles";
import stylesList from "../Listing/styles";
import { Button, Loader, ToastSuccess, ToastError, AlertError, RowColumn, ProductList, NewHeader, ProgressiveImage, ReviewRatingDetail, NewInputText, RadioButton, ReviewRating } from "../../../components";
import { Size, Colors, Strings, Icon, ImagePath, BoldLabel, RegularLabel, Label, Spacer, Typography, GlobalConstant } from "../../../constants";
import RBSheet from "react-native-raw-bottom-sheet";
import { Formik, } from "formik";
import * as yup from 'yup'
import { instance, apiFormPost } from "../../../utils";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect, } from "@react-navigation/native";
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


const Detail = ({ navigation, route }) => {

    const { width } = Dimensions.get('screen');
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
    const [descriptionTopbar, setDescriptionTopbar] = useState(Strings.detail.description);
    const [openSheet, setOpenSheet] = useState(0);
    const [recentlyProduct, setRecentlyProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState();
    const [selectDateType, setSelectDateType] = useState(0);
    const [searchCtyOrCountry, setSearchCtyOrCountry] = useState('');
    const [showCountry, setShowCountry] = useState([]);
    const [showCity, setShowCity] = useState([]);
    const country = useSelector((state) => state.country);
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
        recentlyRiewedProduct();
    }, [country?.country?.currency_symbol]);

    //get_product_details api
    const getDetailData = async (cityId = '', loadData = true) => {
        loadData == true ? setLoding(true) : setLoding(false);

        instance.post('/get_product_details', {
            req: { "data": { "product_slug": check?.productSlug ? check?.productSlug : productSlug, "city_id": cityId } }
        }).then(async (response) => {

            const userData = JSON.parse(response?.data)
            if (userData?.status === 'success') {
                getupgradeOptionData(userData)
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
                setLoding(false)
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

    const getupgradeOptionData = (userData) => {
        if (userData?.result?.flower_display_varient === 1 && userData?.result?.varientopt === 1) {
            setUpgradeOptionData([
                { _id: 1, title: 'Classic', description: userData.result?.dtqtext1, selctIcon: ImagePath.webIcons.classic_icon, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' },
                { _id: 2, title: 'Double The Quantity', description: userData.result?.dtqtext2, selctIcon: ImagePath.webIcons.deluxe_icon, newPrice: userData?.result?.product_price_detail?.double_price, selectQuantity: 'double_the_quantity' },
            ]);
        } else if (userData?.result?.varientopt === 2) {
            setUpgradeOptionData([
                { _id: 1, title: 'Classic', description: userData.result?.ttvtext1, selctIcon: ImagePath.webIcons.classic_icon, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' },
                { _id: 2, title: 'Deluxe', description: userData.result?.ttvtext2, selctIcon: ImagePath.webIcons.deluxe_icon, newPrice: userData?.result?.product_price_detail?.deluxe_price, selectQuantity: 'deluxe' },
                { _id: 3, title: 'Premium', description: userData.result?.ttvtext3, selctIcon: ImagePath.webIcons.premium_icon, newPrice: userData?.result?.product_price_detail?.premium_price, selectQuantity: 'premium' },
            ]);
        } else if (userData?.result?.cake_display_varient === 1 && userData?.result?.cakevarientopt == 1) {
            setUpgradeOptionData([
                { _id: 1, title: 'Classic', description: userData.result?.cakedtqtext1, selctIcon: ImagePath.webIcons.classic_icon, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' },
                { _id: 2, title: 'Make It Special', description: userData.result?.cakedtqtext2, selctIcon: ImagePath.webIcons.deluxe_icon, newPrice: userData?.result?.product_price_detail?.special_price, selectQuantity: 'make_it_special' },
            ]);
        } else if (userData?.result?.cakevarientopt === 2) {
            setUpgradeOptionData([
                { _id: 1, title: 'Classic', description: userData.result?.cakettvtext1, selctIcon: ImagePath.webIcons.classic_icon, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' },
                { _id: 2, title: 'Make It Special', description: userData.result?.cakettvtext2, selctIcon: ImagePath.webIcons.deluxe_icon, newPrice: userData?.result?.product_price_detail?.mkspecial_price, selectQuantity: 'make_it_special' },
                { _id: 3, title: 'Make It Extra Special', description: userData.result?.cakettvtext3, selctIcon: ImagePath.webIcons.deluxe_icon, newPrice: userData?.result?.product_price_detail?.mkextspecial_price, selectQuantity: 'make_it_extra_special' },
            ]);
        } else {
            setUpgradeOptionData([{ _id: 1, title: 'Classic', description: userData.result?.dtqtext1, selctIcon: ImagePath.webIcons.classic_icon, newPrice: userData?.result?.product_price_detail?.new_price, selectQuantity: 'standard' }]);
        };
    }

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
    useFocusEffect(useCallback(() => {
        // getDetailData();
        // recentlyRiewedProduct();
        getCountryData();
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
        setTimeData([]);
    }, []));

    // togal description type array
    const expandData = [
        { _id: '1', description: Strings.detail.description, },
        { _id: '2', description: Strings.detail.careGuide, },
        { _id: '3', description: Strings.detail.flowerCareUnit, },
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
                                    style={{}}
                                    data={productDataGift}
                                    numColumns={2}
                                    ListHeaderComponent={<>
                                        <View style={styles.rowContainer}>
                                            <Icon style={{ width: 50, height: 50, }} source={ImagePath.Other.addon_icon} />
                                            <Label style={{ fontSize: 18, fontFamily: Typography.RobotoBold, marginLeft: 15 }} text={Strings.detail.GIFTADDONS} />
                                            <View style={{ alignItems: 'flex-end', flex: 1 }}>
                                                <TouchableOpacity onPress={() => setShowAddonGift(false)} activeOpacity={0.7} hitSlop={styles.hitSlop}>
                                                    <Icon style={{ width: 15, height: 15, }} source={ImagePath.Home.crossPink} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>}
                                    ListFooterComponent={<Spacer style={{ marginTop: 0, height: 65, width: '100%' }} />}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        let isadded = isAddedAsAddon(item?.slug);
                                        return (
                                            <>
                                                <ProductList
                                                    onClickProduct={() => (isadded) ? removeAddon(item) : addAddon(item)}
                                                    clickOnAddonButton={() => (isadded) ? removeAddon(item) : addAddon(item)}
                                                    disabled={(isadded?.quantity == undefined || isadded?.quantity == 1) ? false : true}
                                                    style={{ borderRadius: 7, elevation: 1.3, paddingTop: 5, padding: 0, marginLeft: wp('5%'), marginHorizontal: wp('2%'), }}
                                                    productImage={{ uri: imagePath + item?.product_image }}
                                                    productImageStyle={styles.addonIcon}
                                                    productName={item?.product_name}
                                                    numberOfLines={1}
                                                    productPrice={`${country?.country?.currency_symbol} ${item?.product_price}`}
                                                    productNameStyle={{ textAlign: 'center' }}
                                                    productPriceStyle={{ textAlign: 'center', flex: 1, marginBottom: 4 }}
                                                    addonButton
                                                    clickOnIncrement={() => { (isadded) ? updateAddonQty(item, isadded?.quantity + 1) : addAddon(item) }}
                                                    clictOnDecrement={() => { (isadded) ? isadded?.quantity === 1 ? removeAddon(item) : updateAddonQty(item, isadded?.quantity - 1) : '' }}
                                                    value={(isadded) ? isadded?.quantity : 0}
                                                    addonIcon={(isadded) ? ImagePath.Home.addAddon : ImagePath.Home.addon}
                                                    addonIconStyle={{ width: (isadded) ? 30 : 20, height: (isadded) ? 30 : 20 }}
                                                    addonViewStyle={{ top: (isadded) ? 2 : 10, right: (isadded) ? 0 : 7 }}
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
                            <View style={{ backgroundColor: Colors.White, paddingVertical: 8, paddingHorizontal: 16 }}>
                                <Button
                                    style={giftStyle.button}
                                    primaryButton
                                    title={addonData?.length > 0 ? `PROCEED` : Strings.Home.continueWA}
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
        city: yup.string().required("Please choose a city."),
        date: yup.date().required("Please choose a date."),
        delivery: yup.string().required('Please choose a delivery.'),
        time: yup.string().required('Please choose a time.'),
    });

    const recentlyRiewedProduct = () => {
        instance.post('/recently_viewed_product', {
            req: { "data": { type: "most_viewed", product_slug: productSlug } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData?.status === 'success') {
                setRecentlyProduct(userData?.result)
            }
        }).catch(error => {
            console.log("recentlyRiewedProduct=====catch====", error);
            AlertError(Strings.Other.catchError);
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
        html: descriptionTopbar == Strings.detail.description ? userData?.result?.description : descriptionTopbar == Strings.detail.careGuide ? userData?.result?.left_content : userData?.result?.right_content
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
                <ScrollView ref={scrollViewRef} nestedScrollEnabled={true} style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
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
                                <View style={{}}>
                                    {selectedProduct == undefined ?
                                        <SkeletonPlaceholder>
                                            <SkeletonPlaceholder.Item
                                                height={width}
                                                width={width}
                                            />
                                        </SkeletonPlaceholder>
                                        :
                                        <View style={{ paddingLeft: 12 }}>
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
                                                            style={{ width: width - 24, height: width }}
                                                            resizeMode='contain'
                                                        />
                                                    )
                                                }}
                                            />
                                            <Label style={{ bottom: 10, fontSize: 13 }} text={`Product ID: #${productData?.product_unique_id}`} />
                                        </View>
                                    }

                                    <View style={{ marginTop: 0, alignItems: "center", justifyContent: 'center' }}>
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
                                                                    height={55}
                                                                    width={55}
                                                                    marginRight={10}
                                                                    borderRadius={5}
                                                                    marginTop={20}
                                                                />
                                                            </SkeletonPlaceholder>
                                                            :
                                                            <TouchableOpacity
                                                                onPress={() => onSelect(index)}
                                                                activeOpacity={0.9}
                                                            >
                                                                <ProgressiveImage
                                                                    style={{
                                                                        width: 55, height: 55, marginRight: 11, borderRadius: 5, borderWidth: 1,
                                                                        borderColor: item?.image ? index === indexSelected ? Colors.Black : Colors.White : index == 0 ? Colors.Camel : Colors.White,
                                                                        opacity: index === indexSelected ? null : 0.99 && indexSelected && index == 0 && index != 0 ? 0.5 : null ? null : 0.5,
                                                                    }}
                                                                    source={{ uri: imageUrl + item?.image }}
                                                                    resizeMode={'contain'}
                                                                />
                                                            </TouchableOpacity>
                                                        }
                                                    </>
                                                )
                                            }}
                                        />
                                    </View>

                                    <View style={{ paddingHorizontal: '3%', marginTop: 14, }}>
                                        {selectedProduct == undefined ?
                                            <SkeletonPlaceholder>
                                                <SkeletonPlaceholder.Item
                                                    height={30}
                                                    width={'80%'}
                                                />
                                            </SkeletonPlaceholder>
                                            : <Label style={styles.productName} text={productData?.product_name || ''} numberOfLines={1} />
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
                                                    <View style={[{ marginTop: productData?.product_status ? 5 : 15, alignItems: "center", flexDirection: 'row', }]}>
                                                        <View style={styles.ratingContainer}>
                                                            <ReviewRating reviews={productData?.rating_avg} />
                                                        </View>

                                                        <View style={{ marginLeft: 10 }}>
                                                            <RegularLabel title={`${productData?.review_count ? productData?.review_count.toString() : '0'} ratings`} regularStyle={{ color: Colors.WaterBlue, fontSize: 14 }} />
                                                        </View>
                                                    </View>
                                                </>}
                                        </View>

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
                                                            disabled={true}
                                                            viewStyle={{ marginTop: 5 }}
                                                            labelStyle1={{ color: Colors.RossoCorsa, fontSize: 17, fontFamily: Typography.poppinsSemiBold }}
                                                            title1={`${country?.country?.currency_symbol} ${productData?.product_price ? productData?.product_price : '0'}`}
                                                        />}
                                                </>
                                            :
                                            null
                                        }
                                    </View>

                                    <FlatList
                                        data={upgradeOptionData}
                                        scrollEnabled={false}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => {
                                            return (
                                                userData?.result?.product_status == 1 ?
                                                    <TouchableOpacity
                                                        onPress={() => { setSelect(index), setUpgrageOption(item?.selectQuantity) }}
                                                        style={styles.upgradeOptionView} activeOpacity={0.7}
                                                    >
                                                        <View style={styles.upgradeOptionContain}>
                                                            <RadioButton
                                                                style={{ borderColor: select == index ? Colors.WaterBlue : Colors.Concord, borderRadius: 10 }}
                                                                selected={select == index}
                                                                disabled={true}
                                                                otherActiveIcon={true}
                                                            />
                                                            <Icon style={{ marginLeft: 4, width: 33, height: 33 }} source={item.selctIcon} />
                                                            <View style={{ marginLeft: 8, flex: 1, minWidth: 60, }}>
                                                                <Label style={{ fontSize: 13, fontFamily: Typography.poppinsMedium }} text={item.title} />
                                                                <Label style={{ fontSize: 13.5, fontFamily: Typography.poppinsMedium, color: Colors.Concord, marginTop: 3 }} text={`${country?.country?.currency_symbol} ${item?.newPrice ? item?.newPrice : 0}`} />
                                                            </View>
                                                        </View>
                                                        <View style={{ marginHorizontal: 13, flex: 1, paddingVertical: 8 }}>
                                                            <Label style={{ fontSize: 13, lineHeight: 20, color: Colors.Concord, fontFamily: Typography.poppinsMedium }} text={item.description} />
                                                        </View>
                                                    </TouchableOpacity>
                                                    :
                                                    <View />
                                            );
                                        }}
                                    />

                                    <View style={{ marginTop: 16 }}>
                                        <View>
                                            {userData?.result?.product_status == 1 ?
                                                <View style={{ paddingHorizontal: '3%' }}>
                                                    {productData?.add_vase === 1 ?
                                                        <TouchableOpacity onPress={() => {
                                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                            setUncheck({ ...check, 'check': !check?.check })
                                                        }}
                                                            activeOpacity={0.9}
                                                            style={{ flexDirection: "row", alignItems: "center", marginTop: Size.xm, }}>
                                                            <RegularLabel title={`${Strings.detail.glassVase} ${country?.country?.currency_symbol} ${productData?.product_price_detail?.vase_price || '0'}`}
                                                                regularStyle={{ fontSize: 14, fontFamily: Typography.poppinsMedium }}
                                                            />
                                                            <RadioButton
                                                                style={[styles.glassVase, { alignItems: check?.check ? 'flex-end' : 'flex-start', backgroundColor: check?.check ? Colors.Black : Colors.BorderColor, }]}
                                                                radioActiveView={styles.activeGlassVase}
                                                                iconStyle={styles.activeGlassVase}
                                                                selected={check?.check}
                                                                disabled={true}
                                                                otherActiveIcon={true}
                                                            />
                                                        </TouchableOpacity> : null}

                                                    {productData?.add_eggless == 1 ?
                                                        <TouchableOpacity onPress={() => {
                                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                            setUncheckeEggless(!checkEggless)
                                                        }}
                                                            activeOpacity={0.9}
                                                            style={{ flexDirection: "row", alignItems: "center", marginTop: Size.xm, }}>
                                                            <RegularLabel title={`${Strings.detail.cakeEggless} ${country?.country?.currency_symbol} ${productData?.product_price_detail?.eggless_price || '0'}`}
                                                                regularStyle={{ fontSize: 14, fontFamily: Typography.poppinsMedium }}
                                                            />
                                                            <RadioButton
                                                                style={[styles.glassVase, { alignItems: checkEggless ? 'flex-end' : 'flex-start', backgroundColor: checkEggless ? Colors.Black : Colors.BorderColor, }]}
                                                                radioActiveView={styles.activeGlassVase}
                                                                iconStyle={styles.activeGlassVase}
                                                                selected={checkEggless}
                                                                disabled={true}
                                                                otherActiveIcon={true}
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
                                                selectedProduct != undefined &&
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
                                                <Spacer style={{ height: 7 }} />
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
                                        {(userData?.result?.left_content || userData?.result?.right_content || userData?.result?.description) &&
                                            <>
                                                <View style={styles.descriptionContainer}>
                                                    {expandData?.map((item) => {
                                                        return (
                                                            <TouchableOpacity onPress={() => setDescriptionTopbar(item?.description)} activeOpacity={0.7} key={item?._id}
                                                                style={[styles.descriptionView, { borderColor: item.description == descriptionTopbar ? Colors.DoveGray : Colors.White }]}>
                                                                <Label style={[styles.descriptionHeading, { color: item.description == descriptionTopbar ? Colors.Black : Colors.Concord, }]} text={item.description} />
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                </View>

                                                <View style={{ paddingHorizontal: 5 }}>
                                                    <RenderHtml
                                                        contentWidth={width}
                                                        source={source}
                                                        tagsStyles={styles.htmlCode}
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
                                                <View style={[styles.recentlyProduct, { marginTop: 5 }]}>
                                                    <BoldLabel title={Strings.detail.recommendedForYou} boldStyle={styles.upgradeStyle} />
                                                    <Spacer style={styles.bottmBorder} />
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
                                                                    style={styles.productBorder}
                                                                    productImage={{ uri: imageUrl + item?.product_image }}
                                                                    productImageStyle={styles.flowerIcon}
                                                                    productName={item?.product_name}
                                                                    numberOfLines={1}
                                                                    productPrice={`${country?.country?.currency_symbol} ${item?.product_price || '0'}`}
                                                                    productNameStyle={{ textAlign: 'center' }}
                                                                    productPriceStyle={{ textAlign: 'center', flex: 1, marginBottom: 4, color: Colors.DoveGrayNew, }}
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
                                                    <BoldLabel title={Strings.detail.seeWhatOtherCustomers} boldStyle={styles.upgradeStyle} />
                                                    <Spacer style={styles.bottmBorder} />
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
                                                                    style={styles.productBorder}
                                                                    productImage={{ uri: imageUrl + item?.product_image }}
                                                                    productImageStyle={styles.flowerIcon}
                                                                    productName={item?.product_name}
                                                                    numberOfLines={1}
                                                                    productPrice={`${country?.country?.currency_symbol} ${item?.product_price || '0'}`}
                                                                    productNameStyle={{ textAlign: 'center' }}
                                                                    productPriceStyle={{ textAlign: 'center', flex: 1, marginBottom: 4 }}
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
                                </View>

                                {(showChangeCityModal == true && productDataGift?.length === 0) && onCityChangepPopup()}
                                {/* contry  RBSheet*/}
                                <RBSheet
                                    ref={refLocationRBSheet}
                                    closeOnDragDown={true}
                                    closeOnPressMask={true}
                                    customStyles={styles.commonSheet}
                                >
                                    <View style={{ marginHorizontal: Size.m011 }}>
                                        <RegularLabel regularStyle={styles.sheetTitle} title={
                                            openSheet == 0 ? "Choose Country" :
                                                openSheet == 1 ? Strings.detail.selectCity :
                                                    openSheet == 2 ? "Choose Delivery" : "Choose Time"
                                        } />
                                    </View>

                                    {(openSheet === 0 || openSheet == 1) &&
                                        <NewInputText
                                            mainContainerStyle={{ marginHorizontal: 16 }}
                                            containerStyle={{ height: 42, marginTop: 10, }}
                                            placeholder={`Search ${openSheet === 0 ? 'Country' : 'City'}`}
                                            name="Search"
                                            value={searchCtyOrCountry}
                                            onChangeText={(text) => {
                                                setSearchCtyOrCountry(text);
                                                searchData(text);
                                            }}
                                        />
                                    }

                                    <FlatList
                                        style={{ margin: Size.m011, height: '30%' }}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        // nestedScrollEnabled={true}
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
                        style={[styles.bottonContainers, { backgroundColor: Colors.Secondary.Black, flexDirection: 'row' }]}
                        onPress={() => {
                            formikRef.current.submitForm()
                            setShowComboData(false)
                            formikRef.current.validateForm().then((validationErrors) => {
                                handleFormSubmission(validationErrors, formikRef.current.values);
                            });
                        }}
                        title={Strings.detail.addToCart}
                        labelStyle={[styles.buttonName]}
                        icon={ImagePath.webIcons.cart}
                        cartIconStyle={{ tintColor: Colors.White }}
                    />
                </View>
            }
        </SafeAreaView>
    )
}
export default Detail;