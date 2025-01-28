import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, BackButtonHeader, Loader, ToastSuccess, ToastError, AlertError, NewInputText, ComonBottomSheet } from "../../../components";
import { Size, Colors, Strings, Icon, ImagePath, RegularLabel, Label, Spacer, } from "../../../constants";
import { CountryPicker } from "react-native-country-codes-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import { Formik } from "formik";
import * as yup from 'yup'
import { Validation } from "../../../utils";
import { instance } from "../../../utils";
import { useSelector } from "react-redux";

export default AddAddress = ({ route, navigation }) => {

    let addressValidationSchema;
    addressValidationSchema = yup.object().shape({
        firstName: Validation.firstName,
        lastName: Validation.lastName,
        address: Validation.address,
        countryCode: yup.string().required('Please select a country code.'),
        pinCode: yup.string().required('Please enter a pin code.'),
        mobileNumber: Validation.mobileNumber,
        altNum: Validation.altNum,
        citySelect: yup.string().required('Please select a city.'),
        countrySelect: yup.string().required('Please select a country.'),
    });

    const [show, setShow] = useState(false);
    const [altShow, setAltShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadMore, setIsLoadMore] = useState(false)
    const refCountryRBSheet = useRef();
    const refDayRBSheet = useRef();
    const country = useSelector((state) => state.country);

    useEffect(() => {
        getCountry();
        route.params?.address_id ? editAddress(route.params?.address_id) : getCartList();
    }, []);

    const getAddAddress = (values) => {
        setIsLoadMore(true)

        const requestData = {
            address: values.address,
            city_id: cityId,
            country_id: countryId,
            first_name: values.firstName,
            last_name: values.lastName,
            mobile: values.mobileNumber,
            zipcode: values.pinCode,
            alternate_mobile: values.altNum,
            mobile_code: values.countryCode,
            // alternate_mobile_code: values.altNum == '' ? '' : values.altCountryCode,
            alternate_mobile_iso_code: altISOCode,
            mobile_iso_code: mobileISOCode
        };

        instance.post('/customer_add_address', {
            req: { "data": requestData }
        }).then(async (response) => {

            const userData = JSON.parse(response?.data);

            if (userData?.status === 'success') {
                route.params?.goto ? navigation.navigate(route.params.goto, { 'userCartData': route?.params?.userCartData }) : navigation.navigate('AddressBook')
                setIsLoadMore(false)
                ToastSuccess(userData?.message)
            }
            else {
                ToastError(userData?.message)
                setIsLoadMore(false)
            }

        }).catch(error => {
            AlertError(Strings.Other.catchError)
            setIsLoadMore(false)

        });
    };

    const getCartList = async () => {
        setIsLoading(true);
        instance.post('/get_cart_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData?.status === 'success') {
                const apiEditData = {
                    firstName: '',
                    lastName: '',
                    address: '',
                    pinCode: '',
                    citySelect: userData.userCartData?.city_data?.city_name,
                    countrySelect: userData?.country_data?.country_name,
                    mobileNumber: '',
                    countryCode: userData?.country_data?.dial_code ? userData?.country_data?.dial_code : "+91",
                }
                setCityId(userData?.userCartData?.city_data?._id)
                setCountryId(userData?.country_data?._id)
                setEditInitialValues(apiEditData)
                setIsLoading(false);
            }
            else {
                setIsLoading(false);
            }
        }).catch(error => {
            console.log('summaryList=====catch=====', error);
            navigation.navigate('CatchError');
            AlertError(Strings.Other.catchError);
            setIsLoading(false);
        });
    };

    const initialValues = {
        firstName: '', lastName: '', address: '', pinCode: '',
        citySelect: '', countrySelect: '', mobileNumber: '',
        countryCode: country?.country?.dial_code ? country?.country?.dial_code : '+91',
    };

    const [cityData, setCityData] = useState([]);
    const [cityId, setCityId] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [countryId, setCountryId] = useState([]);
    const [mobileISOCode, setMobileISOCode] = useState('');
    const [altISOCode, setAltISOCode] = useState('');
    const [searchCtyOrCountry, setSearchCtyOrCountry] = useState('');
    const [showCountry, setShowCountry] = useState([]);
    const [showCity, setShowCity] = useState([]);
    const [editInitialValues, setEditInitialValues] = useState(initialValues);

    useEffect(() => {
        getCityInitial()
    }, [countryId]);

    const getCountry = async (data) => {
        instance.post('/get_country_website_wise', {
            req: { "data": {} }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setCountryData(userData?.result)
                    setShowCountry(userData?.result);
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCountry======catch===', error);
            });
    };

    const getCity = async (id) => {
        setCountryId(id)
        instance.post('/get_city_base_on_country', {
            req: { "data": { country_id: id } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setCityData(userData?.result)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCity======catch===', error);
            });
    };

    const getCityInitial = () => {
        instance.post('/get_city_base_on_country', {
            req: { "data": { country_id: countryId } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setCityData(userData?.result)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCountry======catch===', error);
            });
    };

    const editAddress = (id) => {
        setIsLoading(true)
        instance.post('/customer_view_address', {
            req: { "data": { address_id: id } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status == 'success') {
                const apiEditData = {
                    firstName: userData.result.first_name,
                    lastName: userData.result.last_name,
                    address: userData.result.address,
                    pinCode: userData.result.zipcode,
                    citySelect: userData.result.city_name,
                    countrySelect: userData.result.country_name,
                    mobileNumber: userData.result.mobile,
                    countryCode: userData.result.mobile_code,
                }
                setCityId(userData.result.city_id)
                setCountryId(userData?.result.country_id)
                setEditInitialValues(apiEditData)
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
            }
        }).catch(error => {
            setIsLoading(false);
            AlertError(Strings.Other.catchError);
            console.log('editAddress======catch===', error);
        })
    };

    const updateAddress = (values) => {
        setIsLoadMore(true)
        const requestData = {
            address_id: route.params?.address_id,
            address: values.address,
            city_id: cityId,
            country_id: countryId,
            first_name: values.firstName,
            last_name: values.lastName,
            mobile: values.mobileNumber,
            zipcode: values.pinCode,
            alternate_mobile: values.altNum,
            mobile_code: values.countryCode,
            mobile_iso_code: mobileISOCode,
            state: ""
        };

        instance.post('/customer_edit_address', {
            req: { "data": requestData }
        })
            .then((response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    route.params?.goto ? navigation.navigate(route.params.goto) : navigation.navigate('AddressBook')
                    setIsLoadMore(false)
                    ToastSuccess(userData?.message)
                }
                else {
                    ToastError(userData?.message)
                    setIsLoadMore(false)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('updateAddress======catch===', error);
                setIsLoadMore(false)
            });
    };

    const searchData = (searchVal = '', searchType = '') => {
        const dataToFilter = searchType === 'country' ? countryData || [] : cityData || [];
        const result = dataToFilter.filter((item) => item.text?.toLowerCase().includes(searchVal.toLowerCase()));
        searchType === 'country' ? setShowCountry(result) : setShowCity(result);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {isLoading ?
                <Loader />
                :
                <>
                    <BackButtonHeader
                        containerStyle={[styles.headerContainer, {}]}
                    />
                    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        <Formik
                            validationSchema={addressValidationSchema}
                            initialValues={editInitialValues}
                            enableReinitialize
                            onSubmit={(values) => {
                                route.params?.address_id ? updateAddress(values) : getAddAddress(values)
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, touched, values, errors, setFieldValue, setTouched }) => (
                                <View>
                                    <View style={{}}>
                                        <NewInputText
                                            inputName={Strings.AddAddress.firstName}
                                            placeholder={Strings.AddAddress.firstName}
                                            onChangeText={handleChange('firstName')}
                                            onBlur={handleBlur('firstName')}
                                            name="firstName"
                                            value={values.firstName}
                                            touched={touched.firstName}
                                            errors={errors.firstName}
                                        />
                                        <NewInputText
                                            inputName={Strings.AddAddress.lastName}
                                            placeholder={Strings.AddAddress.lastName}
                                            onChangeText={handleChange('lastName')}
                                            onBlur={handleBlur('lastName')}
                                            name="lastName"
                                            value={values.lastName}
                                            touched={touched.lastName}
                                            errors={errors.lastName}
                                        />
                                        <NewInputText
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
                                            inputName={Strings.AddAddress.mobile}
                                            placeholder={Strings.AddAddress.mobile}
                                            onChangeText={handleChange('mobileNumber')}
                                            onBlur={handleBlur('mobileNumber')}
                                            name="mobileNumber"
                                            keyboardType="numeric"
                                            value={values.mobileNumber}
                                            touched={touched.mobileNumber}
                                            errors={errors.mobileNumber}
                                            onClick={() => setShow(true)}
                                            dialCode={values.countryCode}
                                            maxLength={values.mobileNumber == '+91' ? 10 : null}
                                        />
                                        <View style={styles.rowInputView}>
                                            <View style={[styles.inputView]}>
                                                <ComonBottomSheet
                                                    onClick={() => {
                                                        searchData('', 'country');
                                                        setSearchCtyOrCountry('');
                                                        refCountryRBSheet.current.open();

                                                    }}
                                                    name={Strings.MyProfile.country}
                                                    value={values.countrySelect ? values.countrySelect : 'Select country'}
                                                    errors={errors.countrySelect}
                                                    touched={touched.countrySelect}
                                                />
                                            </View>
                                            <View style={[styles.inputView, {}]}>
                                                <ComonBottomSheet
                                                    onClick={() => {
                                                        searchData('', 'city');
                                                        setSearchCtyOrCountry('');
                                                        (!cityData?.length && !values.countrySelect) ? AlertError('Select country first') : (cityData?.length ? refDayRBSheet.current.open() : ToastError('country based city not available'))
                                                    }}
                                                    name={Strings.AddAddress.city}
                                                    value={values?.citySelect ? values?.citySelect : 'Select city'}
                                                    errors={errors.citySelect}
                                                    touched={touched.citySelect}
                                                />
                                            </View>
                                        </View>
                                        <NewInputText
                                            inputName={Strings.AddAddress.zipCode}
                                            placeholder={Strings.AddAddress.zipCodePlaceHolder}
                                            onChangeText={handleChange('pinCode')}
                                            onBlur={handleBlur('pinCode')}
                                            name="pinCode"
                                            value={values.pinCode}
                                            touched={touched.pinCode}
                                            errors={errors.pinCode}
                                        />
                                    </View>
                                    <Button
                                        primaryButton
                                        disabled={isLoadMore ? true : false}
                                        title={isLoadMore ? <Loader /> : Strings.EditMyprofile.save}
                                        onPress={() => [handleSubmit(), Keyboard.dismiss()]}
                                        style={{ marginTop: Size.x64, marginBottom: Size.xl, marginHorizontal: 19, height: 53, }}
                                    />
                                    {/* { mobile CountryPicker} */}
                                    <CountryPicker
                                        show={show}
                                        onBackdropPress={() => setShow(false)}
                                        enableModalAvoiding={true}
                                        style={{
                                            modal: {
                                                height: 500,
                                            },
                                            dialCode: {
                                                color: "black"
                                            },
                                            countryName: {
                                                color: "black"
                                            }
                                        }}
                                        pickerButtonOnPress={(item) => {
                                            setMobileISOCode(item.code)
                                            setShow(false);
                                            handleChange('countryCode')(item.dial_code)
                                        }}
                                    />

                                    {/* { alt mobile no CountryPicker} */}
                                    <CountryPicker
                                        show={altShow}
                                        onBackdropPress={() => setAltShow(false)}
                                        style={{
                                            modal: {
                                                height: 500,
                                            },
                                            dialCode: {
                                                color: "black"
                                            },
                                            countryName: {
                                                color: "black"
                                            }
                                        }}
                                        pickerButtonOnPress={(item) => {
                                            setAltISOCode(item.code)
                                            setAltShow(false);
                                            handleChange('altCountryCode')(item.dial_code)
                                        }}
                                    />

                                    {/* { country bottomsheet} */}
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
                                                {showCountry?.map((data, index) =>
                                                    <TouchableOpacity key={data.id} style={[styles.cityContain, { borderBottomWidth: data.text !== 'Select Country' ? 1 : 0 }]}
                                                        onPress={() => {
                                                            refCountryRBSheet.current.close();
                                                            handleChange('countrySelect')(data?.text);
                                                            handleChange('citySelect')('');
                                                            getCity(data.id);
                                                            setTouched({ ...touched, countrySelect: false });
                                                        }}
                                                    >
                                                        <Label style={{ fontSize: 14, }} text={data.text} />
                                                        <Icon source={values.countrySelect == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </ScrollView>
                                    </RBSheet>

                                    {/* { city bottomsheet} */}
                                    <RBSheet
                                        ref={refDayRBSheet}
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
                                            <View style={{}}>
                                                {showCity?.map((data, index) =>
                                                    <TouchableOpacity key={data.id} style={[styles.cityContain, { borderBottomWidth: data.text !== 'Select City' ? 1 : 0 }]}
                                                        onPress={() => {
                                                            refDayRBSheet.current.close()
                                                            setCityId(data.id)
                                                            handleChange('citySelect')(data.text)
                                                        }}>
                                                        <Label style={{ fontSize: 14, }} text={data.text} />
                                                        <Icon source={values.citySelect == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </ScrollView>
                                    </RBSheet>
                                </View>
                            )}
                        </Formik>
                    </KeyboardAwareScrollView>
                </>}
        </SafeAreaView >
    )
}






















