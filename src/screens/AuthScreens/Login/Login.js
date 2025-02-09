import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, SafeAreaView, TouchableOpacity, Keyboard, Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFormik } from "formik";
import * as yup from 'yup';
import styles from "./styles";
import { Validation } from "../../../utils";
import { Size, Colors, Strings, Icon, ImagePath, HeaveyLabel, NunitoBoldLabel, RegularLabel } from "../../../constants";
import { InputText, SocialButton, Button, Loader, ToastSuccess, ToastError, AlertError, NewHeader } from "../../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { instance } from "../../../utils"
import { LoginRequest, LoginSuccess, LoginFail } from "../../../features"
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from "react-native-fbsdk-next";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useFocusEffect } from "@react-navigation/native";



export default Login = ({ navigation, route }) => {

    const dispatch = useDispatch();
    const loginValidationSchema = yup.object().shape({
        email: Validation.email,
        password: Validation.loginPassword
    })

    const [emailError, setEmailError] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    // const [loginMessage, setLoginMessage] = useState(false);

    const gotoLogin = (data) => {
        dispatch(LoginRequest());
        setIsLoading(true)
        instance.post('/customer_login', {
            req: { "data": data }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            // console.log("userdata login=-=-=-=-=-=-", userData);
            if (userData.status === 'success') {
                userData.result.profile_image = userData.result.profile_image ? userData.image_url + userData.result.profile_image : '';
                await AsyncStorage.setItem("userData", userData.token);
                await AsyncStorage.setItem("logoutMessage", 'false');
                dispatch(LoginSuccess(userData));
                navigation.navigate('MyDrawerNav')
                setIsLoading(false);
                ToastSuccess(userData.message)
            }
            else {
                setIsLoading(false);
                ToastError(userData.message);
            }

        }).catch(error => {
            dispatch(LoginFail());
            AlertError(Strings.Other.catchError);
            console.log('gotoLogin=======catch===', error);
            setIsLoading(false);
        });
    }

    const [isvalidationOnBlur, setIsvalidationOnBlur] = useState(true)

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: loginValidationSchema,
        validateOnChange: isvalidationOnBlur,
        validateOnBlur: isvalidationOnBlur,
        onSubmit: (values) => {
            gotoLogin(values);
        },
    });

    const [loginMethod, setLoginMethod] = useState(null);

    const handleLoginWithOTP = () => {
        setLoginMethod('OTP');
        const isValidEmail = loginValidationSchema.fields.email.isValidSync(formik.values.email);
        if (formik.values.email == '') {
            setEmailError('Email is required.');
        } else if (isValidEmail) {
            const requestData = {
                email: formik.values.email,
            };
            instance.post('/customer_OTP_login', {
                req: { "data": requestData }
            }).then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    ToastSuccess(userData.message)
                    navigation.navigate('OTP', { email: formik.values.email, goto: "Login", routeName: route.params?.screenName });
                }
                else {
                    ToastError(userData.message)
                }

            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('handleLoginWithOTP=======catch===', error);
            });
            setEmailError('');
        } else {
            setEmailError('Please enter a valid email.');
        }
    };

    const getloginMessage = async () => {
        // navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } })
        const val = await AsyncStorage.getItem("logoutMessage")
        if (route.params?.showmsg && (val == 'true' || val == null)) {
            ToastError("Please log in to access this screen");
        }
    }

    useFocusEffect(useCallback(() => {
        getloginMessage();
    }, [route.params?.showmsg]))

    useEffect(() => {
        if (formik.values.email) {
            const isValidEmail = loginValidationSchema.fields.email.isValidSync(formik.values.email);
            if (isValidEmail) {
                setEmailError('');
            }
        }
    }, [formik.values.email]);

    const onSubmitFun = (formik) => {
        setIsvalidationOnBlur(true);
        setLoginMethod('Login');
        formik.handleSubmit();
    }

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
                // console.log("userData social-login=-=-=-=-=-", userData);
                if (userData.status === 'success') {
                    if (userData.email_exists === 0) {
                        navigation.navigate("SocialLogin", { slug: userData.result?.slug })
                        setIsLoading(false)
                    } else {
                        userData.result.profile_image = userData.result.profile_image ? userData.image_url + userData.result.profile_image : '';
                        dispatch(LoginSuccess(userData));
                        navigation.navigate('MyDrawerNav')
                        await AsyncStorage.setItem("logoutMessage", 'false');
                        ToastSuccess(userData?.message)
                        setIsLoading(false)
                    }
                }
                else {
                    ToastError(userData?.message)
                }

            }).catch(error => {
                dispatch(LoginFail());
                AlertError(error.toString());
                setIsLoading(false)
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

    const googleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
                await GoogleSignin.revokeAccess();
            }
            const userInfo = await GoogleSignin.signIn();
            // console.log("userInfo google login=-=-=-=-=-", userInfo);
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

    useEffect(() => {
        Platform.OS === 'android' ? GoogleSignin.configure() : GoogleSignin.configure({
            webClientId: '537894033049-pkg4u70pk33l8bemggi2uk3rocblp3f3.apps.googleusercontent.com'
            // webClientId: '537894033049-k2fcua7qm8440b4c6ead12tphneqh3i6.apps.googleusercontent.com'
        });
    }, []);


    return (
        <SafeAreaView style={styles.mainContainer}>
            <TouchableOpacity style={{ marginLeft: 20, marginTop: 20 }} activeOpacity={0.7} onPress={() => navigation.goBack()}
                hitSlop={styles.hitSlop}>
                <Icon source={ImagePath.Auth.backArrow} style={[styles.iconStyle, { width: 24 }]} />
            </TouchableOpacity>

            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Icon source={ImagePath.Intro.splashLogoUpdated} style={styles.logo} />
                </View>
                <View style={styles.textContainer}>
                    <HeaveyLabel title={Strings.SignIn.welcome} heaveyStyle={styles.heaveyLabel} />
                </View>
                <View style={styles.loginText}>
                    <RegularLabel title={Strings.SignIn.loginToContinue} regularStyle={styles.regularLabel} />
                </View>

                <InputText
                    style={{ paddingVertical: 9, }}
                    containerStyle={styles.inputContainer}
                    placeholder={Strings.SignIn.mailPlaceHolder}
                    placeholderTextColor="#70707054"
                    keyboardType="email-address"
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    name="email"
                    errors={loginMethod === 'Login' && emailError == '' ? formik.errors.email : null}
                    value={formik.values.email}
                    touched={formik.touched.email}
                />
                {emailError &&
                    <View style={{ marginHorizontal: Size.l, paddingVertical: Size.xs1 }}>
                        <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 13 }]} title={emailError} />
                    </View>
                }
                {/* <InputText
                    style={{ height: Size.x67, }}
                    containerStyle={styles.inputPassContainer}
                    placeholder={Strings.SignIn.passPlaceHolder}
                    placeholderTextColor="#70707054"
                    keyboardType="visible-password"
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                    name="password"
                    errors={loginMethod === 'Login' ? formik.errors.password : null}
                    value={formik.values.password}
                    touched={formik.touched.password}
                    secureIcon
                /> */}

                {/* <View style={styles.optionContainer}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('ForgotPassword', { email: formik.values.email, })}>
                        <RegularLabel title={Strings.SignIn.forgotPass} regularStyle={styles.forgotLabel} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('SignUp')}>
                        <RegularLabel title={Strings.SignIn.createAccount} regularStyle={styles.forgotLabel} />
                    </TouchableOpacity>
                </View> */}

                {/* <Button
                    disabled={isLoading ? true : false}
                    title={isLoading ? <Loader /> : Strings.SignIn.login}
                    style={{ marginHorizontal: Size.l, marginTop: Size.x64, }}
                    labelStyle={{ fontSize: 16 }}
                    primaryButton
                    onPress={() => [onSubmitFun(formik), Keyboard.dismiss()]}
                /> */}
                <Button
                    title={Strings.SignIn.loginWithOtp}
                    labelStyle={styles.otpLabel}
                    style={styles.otpBtnContainer}
                    onPress={() => [handleLoginWithOTP(), Keyboard.dismiss()]}
                />
                {/* <View style={styles.otherOptionContainer}>
                    <View style={[styles.emtyView,]} />
                    <View style={{ marginHorizontal: Size.xm }}>
                        <NunitoBoldLabel title={Strings.SignIn.or} />
                    </View>
                    <View style={[styles.emtyView,]} />
                </View> */}
                {/* <SocialButton onPress={fbLogin} source={ImagePath.Auth.fbSign} title={Strings.SignIn.signInWithFB} /> */}
                {/* <SocialButton onPress={googleLogin} source={ImagePath.Auth.googleIcon} title={Strings.SignIn.signInWithGoogle} style={styles.socialBtn} /> */}
            </KeyboardAwareScrollView>
        </SafeAreaView >
    )
}