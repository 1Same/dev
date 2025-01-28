import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import styles from "./styles";
import { Button, ToastError, AlertError, Loader, NewHeader, NewInputText, ComonBottomSheet, RowColumn, RadioButton } from "../../../components";
import { Size, Colors, Strings, Icon, ImagePath, RobotoRegularLabel, RobotoMediumLabel, OpenSansBoldLabel, OpenSansRegularLabel, RegularLabel, Label, Typography, Spacer } from "../../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Formik } from "formik";
import { CountryPicker } from "react-native-country-codes-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import * as yup from 'yup'
import { Validation, instance } from "../../../utils";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

export default SelectAddress = ({ route, navigation }) => {

    const refCountryRBSheet = useRef();
    const refAreaRBSheet = useRef();
    const refCityRBSheet = useRef();
    const refStateRBSheet = useRef();
    const [select, setSelect] = useState(true);
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [cityData, setCityData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [countryId, setCountryId] = useState(userCartData?.country_data?._id);
    const [addressListData, setAddressListData] = useState([]);
    const [showAddressList, setShowAddressList] = useState([]);
    const [isLoading, setLoading] = useState({ 'loading': false, lodeMore: false });
    const [isLoadMore, setLoadMore] = useState(false);
    const [stateData, setStateData] = useState([]);
    const [country, setCountry] = useState();
    const [city, setCity] = useState();
    const [cityId, setCityId] = useState();
    const [area, setArea] = useState();
    const [isTextInputFocused, setIsTextInputFocused] = useState(false);
    const [searchCtyOrCountry, setSearchCtyOrCountry] = useState('');
    const [showCountry, setShowCountry] = useState([]);
    const [showCity, setShowCity] = useState([]);
    const [showState, setShowState] = useState([]);
    const [getBillingCity, setBillingCity] = useState([]);
    const authData = useSelector((state) => state?.auth);
    const userCartData = route?.params?.userCartData;
    const isFocused = useIsFocused();
    const [selected, setSelected] = useState({ sameShippingDetails: false, saveToAddressBook: true });

    const addressValidationSchema = yup.object().shape({
        first_name: Validation.firstName,
        last_name: Validation.lastName,
        address: Validation.address,
        mobile: Validation.mobileNumber,
        countryCode: yup.string().required('Please select a country code.'),
        country_name: Validation.country,
        city_name: Validation.city,
        zipcode: '',

        firstNameBill: Validation.firstName,
        lastNameBill: Validation.lastName,
        billingAddress: yup.string().required('Billing Address is required'),
        mobileNumberBill: Validation.mobileNumber,
        countrySelect: yup.string().required('Please select a country.'),
        citySelect: yup.string().required('Please select a city.'),
        stateSelect: (stateData?.length > 0 && authData?.data?.country_name === 'India') ? yup.string().required('Please select a state.') : '',
        vatNumber: ''
    })

    const initialValues = {
        first_name: '',
        last_name: '',
        address: '',
        mobile: '',
        countryCode: '+91',
        country_name: userCartData?.country_data?.country_name,
        city_name: userCartData?.userCartData?.city_data?.city_name,
        zipcode: '',

        firstNameBill: authData?.data?.first_name || '',
        lastNameBill: authData?.data?.last_name || '',
        billingAddress: authData?.data?.address || '',
        mobileNumberBill: authData?.data?.mobile || '',
        countryC: authData?.data?.mobile_code || '+91',
        countrySelect: authData?.data?.country_name || '',
        citySelect: authData?.data?.city_name || '',
        stateSelect: authData?.data?.state || '',
        vatNumber: '',
    }
    const [editInitialValues, setEditInitialValues] = useState(initialValues);

    const handleClick = (item, values) => {
        setSelected((prevState) => ({
            ...prevState,
            [item]: !prevState[item],
        }));
        if (item === 'sameShippingDetails') {
            let addressVal = {
                first_name: values?.first_name,
                last_name: values?.last_name,
                address: values?.address,
                mobile: values?.mobile,
                countryCode: values?.countryCode || '+91',
                country_name: userCartData?.country_data?.country_name,
                city_name: userCartData?.userCartData?.city_data?.city_name,
                zipcode: values?.zipcode,

                firstNameBill: !selected?.sameShippingDetails ? values?.first_name : '',
                lastNameBill: !selected?.sameShippingDetails ? values?.last_name : '',
                billingAddress: !selected?.sameShippingDetails ? values?.address : '',
                mobileNumberBill: !selected?.sameShippingDetails ? values?.mobile : '',
                countryC: values?.countryCode || '+91',
                countrySelect: values?.country_name,
                citySelect: values?.city_name,
                stateSelect: values?.stateSelect,
            };
            let oldAddressVal = editInitialValues;
            let currAddressVal = { ...oldAddressVal, ...addressVal }
            setEditInitialValues(currAddressVal)
        }

    };

    useEffect(() => {
        if (isFocused == true) {
            setSelected({ ...selected, sameShippingDetails: false })
            getCartList();
            getAddressList();
            getState();
            getCountry();
            getCityShipping();
            getAreas();
            getCityBaseCountry();
        }
    }, [isFocused]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsTextInputFocused(true);
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsTextInputFocused(false);
            },
        );
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const getAddressList = (type = false) => {
        setLoading(prevS => ({ ...prevS, 'loading': type == true ? false : true, 'loadMoreLoading': type == true ? true : false }));
        instance.post('/customer_address_list', {
            req: { "data": { "city_id": userCartData?.userCartData?.city_id } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setAddressListData(userData?.result);
                let oldDataOne = userData?.result[0];
                let oldDataTwo = userData?.result[1];
                userData?.result?.length > 2 ? setShowAddressList([oldDataOne, oldDataTwo]) : setShowAddressList(userData?.result);
                setLoading(prevS => ({ ...prevS, 'loading': false, 'loadMoreLoading': false }));
            } else {
                setLoading(prevS => ({ ...prevS, 'loading': false, 'loadMoreLoading': false }));
            }
        }).catch(error => {
            navigation.navigate('CatchError');
            setLoading(prevS => ({ ...prevS, 'loading': false, 'loadMoreLoading': false }));
            AlertError(Strings.Other.catchError);
            console.log('getAddressList=======catch====', error);
        });
    }

    const getCountry = async (data) => {
        instance.post('/get_country', {
            req: { "data": {} }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setCountryData(userData?.result);
                    setShowCountry(userData?.result);
                    const cartCountry = userData?.result.find((item) => item.id == userCartData?.userCartData?.country_id);
                    getState();
                    setCountry(cartCountry);
                    let oldCountry = editInitialValues
                    let newCountry = { country_name: cartCountry?.text }
                    let currCountry = { ...oldCountry, ...newCountry }
                    setEditInitialValues(currCountry)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCountry=======catch====', error);
            });
    };

    const getCityShipping = async () => {
        instance.post('/get_bill_city_base_on_country', {
            req: { "data": { "country_id": userCartData?.userCartData?.country_id } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setCityData(userData?.result);
                    const cartCity = userData?.result?.find((item) => item.id == userCartData?.userCartData?.city_id);
                    setCity(cartCity);
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCityShipping=======catch====', error);
            });
    };

    const getCityBaseCountry = async () => {
        instance.post('/get_city_base_on_country', {
            req: { "data": { "country_id": authData?.data?.country_id } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setBillingCity(userData?.result)
                    setShowCity(userData?.result)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCityBaseCountry=======catch====', error);
            });
    };

    const getAreas = async () => {
        instance.post('/get_areas', {
            req: { "data": { "city_id": userCartData?.userCartData?.city_id } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setArea(userData);
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getAreas=======catch====', error);
            });
    };

    const getCity = async (country_id) => {
        setCountryId(country_id);
        instance.post('/get_bill_city_base_on_country', {
            req: { "data": { "country_id": country_id } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setCityData(userData?.result);
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCity=======catch====', error);
            });
    };

    const getState = (country_id) => {
        instance.post('/get-states', {
            req: { "data": { "country_id": country_id ? country_id : userCartData?.userCartData?.country_id } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response?.data);
                if (userData?.status === 'success') {
                    setStateData(userData?.result)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getState=======catch====', error);
            });
    };

    const getCityInitial = () => {
        instance.post('/get_bill_city_base_on_country', {
            req: { "data": { country_id: countryId } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setCityData(userData?.result)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCityInitial=======catch====', error);
            });
    };

    const saveOrderBeforePayment = (val) => {
        getCartList(select);
        setLoadMore(true);
        const requestData = {
            ship_first_name: val?.first_name,
            ship_last_name: val?.last_name,
            ship_address: val?.address,
            ship_mobile_number: val?.mobile,
            ship_country_id: userCartData?.userCartData?.country_id,
            ship_city_id: userCartData?.userCartData?.city_id,
            ship_zipcode: val?.zipcode,

            bill_first_name: val?.firstNameBill,
            bill_last_name: val?.lastNameBill,
            bill_address: val?.billingAddress,
            bill_country_id: authData.data?.country_id ? authData.data?.country_id : countryId ? countryId : userCartData?.country_data?._id,
            bill_city_id: authData.data?.city_id ? authData.data?.city_id : cityId,
            bill_state: val?.stateSelect,
            bill_mobile: val?.mobileNumberBill,
            bill_vat_number: val?.vatNumber,
            mobile: val?.countryC,
            ship_mobile_code: val?.countryCode,
            user_cart_id: userCartData?.userCartData?._id,
            save_to_address_book: selected?.saveToAddressBook
        }

        instance.post('/save_order_before_payment', {
            req: { "data": requestData }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    // console.log('saveOrderBeforePayment=========', userData);
                    navigation.navigate('Summary', { "userCartData": userCartData, 'orderNumber': userData?.result?.order_number })
                    setLoadMore(false);
                }
                else {
                    console.log('saveOrderBeforePayment=====else====', userData?.message);
                    setLoadMore(false);
                    AlertError(userData?.message[0])
                }
            }).catch(error => {
                console.log('saveOrderBeforePayment=====catch====', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setLoadMore(false);
            });
    };

    useEffect(() => {
        getCityInitial();
    }, [countryId]);

    const scrollViewRef = useRef(null);
    const formikRef = useRef(null);

    const refarr = {
        "first_name": useRef(null),
        "last_name": useRef(null),
        "address": useRef(null),
        "mobile": useRef(null),
        "country_name": useRef(null),
        "city_name": useRef(null),

        "firstNameBill": useRef(null),
        "lastNameBill": useRef(null),
        "billingAddress": useRef(null),
        "mobileNumberBill": useRef(null),
        "countrySelect": useRef(null),
        "citySelect": useRef(null),
        "stateSelect": useRef(null),
    };

    const handleFormSubmission = (errors, values) => {
        if (Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            const inputField = refarr[firstErrorField]?.current;
            if (inputField) {
                inputField.measureLayout(
                    scrollViewRef.current, (x, y) => {
                        scrollViewRef.current.scrollTo({ x: 0, y: y - 100, animated: true });
                    }
                );
            }
        }
    };

    const getCartList = async (addressId = '') => {
        instance.post('/get_cart_list', {
            req: { "data": { address_id: addressId } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData?.status === 'success') {
                let shipAddress = {
                    first_name: userData?.userCartData?.ship_first_name || '',
                    last_name: userData?.userCartData?.ship_last_name || '',
                    address: userData?.userCartData?.ship_address || '',
                    mobile: userData?.userCartData?.ship_mobile || '',
                    mobile_number: userData?.userCartData?.ship_mobile_number || '',
                    mobile_code: userData?.userCartData?.ship_mobile_code || '+91',
                    country_name: userData?.country_data?.country_name || '',
                    city_name: userData?.userCartData?.city_data?.city_name || '',
                    zipcode: userData?.userCartData?.ship_zipcode || '',
                    city_id: userData?.userCartData?.ship_city_id,
                    country_id: userData?.userCartData?.ship_country_id,
                }
                let oldShipAddress = editInitialValues
                let currShipAddress = { ...oldShipAddress, ...shipAddress }
                setEditInitialValues(currShipAddress);
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('shopingCart=======catch==', error);
        });
    };

    const searchData = (searchVal = '', searchType = '') => {
        const dataToFilter = searchType === 'country' ? countryData || [] : getBillingCity || [];
        const result = dataToFilter.filter((item) => item.text?.toLowerCase().includes(searchVal.toLowerCase()));
        searchType === 'country' ? setShowCountry(result) : searchType === 'city' ? setShowCity(result) : setShowState(result);
    };

    const lodeMoreSet = () => {
        if (isLoading?.lodeMore != true) {
            setShowAddressList([...addressListData]);
        }
        if (isLoading?.lodeMore == true) {
            let oldDataOne = addressListData[0];
            let oldDataTwo = addressListData[1];
            let currAddressList = [oldDataOne, oldDataTwo]
            setShowAddressList(currAddressList);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {isLoading?.loading ?
                <Loader mainContainer={{ marginVertical: '4%' }} />
                :
                <>
                    <NewHeader />
                    <ScrollView style={{ flexGrow: 1 }} ref={scrollViewRef} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        <View style={{ alignSelf: "center", marginTop: 10 }}>
                            <RobotoMediumLabel robotoMediumStyle={{ fontSize: 14, }} title={Strings.Payment.CheckOut} />
                        </View>

                        <View style={styles.mainProcessBarCount}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={styles.countView} activeOpacity={0.7}>
                                    <RobotoRegularLabel title={`${'1'}`} robotoRegularStyle={styles.countStyle} />
                                </View>
                                <View style={styles.borderView} />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={[styles.countView, { borderColor: Colors.QuiteGrey, }]}>
                                    <RobotoRegularLabel title={`${'2'}`} robotoRegularStyle={[styles.countStyle, { opacity: .8, color: Colors.QuiteGrey }]} />
                                </View>
                                <View style={[styles.borderView, { opacity: null }]} />
                            </View>

                            <View style={[styles.countView, { borderColor: Colors.QuiteGrey, backgroundColor: Colors.WhiteSmoke }]}>
                                <RobotoRegularLabel title={`${'3'}`} robotoRegularStyle={[styles.countStyle, { opacity: .3, color: null }]} />
                            </View>
                        </View>

                        <View style={styles.proccessUpdateView}>
                            <RobotoRegularLabel title={Strings.Payment.DeliveryDetails} robotoRegularStyle={{ fontSize: 11, }} />
                            <RobotoRegularLabel title={Strings.Payment.OrderSummary} robotoRegularStyle={{ fontSize: 11, right: 14 }} />
                            <RobotoRegularLabel title={Strings.Payment.payment} robotoRegularStyle={{ fontSize: 11, right: 14 }} />
                        </View>

                        <View style={styles.thinBorderView} />
                        <View style={[styles.proccessUpdateView, { marginHorizontal: 19, marginTop: 20 }]}>
                            <RobotoMediumLabel title={Strings.SelectAddress.selectAddress} robotoMediumStyle={{ fontSize: 16 }} />
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => navigation.navigate('AddAddress', { goto: "SelectAddress", 'userCartData': userCartData })}
                                style={styles.addNewBtn}
                            >
                                <RobotoRegularLabel
                                    title={`${'+'} ${'Add New'}`}
                                    robotoRegularStyle={{ fontSize: 13, color: Colors.White }}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 15 }}>
                            {addressListData?.length > 0 ?
                                <FlatList
                                    data={showAddressList}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    scrollEnabled={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity key={item._id} activeOpacity={0.6} onPress={() => {
                                                if (item?.country_name == country?.text && item?.city_name == city?.text) {
                                                    setSelect(item._id);
                                                    let oldShipAddress = editInitialValues
                                                    let currShipAddress = { ...oldShipAddress, ...item }
                                                    setEditInitialValues(currShipAddress)
                                                    setCountryId(item.country_id);
                                                } else {
                                                    ToastError("Cannot select different cities or countries.")
                                                }
                                            }}
                                                style={[styles.boxContainer, {}]}>
                                                <View style={styles.subContainer}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                                                        <OpenSansBoldLabel title={item.first_name} openSansBoldStyle={{ fontSize: Size.m0, color: Colors.WoodCharcoal }} />
                                                        <OpenSansBoldLabel title={item.last_name} openSansBoldStyle={{ fontSize: Size.m0, paddingLeft: Size.xs1, color: Colors.WoodCharcoal }} />
                                                    </View>
                                                    <View style={{ left: 3 }}>
                                                        <Icon source={select == item._id ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtn}
                                                            style={{ width: Size.xl, height: Size.xl, opacity: item?.country_name == country?.text && item?.city_name == city?.text ? null : .4 }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ width: '77%', marginTop: Size.xs2 }}>
                                                    <OpenSansRegularLabel title={item.mobile_number} />
                                                </View>
                                                <View style={{ width: '77%', marginTop: Size.xs2 }}>
                                                    <OpenSansRegularLabel title={item.address} />
                                                </View>
                                                <View style={{ width: '77%', marginTop: Size.xs2 }}>
                                                    <OpenSansRegularLabel title={`${item.city_name},${item.country_name}`} />
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                /> :
                                <View style={{ marginLeft: 19 }}>
                                    <Label style={[{ color: Colors.Black, fontSize: 13.5 }]} text={Strings.Other.noSavedAddress} />
                                </View>
                            }
                            {/* {(isLoading?.addressListDataLength > 2 && isLoading?.addressListDataLength !== addressListData?.length) && */}
                            {addressListData?.length > 2 &&
                                < TouchableOpacity
                                    onPress={() => {
                                        setLoading({ ...isLoading, 'lodeMore': !isLoading.lodeMore });
                                        lodeMoreSet();
                                    }}
                                    style={{ paddingVertical: 5 }}
                                    activeOpacity={0.7}>
                                    {isLoading?.loadMoreLoading == true ? <Loader loadStyle={styles.loader} size={'small'} /> :
                                        <Label style={styles.lodeMore} text={isLoading.lodeMore ? 'View Less' : 'View More'} />}
                                </TouchableOpacity>}
                        </View>

                        <View style={styles.thinBorderView} />
                        <View style={styles.addressRow}>
                            <OpenSansBoldLabel title={Strings.AddAddress.shippingAddress} openSansBoldStyle={{ fontSize: Size.m011, color: Colors.WoodCharcoal }} />
                        </View>

                        <Formik
                            innerRef={formikRef}
                            validationSchema={addressValidationSchema}
                            enableReinitialize
                            initialValues={editInitialValues}
                            onSubmit={values => saveOrderBeforePayment(values)}
                        >
                            {({ handleChange, handleBlur, handleSubmit, touched, values, errors, setFieldError }) => (
                                <View style={{}}>
                                    <NewInputText
                                        ref={refarr["first_name"]}
                                        inputName={Strings.AddAddress.firstName}
                                        placeholder={Strings.AddAddress.firstName}
                                        onChangeText={handleChange('first_name')}
                                        onBlur={handleBlur('first_name')}
                                        name="firstName"
                                        value={values.first_name}
                                        touched={touched.first_name}
                                        errors={errors.first_name}
                                    />
                                    <NewInputText
                                        ref={refarr["last_name"]}
                                        inputName={Strings.AddAddress.lastName}
                                        placeholder={Strings.AddAddress.lastName}
                                        onChangeText={handleChange('last_name')}
                                        onBlur={handleBlur('last_name')}
                                        name="lastName"
                                        value={values.last_name}
                                        touched={touched.last_name}
                                        errors={errors.last_name}
                                    />
                                    <NewInputText
                                        ref={refarr["address"]}
                                        inputName={Strings.MyProfile.receipientAddress}
                                        placeholder={Strings.MyProfile.receipientAddress}
                                        onChangeText={handleChange('address')}
                                        onBlur={handleBlur('address')}
                                        name="address"
                                        value={values.address}
                                        touched={touched.address}
                                        errors={errors.address}
                                    />
                                    <NewInputText
                                        ref={refarr["mobile"]}
                                        inputName={Strings.AddAddress.mobile}
                                        placeholder={Strings.AddAddress.mobile}
                                        onChangeText={handleChange('mobile')}
                                        onBlur={handleBlur('mobile')}
                                        name="mobileNumber"
                                        keyboardType="numeric"
                                        value={values.mobile}
                                        touched={touched.mobile}
                                        errors={errors.mobile}
                                        dialCode={values.countryCode}
                                        onClick={() => setShow(true)}
                                    />
                                    <View style={styles.rowInputView}>
                                        <NewInputText
                                            ref={refarr["country_name"]}
                                            mainContainerStyle={{ marginHorizontal: 0 }}
                                            containerStyle={[styles.inputView, { backgroundColor: Colors.CasvadingWhite }]}
                                            inputName={Strings.MyProfile.country}
                                            placeholder={Strings.AddAddress.country}
                                            onChangeText={handleChange('country_name')}
                                            onBlur={handleBlur('country_name')}
                                            name="country"
                                            value={values.country_name}
                                            touched={touched.country_name}
                                            errors={errors.country_name}
                                            editable={false}
                                        />

                                        <NewInputText
                                            ref={refarr["city_name"]}
                                            mainContainerStyle={{ marginHorizontal: 0, marginLeft: 19 }}
                                            containerStyle={[styles.inputView, { backgroundColor: Colors.CasvadingWhite }]}
                                            inputName={Strings.MyProfile.city}
                                            placeholder={Strings.AddAddress.city}
                                            onChangeText={handleChange('city_name')}
                                            onBlur={handleBlur('city_name')}
                                            name="city"
                                            value={values.city_name}
                                            touched={touched.city_name}
                                            errors={errors.city_name}
                                            editable={false}
                                        />
                                    </View>
                                    <NewInputText
                                        inputName={Strings.AddAddress.zipCode}
                                        placeholder={Strings.AddAddress.zipCode}
                                        onChangeText={handleChange('zipcode')}
                                        onBlur={handleBlur('zipcode')}
                                        name="zipCode"
                                        value={values.zipcode}
                                        requiredFeld={false}
                                    />

                                    <View style={{ alignSelf: 'flex-end', marginHorizontal: 19, marginTop: 10 }}>
                                        <RadioButton
                                            onClick={() => handleClick('saveToAddressBook')}
                                            selected={selected?.saveToAddressBook}
                                            radioDescription={"Save To Address Book"}
                                        />
                                    </View>

                                    <View style={{ marginTop: 15 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 19 }}>
                                            <OpenSansBoldLabel title={Strings.AddAddress.billingDetail} openSansBoldStyle={{ fontSize: Size.m011, color: Colors.WoodCharcoal }} />
                                            <RadioButton
                                                onClick={() => handleClick('sameShippingDetails', values)}
                                                selected={selected?.sameShippingDetails}
                                                radioDescription={"Same as shipping details"}
                                            />
                                        </View>
                                        <NewInputText
                                            ref={refarr["firstNameBill"]}
                                            inputName={Strings.AddAddress.firstName}
                                            placeholder={Strings.AddAddress.firstName}
                                            onChangeText={handleChange('firstNameBill')}
                                            onBlur={handleBlur('firstNameBill')}
                                            name="firstNameBill"
                                            value={values.firstNameBill}
                                            touched={touched.firstNameBill}
                                            errors={errors.firstNameBill}
                                        />
                                        <NewInputText
                                            ref={refarr["lastNameBill"]}
                                            inputName={Strings.AddAddress.lastName}
                                            placeholder={Strings.AddAddress.lastName}
                                            onChangeText={handleChange('lastNameBill')}
                                            onBlur={handleBlur('lastNameBill')}
                                            name="lastNameBill"
                                            value={values.lastNameBill}
                                            touched={touched.lastNameBill}
                                            errors={errors.lastNameBill}
                                        />
                                        <NewInputText
                                            ref={refarr["billingAddress"]}
                                            inputName={Strings.SelectAddress.billingAdd}
                                            placeholder={Strings.MyProfile.receipientAddress}
                                            onChangeText={handleChange('billingAddress')}
                                            onBlur={handleBlur('billingAddress')}
                                            name="billingAddress"
                                            value={values.billingAddress}
                                            touched={touched.billingAddress}
                                            errors={errors.billingAddress}
                                        />
                                        <NewInputText
                                            ref={refarr["mobileNumberBill"]}
                                            inputName={Strings.AddAddress.mobile}
                                            placeholder={Strings.AddAddress.mobile}
                                            onChangeText={handleChange('mobileNumberBill')}
                                            onBlur={handleBlur('mobileNumberBill')}
                                            name="mobileNumberBill"
                                            keyboardType="numeric"
                                            value={values.mobileNumberBill}
                                            touched={touched.mobileNumberBill}
                                            errors={errors.mobileNumberBill}
                                            dialCode={values.countryC}
                                            onClick={() => setOpen(true)}
                                        />
                                        <View style={[styles.rowInputView, { justifyContent: 'space-between' }]}>
                                            <View ref={refarr["countrySelect"]} style={[styles.inputView, {}]}>
                                                <ComonBottomSheet
                                                    onClick={() => {
                                                        refCountryRBSheet.current.open();
                                                        setSearchCtyOrCountry('');
                                                        searchData('', 'country');
                                                    }}
                                                    name={Strings.MyProfile.country}
                                                    value={values.countrySelect ? values.countrySelect : 'Select country'}
                                                    touched={touched.countrySelect}
                                                    errors={errors.countrySelect}
                                                />
                                            </View>
                                            <View ref={refarr["citySelect"]} style={[styles.inputView, {}]}>
                                                <ComonBottomSheet
                                                    onClick={() => {
                                                        (cityData?.length && !values?.countrySelect) ? AlertError('Select country first') : (cityData?.length ? refCityRBSheet.current.open() : ToastError('country based city not available'))
                                                        setSearchCtyOrCountry('');
                                                        searchData('', 'city');
                                                    }}
                                                    name={Strings.MyProfile.city}
                                                    value={values?.citySelect ? values?.citySelect : 'Select city'}
                                                    touched={touched.citySelect}
                                                    errors={errors.citySelect}
                                                />
                                            </View>
                                        </View>

                                        <View style={[styles.rowInputView, { justifyContent: 'space-between' }]}>
                                            {(stateData?.length > 0 && authData?.data?.country_name == 'India') ?
                                                <View ref={refarr["stateSelect"]} style={[styles.inputView]}>
                                                    <ComonBottomSheet
                                                        onClick={() => {
                                                            refStateRBSheet.current.open();
                                                            setSearchCtyOrCountry('');
                                                            searchData('', 'state');
                                                        }}
                                                        name={Strings.EditMyprofile.state}
                                                        value={values?.stateSelect ? values?.stateSelect : 'Select state'}
                                                        touched={touched.stateSelect}
                                                        errors={errors.stateSelect}
                                                    />
                                                </View>
                                                :
                                                authData?.data?.country_name === 'India' &&
                                                <NewInputText
                                                    ref={refarr["stateSelect"]}
                                                    mainContainerStyle={{ marginHorizontal: 0 }}
                                                    containerStyle={[styles.inputView, {}]}
                                                    inputName={Strings.EditMyprofile.state}
                                                    placeholder={Strings.EditMyprofile.state}
                                                    onChangeText={handleChange('stateSelect')}
                                                    onBlur={handleBlur('stateSelect')}
                                                    name="stateSelect"
                                                    value={values.stateSelect}
                                                    errors={errors.stateSelect}
                                                    touched={touched.stateSelect}
                                                />
                                            }
                                            <NewInputText
                                                mainContainerStyle={{ marginHorizontal: 0 }}
                                                containerStyle={[styles.inputView, { width: wp(authData?.data?.country_name === 'India' ? '42.5%' : '90%') }]}
                                                inputName={Strings.EditMyprofile.vatNumber}
                                                placeholder={Strings.EditMyprofile.vatNumber}
                                                onChangeText={handleChange('vatNumber')}
                                                onBlur={handleBlur('vatNumber')}
                                                name="vatNumber"
                                                value={values.vatNumber}
                                                requiredFeld={false}
                                            />
                                        </View>
                                        <Spacer />
                                    </View>

                                    {/* {Shipping countryPicker} */}
                                    <CountryPicker
                                        show={show}
                                        onBackdropPress={() => setShow(false)}
                                        style={{
                                            modal: { height: 500, },
                                            dialCode: { color: "black" },
                                            countryName: { color: "black" }
                                        }}
                                        pickerButtonOnPress={(item) => {
                                            setShow(false);
                                            handleChange('countryCode')(item.dial_code)
                                        }}
                                    />
                                    {/* {Shipping countryPicker} */}
                                    <CountryPicker
                                        show={open}
                                        onBackdropPress={() => setOpen(false)}
                                        style={{
                                            modal: { height: 500, },
                                            dialCode: { color: "black" },
                                            countryName: { color: "black" }
                                        }}
                                        pickerButtonOnPress={(item) => {
                                            setOpen(false);
                                            handleChange('countryC')(item.dial_code)
                                        }}
                                    />
                                    {/* {Area bottmsheet} */}
                                    <RBSheet
                                        ref={refAreaRBSheet}
                                        closeOnDragDown={true}
                                        closeOnPressMask={true}
                                        customStyles={{
                                            container: {
                                                borderTopLeftRadius: 36,
                                                borderTopRightRadius: 36,
                                                height: 'auto',
                                            },
                                            wrapper: { backgroundColor: "rgba(142, 142, 147, 0.42)" },
                                            draggableIcon: { backgroundColor: Colors.Black },
                                            draggableIcon: { backgroundColor: Colors.Black }
                                        }}
                                    >
                                        <View style={{ marginLeft: 17, paddingVertical: 10 }}>
                                            <RegularLabel style={{ fontSize: Size.m011, color: Colors.Black, textAlign: 'center', }} title={"Select Area"} />
                                        </View>

                                        <ScrollView style={{ marginHorizontal: 17, height: '42%', }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                            <View style={{}}>
                                                {area?.result?.map((data, index) => {
                                                    return (
                                                        data?.text !== 'Select Area' &&
                                                        <View key={index} style={{ width: '100%' }}>
                                                            < RowColumn
                                                                touchableStyle={[styles.cityContain, { borderBottomWidth: data.text !== 'Select Country' ? 1 : 0 }]}
                                                                onClick={() => {
                                                                    refAreaRBSheet.current.close();
                                                                    handleChange("Area")(data?.text);
                                                                }}
                                                                Image={values.Area == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite}
                                                                style={{ height: Size.xl, width: Size.xl }}
                                                                label={data.text}
                                                            />
                                                        </View>
                                                    )
                                                }

                                                )}
                                            </View>
                                        </ScrollView>
                                    </RBSheet>
                                    {/* {Country bottmsheet} */}
                                    <RBSheet
                                        ref={refCountryRBSheet}
                                        closeOnDragDown={true}
                                        closeOnPressMask={true}
                                        customStyles={{
                                            container: {
                                                borderTopLeftRadius: 36,
                                                borderTopRightRadius: 36,
                                                height: 'auto',
                                            },
                                            wrapper: { backgroundColor: "rgba(142, 142, 147, 0.42)" },
                                            draggableIcon: { backgroundColor: Colors.Black },
                                            draggableIcon: { backgroundColor: Colors.Black }
                                        }}
                                    >
                                        <View style={{ marginLeft: 21, paddingVertical: 10 }}>
                                            <RegularLabel style={{ fontSize: Size.m011, color: Colors.Black, textAlign: 'center', }} title={"Select Country"} />
                                        </View>
                                        <NewInputText
                                            containerStyle={{ height: 42, borderColor: Colors.Camel, marginTop: 5 }}
                                            placeholder={'Search Country'}
                                            name="Search"
                                            value={searchCtyOrCountry}
                                            onChangeText={(text) => {
                                                setSearchCtyOrCountry(text);
                                                searchData(text, 'country');
                                            }}
                                        />
                                        <Spacer style={styles.citiesTopBorder} />

                                        <ScrollView style={{ marginHorizontal: 17, height: '42%', }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                            <View style={{}}>
                                                {showCountry?.map((data, index) => {
                                                    return (
                                                        <View key={index} style={{ width: '100%' }}>
                                                            < RowColumn
                                                                touchableStyle={[styles.cityContain, { borderBottomWidth: data.text !== 'Select Country' ? 1 : 0 }]}
                                                                onClick={() => {
                                                                    refCountryRBSheet.current.close();
                                                                    getState(data.id);
                                                                    getCity(data.id);
                                                                    handleChange("countrySelect")(data.text);
                                                                    handleChange('citySelect')('');
                                                                    handleChange('stateSelect')('')
                                                                }}
                                                                Image={values?.countrySelect == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite}
                                                                style={{ height: Size.xl, width: Size.xl }}
                                                                label={data.text}
                                                            />
                                                        </View>
                                                    )
                                                }

                                                )}
                                            </View>
                                        </ScrollView>
                                    </RBSheet>
                                    {/* {city bottmsheet} */}
                                    <RBSheet
                                        ref={refCityRBSheet}
                                        closeOnDragDown={true}
                                        closeOnPressMask={true}
                                        customStyles={{
                                            container: {
                                                borderTopLeftRadius: 36,
                                                borderTopRightRadius: 36,
                                                height: 'auto',
                                            },
                                            wrapper: { backgroundColor: "rgba(142, 142, 147, 0.42)" },
                                            draggableIcon: { backgroundColor: Colors.Black },
                                            draggableIcon: { backgroundColor: Colors.Black }
                                        }}
                                    >
                                        <View style={{ marginLeft: 17, paddingVertical: 10 }}>
                                            <RegularLabel style={{ fontSize: Size.m011, color: Colors.Black, textAlign: 'center', }} title={"Select City"} />
                                        </View>
                                        <NewInputText
                                            containerStyle={{ height: 42, borderColor: Colors.Camel, marginTop: 5 }}
                                            placeholder={'Search City'}
                                            name="Search"
                                            value={searchCtyOrCountry}
                                            onChangeText={(text) => {
                                                setSearchCtyOrCountry(text);
                                                searchData(text, 'city');
                                            }}
                                        />
                                        <Spacer style={styles.citiesTopBorder} />
                                        <ScrollView style={{ marginHorizontal: 17, height: '42%', }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                            {showCity?.map((data, index) => {
                                                return (
                                                    <View key={index} style={{ width: '100%' }}>
                                                        <RowColumn
                                                            touchableStyle={[styles.cityContain, { borderBottomWidth: data.text !== 'Select Country' ? 1 : 0 }]}
                                                            onClick={() => {
                                                                refCityRBSheet.current.close();
                                                                setCityId(data?.id);
                                                                // getState(data.id);
                                                                handleChange('citySelect')(data?.text);
                                                                Keyboard.dismiss();
                                                            }}
                                                            Image={values.citySelect == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite}
                                                            style={{ height: Size.xl, width: Size.xl }}
                                                            label={data.text}
                                                        />
                                                    </View>
                                                )
                                            })}
                                        </ScrollView>
                                    </RBSheet>
                                    {/* {state bottmsheet} */}
                                    <RBSheet
                                        ref={refStateRBSheet}
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

                                        <View style={{ marginLeft: 17, paddingVertical: 10 }}>
                                            <RegularLabel style={{ fontSize: Size.m011, color: Colors.Black, textAlign: 'center', }} title={"Select State"} />
                                        </View>
                                        <NewInputText
                                            containerStyle={{ height: 42, borderColor: Colors.Camel, marginTop: 5 }}
                                            placeholder={'Search state'}
                                            name="Search"
                                            value={searchCtyOrCountry}
                                            onChangeText={(text) => {
                                                setSearchCtyOrCountry(text);
                                                searchData(text, 'state');
                                            }}
                                        />
                                        <Spacer style={styles.citiesTopBorder} />
                                        <ScrollView style={{ marginHorizontal: 17, height: '42%', }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                            <View style={{}}>
                                                {showState?.map((data, index) =>
                                                    <View key={index} style={{ width: '100%' }}>
                                                        < RowColumn
                                                            touchableStyle={[styles.cityContain, { borderBottomWidth: data.text !== 'Select Country' ? 1 : 0 }]}
                                                            onClick={() => {
                                                                // handleChange('citySelect')('');
                                                                handleChange('stateSelect')(data?.text);
                                                                refStateRBSheet.current.close();
                                                                Keyboard.dismiss();
                                                            }}
                                                            Image={values.stateSelect == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite}
                                                            style={{ height: Size.xl, width: Size.xl }}
                                                            label={data?.text}
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        </ScrollView>
                                    </RBSheet>
                                </View>
                            )}
                        </Formik>
                    </ScrollView>

                    {!isTextInputFocused &&
                        <View style={{ backgroundColor: Colors.White, }}>
                            <Button
                                onPress={() => {
                                    formikRef.current.submitForm()
                                    Keyboard.dismiss()
                                    formikRef.current.validateForm().then((validationErrors) => {
                                        handleFormSubmission(validationErrors, formikRef.current.values);
                                    })
                                }}
                                disabled={isLoadMore ? true : false}
                                title={isLoadMore ? <Loader /> : Strings.SelectAddress.SELECTADDRESS}
                                style={styles.addressButton}
                            />
                        </View>
                    }
                </>}
        </SafeAreaView >
    )
}