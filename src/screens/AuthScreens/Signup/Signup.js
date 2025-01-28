import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Text, Platform, Keyboard } from 'react-native';
import { Validation } from "../../../utils";
import { Formik } from "formik";
import * as yup from 'yup'
import styles from "./styles";
import { Size, Colors, Strings, Icon, ImagePath, BoldLabel, HeaveyLabel, NunitoBoldLabel, RegularLabel } from "../../../constants";
import { InputText, Button, SocialButton, Loader, ToastSuccess, ToastError, AlertError, NewInputText } from "../../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { instance } from "../../../utils";
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from "react-native-fbsdk-next";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch, } from "react-redux";
import { LoginRequest, LoginSuccess, LoginFail } from "../../../features"
import { CountryPicker } from "react-native-country-codes-picker";

export default SignUp = ({ navigation }) => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    const signUpValidationSchema = yup.object().shape({
        email: Validation.email,
        password: Validation.password,
        confirmPassword: Validation.confirmPassword,
        firstName: Validation.firstName,
        lastName: Validation.lastName,
        mobile: Validation.mobileNumber,
        countryCode: yup.string().required('Please select a country code.'),
    })

    const signUpInitialValues = {
        "firstName": "",
        "lastName": "",
        "email": "",
        "mobile": "",
        "password": "",
        "confirmPassword": "",
        "countryCode": "+91",
    }

    const handleFormSubmit = async (values, { setFieldError }) => {

        const requestData = {
            first_name: values.firstName,
            last_name: values.lastName,
            mobile: values.mobile,
            email: values.email,
            password: values.password,
            confirm_password: values.confirmPassword,
            mobile_code: values.countryCode,
        };
        setIsLoading(true);
        instance.post('/customer_registration', {
            req: { "data": requestData }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            // console.log("userData signUp=-=-=-=-=-=-=", userData);
            if (userData.status === 'success') {
                setIsLoading(false);
                ToastSuccess(userData?.message);
                navigation.navigate('OTP', { goto: "SignUp", email: values.email });
            }
            else {

                ["email", "mobile"].map((val) => {
                    if (userData.message[val])
                        setFieldError(val, userData.message[val][0]);
                })
                setIsLoading(false)
            }

        }).catch(error => {
            setIsLoading(false);
            console.log('handleFormSubmit=======catch===', error);
            AlertError(Strings.Other.catchError);
        });
    };

    const getSocialData = (userData) => {
        const userProfiledata = {
            email: userData.email ? userData.email : '',
            fb_social_id: userData.id,
            first_name: userData.name
        }
        dispatch(LoginRequest());
        setIsLoading(true)
        instance.post('/social-login', {
            req: { "data": userProfiledata }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);

                if (userData.status === 'success') {
                    if (userData.email_exists === 0) {
                        navigation.navigate("SocialLogin", { slug: userData.result?.slug });
                        setIsLoading(false)
                    } else {
                        userData.result.profile_image = userData.result.profile_image ? userData.image_url + userData.result.profile_image : '';
                        dispatch(LoginSuccess(userData));
                        ToastSuccess(userData?.message)
                        navigation.navigate('MyDrawerNav');
                        await AsyncStorage.setItem("logoutMessage", 'false')
                        setIsLoading(false)
                    }
                }
                else {
                    ToastError(userData?.message);
                    setIsLoading(false)
                }

            }).catch(error => {
                dispatch(LoginFail());
                setIsLoading(false)
                AlertError(error.toString());
                console.log('getSocialData======catch===', error);
            });
    };

    const fbLogin = async () => {
        try {
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])

            if (result.isCancelled) {
                AlertError('Facebook Login: Cancelled by user');
            } else if (result.error) {
                ToastError(result.error.toString());
            } else {
                const data = await AccessToken.getCurrentAccessToken();

                if (data) {
                    const infoRequest = new GraphRequest(
                        '/me',
                        {
                            parameters: {
                                fields: {
                                    string: 'email,name,first_name,middle_name,last_name'
                                },
                                access_token: {
                                    string: data.accessToken.toString()
                                }
                            }
                        },
                        (error, result) => {
                            if (error) {
                                ToastError(error.toString());
                            } else {
                                getSocialData(result)
                            }
                        },
                    );

                    new GraphRequestManager().addRequest(infoRequest).start();
                }
            }
        } catch (error) {
            AlertError(error.toString());
        }
    };

    useEffect(() => {
        Platform.OS === 'android' ? GoogleSignin.configure() : GoogleSignin.configure({
            webClientId: '537894033049-pkg4u70pk33l8bemggi2uk3rocblp3f3.apps.googleusercontent.com'
            // webClientId: '537894033049-k2fcua7qm8440b4c6ead12tphneqh3i6.apps.googleusercontent.com'
        });
    }, []);

    const googleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
                await GoogleSignin.revokeAccess();
            }
            const userInfo = await GoogleSignin.signIn();
            getSocialData(userInfo?.user);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                AlertError(error.toString());

            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                ToastError(error.toString());

            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                ToastError(error.toString());

            } else {
                // some other error happened
                ToastError(error.toString());
            }
        }
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Icon source={ImagePath.Intro.splashLogoUpdated} style={styles.logo} />
                </View>
                <View style={styles.textContainer}>
                    <HeaveyLabel title={Strings.SignUp.signup} heaveyStyle={styles.heaveyLabel} />
                </View>
                <View style={styles.loginText}>
                    <RegularLabel title={Strings.SignUp.signupToGetStart} regularStyle={styles.regularLabel} />
                </View>
                <Formik
                    initialValues={signUpInitialValues}
                    validationSchema={signUpValidationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({
                        handleChange, handleBlur, handleSubmit, touched, values, errors
                    }) => (
                        <>
                            {/* {errors.serverside && <View><Text>errors : {errors.serverside}</Text></View>} */}
                            <NewInputText
                                mainContainerStyle={{ marginTop: 15 }}
                                inputName={Strings.MyProfile.emailAddress}
                                placeholder={Strings.MyProfile.emailAddress}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                name="email"
                                errors={errors.email}
                                value={values.email}
                                touched={touched.email}
                            />
                            <NewInputText
                                inputName={Strings.SignUp.password}
                                placeholder={Strings.SignUp.password}
                                keyboardType="visible-password"
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                name="password"
                                secureIcon
                                maxLength={15}
                                errors={errors.password}
                                value={values.password}
                                touched={touched.password}
                            />
                            <NewInputText
                                inputName={Strings.SignUp.confirmPassword}
                                placeholder={Strings.SignUp.confirmPassword}
                                keyboardType="visible-password"
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                name="confirmPassword"
                                secureIcon
                                errors={errors.confirmPassword}
                                value={values.confirmPassword}
                                touched={touched.confirmPassword}
                            />
                            <NewInputText
                                inputName={Strings.SignUp.firstName}
                                placeholder={Strings.SignUp.firstName}
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                                name="firstName"
                                errors={errors.firstName}
                                value={values.firstName}
                                touched={touched.firstName}
                            />
                            <NewInputText
                                inputName={Strings.SignUp.lastName}
                                placeholder={Strings.SignUp.lastName}
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                                name="lastName"
                                errors={errors.lastName}
                                value={values.lastName}
                                touched={touched.lastName}
                            />
                            <NewInputText
                                inputName={Strings.SignUp.mobileNumber}
                                placeholder={Strings.SignUp.mobileNumber}
                                onChangeText={handleChange('mobile')}
                                onBlur={handleBlur('mobile')}
                                name="mobile"
                                keyboardType="numeric"
                                value={values.mobile}
                                touched={touched.mobile}
                                errors={errors.mobile}
                                dialCode={values.countryCode}
                                onClick={() => setShow(true)}
                            />
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

                            <Button
                                disabled={isLoading ? true : false}
                                title={isLoading ? <Loader /> : Strings.SignUp.SIGNUP}
                                onPress={() => [handleSubmit(), Keyboard.dismiss()]}
                                style={{ marginHorizontal: Size.l, marginTop: Size.x64, }}
                                labelStyle={{ fontSize: 16 }}
                                primaryButton
                            />
                            <View style={styles.existCheckContainer}>
                                <BoldLabel title={Strings.SignUp.alreadyMember} boldStyle={{}} />
                                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Login')} style={{ marginLeft: Size.xxs }}>
                                    <BoldLabel title={Strings.SignUp.loginNow} boldStyle={{ color: Colors.Secondary.Black }} />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </Formik>
                <View style={styles.otherOptionContainer}>
                    <View style={[styles.emtyView,]} />
                    <View style={{ marginHorizontal: Size.xm }}>
                        <NunitoBoldLabel title={Strings.SignIn.or} />
                    </View>
                    <View style={[styles.emtyView,]} />
                </View>
                <SocialButton onPress={fbLogin} source={ImagePath.Auth.fbSign} title={Strings.SignIn.signUpWithFB} />
                <SocialButton onPress={googleLogin} source={ImagePath.Auth.googleSign} title={Strings.SignIn.signUpWithGoogle} style={styles.socialBtn} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
};

{/* <InputText
    style={{ height: hp('6'), padding: null, }}
    regularStyle={{ marginLeft: Size.xl, fontSize: Size.m1, }}
    mainContainerStyle={{ marginTop: Size.xxxl }}
    containerStyle={{ marginTop: Size.xm1, borderRadius: 4, }}
    title={Strings.SignUp.email}
    placeholderTextColor={Colors.PickledBlue}
    onChangeText={handleChange('email')}
    onBlur={handleBlur('email')}
    name="email"
    errors={errors.email}
    value={values.email}
    touched={touched.email}
    asteriskSignMedium
    asteriskStyle={{ marginLeft: 0, }}
/> */}

{/* <InputText
                                style={{ height: hp('6'), padding: null }}
                                maxLength={15}
                                regularStyle={{ marginLeft: Size.xl, fontSize: Size.m1 }}
                                mainContainerStyle={{ marginTop: Size.xm1 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 4, paddingHorizontal: 0 }}
                                title={Strings.SignUp.password}
                                placeholderTextColor={Colors.PickledBlue}
                                keyboardType="visible-password"
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                name="password"
                                errors={errors.password}
                                value={values.password}
                                touched={touched.password}
                                secureIcon
                                asteriskSignMedium
                            /> */}

{/* <InputText
                                style={{ height: hp('6'), padding: null }}
                                regularStyle={{ marginLeft: Size.xl, fontSize: Size.m1 }}
                                mainContainerStyle={{ marginTop: Size.xm1 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 4, paddingHorizontal: 0 }}
                                title={Strings.SignUp.confirmPassword}
                                placeholderTextColor={Colors.PickledBlue}
                                keyboardType="visible-password"
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                name="confirmPassword"
                                errors={errors.confirmPassword}
                                value={values.confirmPassword}
                                touched={touched.confirmPassword}
                                secureIcon
                                asteriskSignMedium
                            /> */}

{/* <InputText
                                style={{ height: hp('6'), padding: null }}
                                regularStyle={{ marginLeft: Size.xl, fontSize: Size.m1 }}
                                mainContainerStyle={{ marginTop: Size.xm1 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 4 }}
                                title={Strings.SignUp.mobileNumber}
                                placeholderTextColor={Colors.PickledBlue}
                                keyboardType="decimal-pad"
                                onChangeText={handleChange('mobile')}
                                onBlur={handleBlur('mobile')}
                                name="mobile"
                                errors={errors.mobile}
                                value={values.mobile}
                                touched={touched.mobile}
                                asteriskSignMedium
                            /> */}

{/* <InputText
                                style={{ height: hp('6'), padding: null }}
                                regularStyle={{ marginLeft: Size.xl, fontSize: Size.m1 }}
                                mainContainerStyle={{ marginTop: Size.xm1 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 4 }}
                                title={Strings.SignUp.firstName}
                                placeholderTextColor={Colors.PickledBlue}
                                keyboardType="twitter"
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                                name="firstName"
                                errors={errors.firstName}
                                value={values.firstName}
                                touched={touched.firstName}
                                asteriskSignMedium
                            /> */}

{/* <InputText
                                style={{ height: hp('6'), padding: null }}
                                regularStyle={{ marginLeft: Size.xl, fontSize: Size.m1 }}
                                mainContainerStyle={{ marginTop: Size.xm1 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 4 }}
                                title={Strings.SignUp.lastName}
                                placeholderTextColor={Colors.PickledBlue}
                                keyboardType="twitter"
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                                name="lastName"
                                errors={errors.lastName}
                                value={values.lastName}
                                touched={touched.lastName}
                                asteriskSignMedium
                            /> */}