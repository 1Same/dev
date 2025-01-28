import React, { useEffect, useState, useRef } from "react";
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
import { useSelector } from "react-redux";

export default ChangePassword = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false)

    const authData = useSelector((state) => state.auth);
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

    const getResendOtpForForgotPass = () => {

        const requestData = {
            "validate_string": authData.data.email,
            "page": "forgot_password",
        };

        instance.post('/customer_resend_otp', {
            req: { "data": requestData }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                ToastSuccess(userData?.message);
            }
            else {
                ToastError(userData?.message)
            }

        }).catch(error => {
            console.log('getResendOtpForForgotPass======catch===', error);
            AlertError(Strings.Other.catchError)
        });
    }

    const resendOTP = () => {
        getResendOtpForForgotPass()
        setMinutes(0);
        setSeconds(15);
    };

    const handleFormSubmit = async (values, { setFieldError }) => {
        const requestData = {
            "otp": values.otp,
            "password": values.newPassword,
            "confirm_password": values.reTypePassword,
            "validate_string": authData.data.email,
        };
        setIsLoading(true)
        instance.post('customer_reset_password', {
            req: { "data": requestData }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setIsLoading(false);
                ToastSuccess(userData?.message)
                navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')
            }
            else {
                setIsLoading(false);
                ToastError(userData?.message)
                setFieldError('otp', userData.message);
                //this.otpInput?.clear();
            }

        }).catch(error => {
            AlertError(Strings.Other.catchError)
            console.log('handleFormSubmit=======catch====', error);
            setIsLoading(false)
        });
    };

    const getForgotPaasword = () => {
        const requestData = {
            email: authData.data?.email
        };
        instance.post('/customer_forget_password', {
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
            AlertError(Strings.Other.catchError);
            console.log('getForgotPaasword======catch===', error);
        });
    }

    useEffect(() => {
        getForgotPaasword()
    }, [])


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

    const originalEmail = authData.data.email;
    const maskedEmail = hideEmail(originalEmail);

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

    const renderItem = ({ item }) => {
        return (
            <View style={styles.subContain}>
                <Icon source={ImagePath.Auth.rightMark} style={{ height: Size.xm1, width: Size.m011 }} />
                <RegularLabel title={item.name} regularStyle={styles.regularStyle} />
            </View>
        )
    }


    const changePassValidationSchema = yup.object().shape({
        newPassword: Validation.password,
        reTypePassword: Validation.reTypePassword,
        otp: Validation.otp,
    })

    const initialValues = { newPassword: '', reTypePassword: '', otp: '' }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} >
                <BackButtonHeader
                    containerStyle={{ marginHorizontal: Size.xm1 }}
                    title={Strings.ChangePassword.changePassword}
                />

                <Formik
                    validationSchema={changePassValidationSchema}
                    initialValues={initialValues}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, touched, values, errors, }) => (

                        <>
                            <View style={{ marginTop: Size.xl, flexDirection: "row", marginHorizontal: Size.l }}>
                                <BoldLabel title={`${Strings.Otp.otp}${"*"}`} boldStyle={{ fontSize: Size.m1 }} />
                            </View>
                            <View style={{ marginTop: Size.xl, flexDirection: "row", marginHorizontal: Size.l }}>
                                <RegularLabel title={`${Strings.Otp.codeSend}${maskedEmail}`} regularStyle={{ fontSize: Size.m1 }} />
                            </View>
                            <View style={{ marginHorizontal: '5%' }}>
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

                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    hitSlop={styles.hitSlop}
                                    disabled={(seconds == 0 && minutes == 0) ? false : true}
                                    onPress={() => resendOTP()} style={{ marginTop: Size.xs3, opacity: (seconds == 0 && minutes == 0) ? null : 0.5 }}>
                                    <RegularLabel title={Strings.Otp.reSend} regularStyle={{ fontSize: Size.m0, color: Colors.SunsetOrange }} />
                                </TouchableOpacity>

                            </View>
                            <InputText
                                mediumlabel
                                maxLength={15}
                                mediumStyle={{ marginHorizontal: Size.xl }}
                                mainContainerStyle={{ marginTop: Size.xl }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 6 }}
                                title={Strings.ChangePassword.newPassword}
                                placeholder={Strings.ChangePassword.newPaasPlaceHolder}
                                placeholderTextColor={Colors.Dawn}
                                style={{ height: hp('6'), padding: null, paddingHorizontal: Size.xm1 }}
                                keyboardType="visible-password"
                                onChangeText={handleChange('newPassword')}
                                onBlur={handleBlur('newPassword')}
                                name="newPassword"
                                errors={errors.newPassword}
                                value={values.newPassword}
                                touched={touched.newPassword}
                                secureIcon
                            />
                            <InputText
                                mediumlabel
                                mediumStyle={{ marginHorizontal: Size.xl }}
                                mainContainerStyle={{ marginTop: Size.m1 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 6 }}
                                title={Strings.ChangePassword.reTypePassword}
                                placeholder={Strings.ChangePassword.reTypePaasPlaceHolder}
                                placeholderTextColor={Colors.Dawn}
                                style={{ height: hp('6'), padding: null, paddingHorizontal: Size.xm1 }}
                                keyboardType="visible-password"
                                onChangeText={handleChange('reTypePassword')}
                                onBlur={handleBlur('reTypePassword')}
                                name="reTypePassword"
                                errors={errors.reTypePassword}
                                value={values.reTypePassword}
                                touched={touched.reTypePassword}
                                secureIcon
                            />
                            <Button
                                // labelStyle={{ paddingTop: isLoading ? 10 : Size.l }}
                                title={isLoading ? <Loader /> : Strings.AddNewReminder.submit}
                                onPress={() => [handleSubmit(), Keyboard.dismiss()]}
                                style={{ marginHorizontal: Size.l, marginTop: Size.x64, }}
                                labelStyle={{ fontSize: 16 }}
                                primaryButton
                            // style={{ marginTop: Size.x4l, marginHorizontal: Size.xl }} 
                            />
                        </>
                    )}
                </Formik>


                <View style={{ marginHorizontal: Size.xxxl, marginBottom: Size.l }}>
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
        </SafeAreaView >
    )
}
