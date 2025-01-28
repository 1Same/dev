import React, { useEffect, useRef, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Text, Keyboard } from 'react-native';
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Size, Colors, Icon, Strings, ImagePath, BoldLabel, RegularLabel } from "../../../constants";
import { Button, Loader, ToastSuccess, ToastError, AlertError } from "../../../components";
import OTPTextInput from 'react-native-otp-textinput';
import { Formik } from 'formik';
import { instance } from "../../../utils";
import { useDispatch, } from "react-redux";
import { LoginSuccess } from "../../../features"
import AsyncStorage from "@react-native-async-storage/async-storage";

const Otp = ({ route, navigation }) => {

    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();
    const otpInput = useRef();

    const handleFormSubmit = async (values, { setFieldError }) => {
        const { otp } = values;
        if (!otp) {
            setFieldError('otp', Strings.Otp.emptyOtp);
        } else if (otp.length !== 6) {
            setFieldError('otp', Strings.Otp.lenghtOtp);
        }
        else {
            const requestData = {
                "validate_string": route.params?.email,
                "otp": otp,
                "page": "verify_account",
            };
            setIsLoading(true)
            instance.post('/customer_verify_otp', {
                req: { "data": requestData }
            }).then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    userData.result.profile_image = userData.result.profile_image ? userData.image_path + userData.result.profile_image : '';
                    setIsLoading(false);
                    await AsyncStorage.setItem("userData", userData.token);
                    await AsyncStorage.setItem("logoutMessage", 'false')
                    // console.log("userData otp=-=-=-=-=",userData);
                    dispatch(LoginSuccess(userData));
                    navigation.navigate(route?.params?.routeName ? route?.params?.routeName : 'Home');
                    ToastSuccess(userData?.message)
                }
                else {
                    if (userData.message.otp && userData.message.otp.length > 0) {
                        setFieldError('otp', userData.message.otp[0]);
                        ToastError(userData.message.otp[0])
                    } else if (userData.message) {
                        setFieldError('otp', userData.message);
                        ToastError(userData.message)
                        this.otpInput?.clear();
                    } else {
                        setFieldError('otp', Strings.Other.catchError);
                        ToastError(Strings.Other.catchError)
                    }
                    setIsLoading(false);
                }

            }).catch(error => {
                console.log('handleFormSubmit======catch======', error);
                AlertError(Strings.Other.catchError);
                setIsLoading(false)
                throw error;
            });
        }
    };

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(15);

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
                } else {
                    setSeconds(15);
                    setMinutes(minutes - 1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [seconds]);

    const getResendOtp = () => {

        const requestData = {
            "validate_string": route.params?.email,
            "page": "verify_account",
        };
        instance.post('/customer_resend_otp', {
            req: { "data": requestData }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                ToastSuccess(userData?.message)
            }
            else {
                ToastError(userData?.message);
            }

        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('getResendOtp======catch======', error);
        });
    }

    const resendOTP = () => {
        getResendOtp()
        setMinutes(0);
        setSeconds(15);
    };


    const maskEmail = (email) => {
        const parts = email.split('@');

        const username = parts[0].replace(/\d/g, '');
        const maskedUsername = `${username.slice(0, username.length)}..`;
        const maskedDomain = '....';

        return `${maskedUsername}@${maskedDomain}`;
    };

    const email = route.params?.email;
    const maskedEmail = maskEmail(email);

    const initialValues = { otp: '' }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={{ marginHorizontal: Size.l }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()} style={{ marginTop: Size.xl }}>
                        <Icon source={ImagePath.Auth.backArrow} style={styles.arrow} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Size.x96 }}>
                        <BoldLabel title={Strings.Otp.getCode} boldStyle={{ fontSize: Size.x5l, lineHeight: Size.x5l, }} />
                    </View>
                    <View style={{ marginTop: Size.xl, flexDirection: "row", }}>
                        <RegularLabel title={`${Strings.Otp.codeSend}${maskedEmail}`} regularStyle={{ fontSize: Size.m1 }} />
                    </View>
                </View>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleFormSubmit}
                    validateOnChange={false}
                    validateOnBlur={false}
                >
                    {({ handleSubmit, setFieldValue, errors, touched, values }) => (
                        <>
                            <View style={{ marginHorizontal: '5%' }}>
                                <View style={{ marginTop: Size.x63 }}>
                                    <OTPTextInput
                                        ref={(e) => this.otpInput = e}
                                        autoFocus={true}
                                        style={styles.otpContainer}
                                        containerStyle={{}}
                                        textInputStyle={{ color: Colors.Black }}
                                        tintColor={Colors.FrenchGrey}
                                        inputCount={6}
                                        handleTextChange={(otp) => setFieldValue('otp', otp)}
                                    />
                                    {touched.otp && errors.otp && <View style={{ marginTop: Size.m, }}>
                                        <RegularLabel regularStyle={{ color: Colors.FerrariRed, fontSize: 13 }} title={errors.otp} />
                                    </View>}
                                </View>

                                <View style={{ marginTop: Size.xm1, flexDirection: "row", justifyContent: "space-between" }}>
                                    <RegularLabel title={Strings.Otp.notReceiveCode} regularStyle={{ fontSize: Size.m0, color: Colors.PickledBlue }} />
                                    <Text style={{ fontSize: Size.m0, color: Colors.PickledBlue }}> {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>
                                </View>

                                <TouchableOpacity disabled={(seconds == 0 && minutes == 0) ? false : true} hitSlop={styles.hitSlop}
                                    activeOpacity={0.6}
                                    onPress={() => resendOTP()}
                                    style={{ marginTop: Size.xs3, opacity: (seconds == 0 && minutes == 0) ? null : 0.5 }}>
                                    <RegularLabel title={Strings.Otp.reSend} regularStyle={{ fontSize: Size.m0, color: Colors.SunsetOrange }} />
                                </TouchableOpacity>

                            </View>

                            <Button
                                disabled={isLoading ? true : false}
                                // labelStyle={{ paddingTop: isLoading ? 10 : Size.l }}
                                title={isLoading ? <Loader /> : Strings.Otp.continue}
                                onPress={() => [handleSubmit(), Keyboard.dismiss()]}
                                // style={{ marginTop: Size.x64 }}
                                style={{ marginHorizontal: Size.l, marginTop: Size.x64, }}
                                labelStyle={{ fontSize: 16 }}
                                primaryButton
                            />
                        </>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};
export default Otp;