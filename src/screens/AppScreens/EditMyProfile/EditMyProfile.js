import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Loader, ToastSuccess, ToastError, AlertError, NewHeader, NewInputText, ComonBottomSheet } from "../../../components";
import { Size, Colors, Strings, Icon, ImagePath, BoldLabel, RegularLabel, Spacer, Label } from "../../../constants";
import { Formik, } from "formik";
import * as yup from 'yup';
import { Validation, instance, apiFormPost } from "../../../utils";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import RBSheet from "react-native-raw-bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ImagePicker from "react-native-image-crop-picker";
import { useIsFocused } from "@react-navigation/native";
import { dateFormat } from "../../../lib";
import { useSelector } from "react-redux";
import { CountryPicker } from "react-native-country-codes-picker";

export default EditMyprofile = ({ navigation }) => {

    const editProfileValidationSchema = yup.object().shape({
        firstName: Validation.firstName,
        lastName: Validation.lastName,
        mobileNumber: Validation.mobileNumber,
    });

    const isFocused = useIsFocused();
    const [cityData, setCityData] = useState([]);
    const [cityId, setCityId] = useState();
    const [stateData, setStateData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [searchShowCountry, setSearchShowCountry] = useState([]);
    const [searchShowCity, setSearchShowCity] = useState([]);
    const [searchShowState, setSearchShowState] = useState([]);
    const [countryId, setCountryId] = useState('');
    const [isLoding, setIsLoding] = useState(false);
    const [isDOBselect, setIsDOBSelect] = useState(false);
    const [isDOAselect, setIsDOASelect] = useState(false);
    const [profileData, setProfileData] = useState([]);
    const [searchCtyOrCountry, setSearchCtyOrCountry] = useState('');
    const authData = useSelector((state) => state.auth);

    const getProfileData = async (values) => {
        setIsLoding({ "main": true })
        instance.post('/customer_profile', {
            req: { "data": {} }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setProfileData(userData?.result)
                    getState(userData?.result.country_id)
                    setIsLoding({ "main": false })
                    setCountryId(userData?.result.country_id)
                    setCityId(userData?.result.city_id)
                    setProfileImage(authData?.data?.profile_image ? authData?.data?.profile_image : '')
                    let newDob = ''
                    let newDoa = ''
                    if (userData?.result?.date_of_birth && userData?.result?.date_of_birth != "Invalid Date") {
                        let formateDob = userData?.result?.date_of_birth?.replaceAll("/", "-")
                        newDob = new Date(formateDob)
                        setDatePic(newDob)
                    }
                    else {
                        setIsDOBSelect(false)
                        setDatePic('')
                    }
                    if (userData?.result?.date_of_anniversary && userData?.result?.date_of_anniversary != "Invalid Date") {
                        let formateAnniDate = userData?.result?.date_of_anniversary?.replaceAll("/", "-")
                        newDoa = new Date(formateAnniDate)
                        setAnniversaryDate(newDoa)
                    }
                    else {
                        setIsDOASelect(false)
                        setAnniversaryDate('');
                    }
                    const newData = {
                        firstName: userData?.result?.first_name,
                        lastName: userData?.result?.last_name,
                        emailAddress: userData?.result?.email,
                        mobileNumber: userData?.result?.mobile,
                        location: userData?.result?.address,
                        country: userData?.result?.country_name,
                        city: userData?.result?.city_name,
                        dob: newDob,
                        DateOfAnniversary: newDoa,
                        state: userData?.result?.state,
                        vatNumber: userData?.result?.vat_number,
                        countryCode: userData?.result?.mobile_code || "+91"
                    };
                    setMpInitialValues(newData);
                    setIsDOBSelect(true);
                    setIsDOASelect(true);
                }
                else {
                    setIsLoding({ "main": false })
                    ToastError(userData?.message)
                }
            }).catch(error => {
                console.log('getProfileData=====catch====', error);
                navigation.navigate('CatchError');
                setIsLoding({ "main": false })
                AlertError(Strings.Other.catchError);
            });
    };

    const getCountry = async (data) => {
        instance.post('/get_country', {
            req: { "data": {} }
        })
            .then(async (response) => {
                const userData = JSON.parse(response?.data);
                if (userData.status === 'success') {
                    setCountryData(userData?.result);
                    setSearchShowCountry(userData?.result)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCountry======catch===', error);
            });
    };

    useEffect(() => {
        if (isFocused == true) {
            getProfileData()
        }
    }, [isFocused]);

    useEffect(() => {
        getCountry()
    }, []);

    useEffect(() => {
        getCityInitial();
    }, [countryId])

    const getCityInitial = () => {
        instance.post('/get_city_base_on_country', {
            req: { "data": { country_id: countryId } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setCityData(userData?.result)
                setSearchShowCity(userData?.result)
            }
        }).catch(error => {
            console.log('getCityInitial========catch====', error);
            AlertError(Strings.Other.catchError);
        });
    };

    useEffect(() => {
        if (countryId) {
            getCity(countryId);
        }
    }, [countryId]);

    const getCity = async (country_id) => {
        setCountryId(country_id)
        instance.post('/get_city_base_on_country', {
            req: { "data": { "country_id": country_id } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setCityData(userData?.result)
            }
        }).catch(error => {
            console.log('getCity========catch====', error);
            AlertError(Strings.Other.catchError);
        });
    };

    const getState = (country_id) => {
        instance.post('/get-states', {
            req: { "data": { "country_id": country_id } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setStateData(userData?.result);
                setSearchShowState(userData?.result);
            }
        }).catch(error => {
            console.log('getState========catch====', error);
            AlertError(Strings.Other.catchError);
        });
    };

    const createThreeButtonAlert = () =>
        Alert.alert(
            "Profile image",
            "Choose photos",
            [
                {
                    text: "Camera", onPress: () => openCamera("Camera"),
                },
                {
                    text: "Gallery", onPress: () => openGallery("Gallery")
                },
                {
                    text: "Cancel", onPress: () => ("cancel")
                }
            ]
        );

    const [profileImage, setProfileImage] = useState('')
    const [newProfileImage, setNewProfileImage] = useState('')

    const openCamera = () => {
        ImagePicker.openCamera({
            width: 1024,
            height: 1024,
            compressImageMaxWidth: 1024,
            compressImageMaxHeight: 1024,
            cropping: true,
            cropperCircleOverlay: true,
            mediaType: "photo",
        }).then(image => {
            setProfileImage(image?.path)
            setNewProfileImage(image)
        }).catch(error => { });
    }

    const openGallery = () => {
        ImagePicker.openPicker({
            width: 1024,
            height: 1024,
            compressImageMaxWidth: 1024,
            compressImageMaxHeight: 1024,
            cropping: true,
            cropperCircleOverlay: true,
            mediaType: "photo",
        }).then(image => {
            setProfileImage(image.path)
            setNewProfileImage(image)
        }).catch(error => { });
    }

    const getUpdateProfileData = async (values) => {

        let requestData = {
            first_name: values.firstName,
            last_name: values.lastName,
            mobile: values.mobileNumber,
            address: values.location,
            city_id: cityId,
            city_name: values.city,
            country_id: countryId,
            country_name: values.country,
            date_of_anniversary: anniversaryDate && anniversaryDate != "Invalid Date" ? dateFormat(anniversaryDate, 'YYYY/MM/DD') : '',
            date_of_birth: datePic && datePic != "Invalid Date" ? dateFormat(datePic, 'YYYY/MM/DD') : '',
            vat_number: values.vatNumber,
            state: values.state,
            profile_pic: {},
            old_image: profileData.profile_image,
            email: values.emailAddress,
            email_alternate: "",
            alternate_mobile: "",
            gender: "",
            company_name: "",
            zip: ""
        };

        setIsLoding({ "updateData": true })
        apiFormPost("/customer_update", requestData, newProfileImage, 'profile_image').then(async (response) => {

            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                navigation.navigate('BlankScreen', { 'goto': 'MyProfile' })
                ToastSuccess("update detail successsfully")
                setIsLoding({ "updateData": false })
            }
            else {
                ToastError("update detail failed")
                setIsLoding({ "updateData": false })
            }
        }).catch(error => {
            setIsLoding({ "updateData": false })
            AlertError(Strings.Other.catchError);
            console.log('getUpdateProfileData======catch===', error);
        });
    };

    const refRBSheet = useRef();
    const refCityRBSheet = useRef();
    const refCountryRBSheet = useRef();
    const [datePic, setDatePic] = useState(new Date(Date.now()));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [anniversaryDate, setAnniversaryDate] = useState(new Date(Date.now()));
    const [showAnniDatePicker, setShowAnniDatePicker] = useState(false);
    const [showCountryCode, setShowCountryCode] = useState(false);
    let initialValues;

    initialValues = {
        firstName: '',
        lastName: '',
        location: '',
        mobileNumber: '',
        country: '',
        city: '',
        state: '',
        vatNumber: "",
        DateOfAnniversary: '',
        dob: '',
        countryCode: ''
    };

    const [mpInitialValues, setMpInitialValues] = useState(initialValues)
    const formikRef = useRef(null);

    const searchData = (searchVal = '', searchType = '') => {
        const dataToFilter = searchType === 'country' ? countryData || [] : searchType === 'city' ? cityData || [] : stateData || [];
        const result = dataToFilter.filter((item) => item.text?.toLowerCase().includes(searchVal.toLowerCase()));
        searchType === 'country' ? setSearchShowCountry(result) : searchType === 'city' ? setSearchShowCity(result) : setSearchShowState(result);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>

            <NewHeader
                optionTag
                containerStyle={styles.headerContainer}
                optionContainer={styles.editContainer}
                optionOnPress={() => formikRef.current && formikRef.current.submitForm()}
                source={ImagePath.Other.saveIcon}
                iconStyle={styles.edit}
                label={Strings.EditMyprofile.save}
                labelStyle={{ fontSize: 15, marginLeft: Size.xxs, color: Colors.Secondary.Black }}
            />

            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Formik
                    innerRef={formikRef}
                    validationSchema={editProfileValidationSchema}
                    initialValues={mpInitialValues}
                    enableReinitialize={true}
                    onSubmit={values => getUpdateProfileData(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, touched, values, errors, resetForm, }) => (

                        <>
                            {isLoding.main == true ?
                                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                    <Loader mainContainer={{ marginVertical: '4%' }} />
                                </View>
                                :
                                <>
                                    <View style={styles.profileContainer} >
                                        <Icon source={profileImage ?
                                            { uri: profileImage } : ImagePath.Other.emptyUser}
                                            style={[styles.decentProfile, { opacity: isLoding?.updateData == true ? 0.4 : 1 }]}
                                            resizeMode='cover'
                                        />
                                        {isLoding?.updateData == true &&
                                            <View style={{ position: 'absolute', }}>
                                                <Loader loadStyle={styles.wishlistLoader} />
                                            </View>}
                                    </View>

                                    <TouchableOpacity activeOpacity={0.9} onPress={() => createThreeButtonAlert()}
                                        style={[styles.editInput, { opacity: isLoding?.updateData == true ? 0.4 : 1 }]}
                                    >
                                        <Icon source={ImagePath.Other.cameraCamal} style={styles.edit} />
                                        <View style={{ marginLeft: Size.xs3 }}>
                                            <BoldLabel title={Strings.EditMyprofile.changePicture} boldStyle={{ fontSize: Size.m1, color: Colors.Secondary.Black }} />
                                        </View>
                                    </TouchableOpacity>

                                    <NewInputText
                                        inputName={Strings.AddAddress.firstName}
                                        placeholder={Strings.PlaceHolder.firstName}
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')}
                                        name="firstName"
                                        value={values.firstName}
                                        touched={touched.firstName}
                                        errors={errors.firstName}
                                    />
                                    <NewInputText
                                        inputName={Strings.AddAddress.lastName}
                                        placeholder={Strings.PlaceHolder.lastName}
                                        onChangeText={handleChange('lastName')}
                                        onBlur={handleBlur('lastName')}
                                        name="lastName"
                                        value={values.lastName}
                                        touched={touched.lastName}
                                        errors={errors.lastName}
                                    />
                                    <NewInputText
                                        inputName={Strings.EditMyprofile.address}
                                        placeholder={Strings.PlaceHolder.address}
                                        onChangeText={handleChange('location')}
                                        name="location"
                                        value={values.location}
                                        requiredFeld={false}
                                    />
                                    <NewInputText
                                        inputName={Strings.MyProfile.mobileNumber}
                                        placeholder={Strings.PlaceHolder.mobileNumber}
                                        onChangeText={handleChange('mobileNumber')}
                                        onBlur={handleBlur('mobileNumber')}
                                        name="mobileNumber"
                                        value={values.mobileNumber}
                                        touched={touched.mobileNumber}
                                        errors={errors.mobileNumber}
                                        dialCode={values?.countryCode}
                                        onClick={() => setShowCountryCode(true)}
                                    />

                                    <View style={[styles.rowInputView, { justifyContent: 'space-between' }]}>
                                        <View style={[styles.inputView]}>
                                            <ComonBottomSheet
                                                onClick={() => {
                                                    refCountryRBSheet.current.open();
                                                    Keyboard.dismiss();
                                                    setSearchCtyOrCountry('');
                                                    searchData('', 'country');
                                                }}
                                                name={Strings.MyProfile.country}
                                                value={values.country ? values.country : Strings.PlaceHolder.selectCountry}
                                                requiredFeld={false}
                                            />
                                        </View>
                                        <View style={[styles.inputView]}>
                                            <ComonBottomSheet
                                                onClick={() => {
                                                    cityData?.length && !values.country ? AlertError('Select country first') : (cityData?.length ? refCityRBSheet.current.open() : ToastError('country based city not available'));
                                                    Keyboard.dismiss();
                                                    setSearchCtyOrCountry('');
                                                    searchData('', 'city');
                                                }}
                                                name={Strings.MyProfile.city}
                                                value={values.city ? values.city : Strings.PlaceHolder.selectCity}
                                                requiredFeld={false}
                                            />
                                        </View>
                                    </View>

                                    <View style={[styles.rowInputView, { justifyContent: 'space-between' }]}>
                                        <View style={[styles.inputView]}>
                                            {stateData?.length === 0 ?
                                                <NewInputText
                                                    mainContainerStyle={{ marginHorizontal: 0, width: wp('42.5%') }}
                                                    inputName={Strings.EditMyprofile.state}
                                                    placeholder={Strings.PlaceHolder.selectState}
                                                    onChangeText={handleChange('state')}
                                                    name="state"
                                                    requiredFeld={false}
                                                    value={values.state}
                                                    errors={errors.state}
                                                />
                                                :
                                                <ComonBottomSheet
                                                    onClick={() => {
                                                        refRBSheet.current.open();
                                                        Keyboard.dismiss();
                                                        setSearchCtyOrCountry('');
                                                        searchData('', 'state');
                                                    }}
                                                    name={Strings.EditMyprofile.state}
                                                    value={values.state ? values.state : Strings.PlaceHolder.selectState}
                                                    requiredFeld={false}
                                                    errors={errors.state}
                                                    touched={touched.error}
                                                />}
                                        </View>
                                        <NewInputText
                                            mainContainerStyle={{ marginHorizontal: 0, width: wp('42.5%') }}
                                            inputContainer={styles.inputView}
                                            inputName={Strings.EditMyprofile.vatNumber}
                                            placeholder={Strings.EditMyprofile.vatNumber}
                                            onChangeText={handleChange('vatNumber')}
                                            name="vatNumber"
                                            value={values.vatNumber}
                                            requiredFeld={false}
                                        />
                                    </View>

                                    <View style={[styles.rowInputView, { justifyContent: 'space-between', flex: 1 }]}>
                                        <View style={[styles.inputView]}>
                                            <ComonBottomSheet
                                                onClick={() => { setShowAnniDatePicker(true) }}
                                                name={Strings.EditMyprofile.dateAnniversary}
                                                value={anniversaryDate && isDOAselect ? dateFormat(anniversaryDate, 'YYYY/MM/DD') : Strings.detail.selectDate}
                                                requiredFeld={false}
                                                otherDownArrow={ImagePath.Other.calendar}
                                                tintColor={Colors.Black}
                                            />
                                        </View>
                                        <View style={[styles.inputView]}>
                                            <ComonBottomSheet
                                                onClick={() => { setShowDatePicker(true) }}
                                                name={Strings.EditMyprofile.dob}
                                                value={datePic && isDOBselect ? dateFormat(datePic, 'YYYY/MM/DD') : Strings.detail.selectDate}
                                                requiredFeld={false}
                                                otherDownArrow={ImagePath.Other.calendar}
                                                tintColor={Colors.Black}
                                            />
                                        </View>
                                    </View>
                                    <Spacer />
                                </>
                            }
                            {/* {mobile country code} */}
                            <CountryPicker
                                show={showCountryCode}
                                onBackdropPress={() => setShowCountryCode(false)}
                                style={{
                                    modal: { height: 500, },
                                    dialCode: { color: "black" },
                                    countryName: { color: "black" }
                                }}
                                pickerButtonOnPress={(item) => {
                                    setShowCountryCode(false);
                                    handleChange('countryCode')(item.dial_code)
                                }}
                            />
                            {/* {date of birth DateTimePickerModal} */}
                            {showDatePicker && (
                                <DateTimePickerModal
                                    isVisible={showDatePicker}
                                    mode="date"
                                    minimumDate={new Date(1950, 0, 1)}
                                    maximumDate={new Date()}
                                    onConfirm={(date) => {
                                        const currentDate = date || datePic;
                                        setShowDatePicker(false);
                                        setDatePic(currentDate);
                                        setIsDOBSelect(true)
                                    }}

                                    date={datePic == '' ? new Date() : datePic}
                                    onCancel={() => setShowDatePicker(false)}
                                />
                            )}

                            {/* {date of anniversary DateTimePickerModal} */}
                            {showAnniDatePicker && (
                                <DateTimePickerModal
                                    isVisible={showAnniDatePicker}
                                    mode="date"
                                    minimumDate={new Date(1950, 0, 1)}
                                    maximumDate={new Date()}
                                    onConfirm={(date) => {
                                        const currentDate = date || anniversaryDate;
                                        setShowAnniDatePicker(false);
                                        setAnniversaryDate(currentDate);
                                        setIsDOASelect(true);
                                    }}
                                    onCancel={() => setShowAnniDatePicker(false)}
                                    date={anniversaryDate == '' ? new Date() : anniversaryDate}
                                />
                            )}

                            {/* {country sheet} */}
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
                                        {searchShowCountry?.map((data, index) =>
                                            <TouchableOpacity key={data.id} style={[styles.cityContain, { borderBottomWidth: data.text !== 'Select Country' ? 1 : 0 }]}
                                                onPress={(item) => [
                                                    refCountryRBSheet.current.close(),
                                                    getCity(data?.id),
                                                    getState(data?.id),
                                                    handleChange('country')(data.text),
                                                    handleChange('city')(''),
                                                    handleChange('state')(''),
                                                ]}
                                            >
                                                <Label style={{ fontSize: 14, }} text={data.text} />
                                                <Icon source={values.country == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </ScrollView>
                            </RBSheet>

                            {/* {city sheet} */}
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
                                        {searchShowCity?.map((data, index) =>

                                            <TouchableOpacity key={data.id} style={[styles.cityContain,]}
                                                onPress={() => {
                                                    refCityRBSheet.current.close();
                                                    setCityId(data?.id);
                                                    handleChange('city')(data?.text);
                                                }}>
                                                <Label style={{ fontSize: 14, }} text={data.text} />
                                                <Icon source={values.city == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </ScrollView>
                            </RBSheet>

                            {/* {sate sheet} */}
                            <RBSheet
                                ref={refRBSheet}
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

                                <ScrollView style={{ marginHorizontal: 17, height: '42%', }} showsVerticalScrollIndicator={false}>
                                    <View style={{}}>
                                        {searchShowState?.map((data, index) => {
                                            return (
                                                <TouchableOpacity key={data.id} style={styles.cityContain}
                                                    onPress={() => {
                                                        refRBSheet.current.close();
                                                        handleChange('state')(data.text);
                                                        handleChange('city')('');
                                                    }}>
                                                    <Label style={{ fontSize: 14, }} text={data.text} />
                                                    <Icon source={values.state == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </ScrollView>
                            </RBSheet>
                        </>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}