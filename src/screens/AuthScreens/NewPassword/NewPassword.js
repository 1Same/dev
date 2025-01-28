import React, { useEffect, useRef, useState } from "react";
import { View, SafeAreaView, FlatList, TouchableOpacity, Text, Keyboard } from 'react-native';
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { InputText, Button, BackButtonHeader, Loader, ToastSuccess, ToastError, AlertError } from "../../../components";
import { Size, Colors, Strings, Icon, BoldLabel, RegularLabel } from "../../../constants";
import { Formik } from "formik";
import * as yup from 'yup'
import { Validation, instance } from "../../../utils";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OTPTextInput from 'react-native-otp-textinput';

export default NewPassword = ({ navigation, route }) => {


    const [isLoading, setIsLoading] = useState(false);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(15);
    const otpInput = useRef();

    const data = [
        {
            id: "1",
            name: Strings.ChangePassword.atLeast8
        },
        {
            id: "2",
            name: Strings.ChangePassword.atLeast1Up
        },
        {
            id: "3",
            name: Strings.ChangePassword.atLeast1Lo
        },
        {
            id: "4",
            name: Strings.ChangePassword.atLeast1Nu
        },
        {
            id: "5",
            name: Strings.ChangePassword.speacialChar
        },
    ]

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

    const getResendOtpForForgotPass = () => {

        const requestData = {
            "validate_string": route.params?.email,
            "page": "forgot_password",
        };

        instance.post('/customer_resend_otp', {
            req: { "data": requestData }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                ToastSuccess(userData?.message)
            }
            else {
                ToastError(userData?.message)
            }

        }).catch(error => {
            AlertError(Strings.Other.catchError)
            console.log('getResendOtpForForgotPass======catch====', error);
        });
    }

    const resendOTP = () => {
        getResendOtpForForgotPass()
        setMinutes(0);
        setSeconds(15);
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.subContain}>
                <Icon source={ImagePath.Auth.rightMark} style={{ height: Size.xm1, width: Size.m011 }} />
                <RegularLabel title={item.name} regularStyle={styles.regularStyle} />
            </View>
        )
    }

    const changePassValidationSchema = yup?.object().shape({
        password: Validation.password,
        confirmPassword: Validation.confirmPassword,
        otp: Validation.otp,
    })

    const handleFormSubmit = async (values, { setFieldError }) => {
        const requestData = {
            "otp": values.otp,
            "password": values.password,
            "confirm_password": values.confirmPassword,
            "validate_string": route.params?.email,
        };
        setIsLoading(true)
        instance.post('customer_reset_password', {
            req: { "data": requestData }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setIsLoading(false)
                ToastSuccess(userData?.message);
                route.params?.goto == "Login" ? navigation.navigate('Login') : navigation.navigate('Home')
            }
            else {
                setIsLoading(false)
                ToastError(userData?.message);
                setFieldError('otp', userData.message);
                // this.otpInput?.clear();
            }

        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('handleFormSubmit=====catch===', error);
            setIsLoading(false);
        });
    };

    const hideEmail = (email) => {
        if (typeof email !== 'string' || email.trim() === '') {
            return email;
        }

        const atIndex = email.indexOf('@');

        if (atIndex > 0) {
            const username = email.substring(0, atIndex);
            const maskedUsername = `${username.substring(0, 3)}${'*'.repeat(Math.max(0, username.length - 3))}`;
            const domain = email.substring(atIndex);
            return `${maskedUsername}${domain}`;
        }

        return email;
    };

    const originalEmail = route.params?.email;
    const maskedEmail = hideEmail(originalEmail);
    const initialValues = { password: '', confirmPassword: '', otp: '' }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} >
                <BackButtonHeader
                    containerStyle={{ marginHorizontal: Size.xm1 }}
                    title={Strings.Other.newPassword}
                />

                <Formik
                    validationSchema={changePassValidationSchema}
                    initialValues={initialValues}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, touched, values, errors }) => (

                        <>
                            <View style={{ marginTop: Size.xl, flexDirection: "row", marginHorizontal: '7%' }}>
                                <BoldLabel title={`${Strings.Otp.otp}${"*"}`} boldStyle={{ fontSize: Size.m1 }} />
                            </View>
                            <View style={{ marginTop: Size.xl, flexDirection: "row", marginHorizontal: '7%' }}>
                                <RegularLabel title={`${Strings.Otp.codeSend}${maskedEmail}`} regularStyle={{ fontSize: Size.m1 }} />
                            </View>
                            <View style={{ marginHorizontal: '7%' }}>
                                <View style={{ marginTop: Size.x63 }}>
                                    <OTPTextInput
                                        // ref={(e) => this.otpInput = e}
                                        autoFocus={true}
                                        style={styles.otpContainer}
                                        containerStyle={{}}
                                        textInputStyle={{ color: Colors.Black }}
                                        tintColor={Colors.FrenchGrey}
                                        inputCount={6}
                                        handleTextChange={handleChange('otp')}
                                    />
                                    {touched.otp && errors.otp && <View style={{ marginTop: Size.m011, }}>
                                        <RegularLabel regularStyle={{ color: Colors.FerrariRed, fontSize: 13 }} title={errors.otp} />
                                    </View>}
                                </View>

                                <View style={{ marginTop: Size.xm1, flexDirection: "row", justifyContent: "space-between" }}>
                                    <RegularLabel title={Strings.Otp.notReceiveCode} regularStyle={{ fontSize: Size.m0, color: Colors.PickledBlue }} />
                                    <Text style={{ fontSize: Size.m0, color: Colors.PickledBlue }}> {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>
                                </View>

                                <TouchableOpacity hitSlop={styles.hitSlop} activeOpacity={0.6} disabled={(seconds == 0 && minutes == 0) ? false : true} onPress={() => resendOTP()} style={{ marginTop: Size.xs3, opacity: (seconds == 0 && minutes == 0) ? null : 0.5 }}>
                                    <RegularLabel title={Strings.Otp.reSend} regularStyle={{ fontSize: Size.m0, color: Colors.SunsetOrange }} />
                                </TouchableOpacity>
                            </View>

                            <InputText
                                mediumlabel
                                maxLength={15}
                                errorContainStyle={{ marginHorizontal: '7%' }}
                                mediumStyle={{ marginHorizontal: '7%' }}
                                mainContainerStyle={{ marginTop: Size.m1 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 6, marginHorizontal: '7%' }}
                                title={Strings.ChangePassword.newPassword}
                                placeholderTextColor={Colors.Black}
                                style={{ height: hp('7') }}
                                keyboardType="visible-password"
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                name="password"
                                errors={errors.password}
                                value={values.password}
                                touched={touched.password}
                                secureIcon
                            />
                            <InputText
                                errorContainStyle={{ marginHorizontal: '7%' }}
                                mediumlabel
                                mediumStyle={{ marginHorizontal: '7%', }}
                                mainContainerStyle={{ marginTop: Size.m1 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 6, marginHorizontal: '7%' }}
                                title={Strings.ChangePassword.confirmPassword}
                                placeholderTextColor={Colors.Black}
                                style={{ height: hp('7') }}
                                keyboardType="visible-password"
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                name="confirmPassword"
                                errors={errors.confirmPassword}
                                value={values.confirmPassword}
                                touched={touched.confirmPassword}
                                secureIcon
                            />
                            <Button
                                // labelStyle={{ paddingTop: Size.l, }}
                                title={isLoading ? <Loader /> : Strings.ForgotPassword.resetPass}
                                onPress={() => [handleSubmit(), Keyboard.dismiss()]}
                                // style={{ marginTop: Size.x4l, marginHorizontal: '7%' }}
                                disabled={isLoading ? true : false}
                                style={{  marginHorizontal: Size.l, marginTop: Size.x64, }}
                                labelStyle={{ fontSize: 16 }}
                                primaryButton
                            />
                        </>
                    )}
                </Formik>


                <View style={{ marginHorizontal: '7%', marginBottom: Size.l }}>
                    <View style={{ marginTop: Size.x65 }}>
                        <BoldLabel title={Strings.ChangePassword.passwordsContain} boldStyle={{ fontSize: Size.l }} />
                    </View>
                    <FlatList
                        data={data}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                    />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}