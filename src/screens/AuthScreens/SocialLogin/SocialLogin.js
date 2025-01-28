import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Keyboard } from 'react-native';
import { useFormik } from "formik";
import * as yup from 'yup'
import styles from "./styles";
import { Validation } from "../../../utils";
import { Size, Colors, Strings, Icon, ImagePath, HeaveyLabel, RegularLabel } from "../../../constants";
import { InputText, Button, Loader, ToastSuccess, AlertError } from "../../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { instance } from "../../../utils"

export default SocialLogin = ({ navigation, route }) => {
    const loginValidationSchema = yup.object().shape({
        email: Validation.email,
        mobileNumber: Validation.mobileNumber
    })

    const [emailError, setEmailError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [mobileError, setMobileError] = useState('')

    const getUpdateSocialData = (values) => {
        const userProfiledata = {
            mobile_number: values?.mobileNumber,
            email: values?.email,
            slug: route.params?.slug
        }
        // console.log("main enterrrrrrrr=-=-=-=-=");
        setIsLoading(true)
        instance.post('/customer_update_email_address', {
            req: { "data": userProfiledata }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                // console.log("userData social login before success=-=-=-=-=-=-", userData);
                if (userData.status === 'success') {
                    // console.log("enterrrrrrrr=-=-=-=-=");
                    // console.log("userData social login after success=-=-=-=-=-=-", userData);
                    navigation.navigate('OTP', { 'email': values?.email })
                    ToastSuccess(userData?.message)
                    setIsLoading(false)
                }
                else {
                    if (userData.errors) {
                        if (userData.errors.email) {
                            setEmailError(userData.errors.email);
                        } else {
                            setEmailError('');
                        }
                        if (userData.errors.mobile_number) {
                            setMobileError(userData.errors.mobile_number);
                        } else {
                            setMobileError('');
                        }
                    }
                    setIsLoading(false)
                }
    
            }).catch(error => {
                console.log("getUpdateSocialData=====catch=====", error);
                AlertError(error.toString());
                setIsLoading(false);
            });
    };

    const [isvalidationOnBlur, setIsvalidationOnBlur] = useState(false);
    
    const formik = useFormik({
        initialValues: { email: '', mobileNumber: '' },
        validationSchema: loginValidationSchema,
        validateOnChange: isvalidationOnBlur,
        validateOnBlur: isvalidationOnBlur,
        onSubmit: (values) => {
            getUpdateSocialData(values);
        },
    });

    useEffect(() => {
        if (formik.values.email) {
            const isValidEmail = loginValidationSchema.fields.email.isValidSync(formik.values.email);
            if (isValidEmail) {
                setEmailError('');
            }
        }
    }, [formik.values.email,]);

    useEffect(() => {
        if (formik.values.mobileNumber && !formik.errors.mobileNumber) {
            setMobileError('');
        }
    }, [formik.values.mobileNumber]);

    const onSubmitFun = (formik) => {
        setIsvalidationOnBlur(true)
        formik.handleSubmit()
    }


    return (
        <SafeAreaView style={styles.mainContainer}>
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
                    style={{ height: Size.x67 }}
                    containerStyle={styles.inputContainer}
                    placeholder={Strings.SignIn.mailPlaceHolder}
                    placeholderTextColor="#70707054"
                    keyboardType="email-address"
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    name="email"
                    errors={formik.errors.email}
                    value={formik.values.email}
                    touched={formik.touched.email}
                    errorContainStyle={{ marginHorizontal: Size.xxl }}
                />

                {formik.touched.email && emailError &&
                    <View style={{ marginHorizontal: Size.xxl }}>
                        <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 13 }]} title={emailError} />
                    </View>
                }
                <InputText
                    style={{ height: Size.x67 }}
                    containerStyle={styles.inputPassContainer}
                    placeholder={'Enter mobile number'}
                    placeholderTextColor="#70707054"
                    keyboardType="decimal-pad"
                    onChangeText={formik.handleChange('mobileNumber')}
                    onBlur={formik.handleBlur('mobileNumber')}
                    name="mobileNumber"
                    errors={formik.errors.mobileNumber}
                    value={formik.values.mobileNumber}
                    touched={formik.touched.mobileNumber}
                    errorContainStyle={{ marginHorizontal: Size.xxl }}
                />
                {formik.touched.mobileNumber && mobileError &&
                    <View style={{ marginHorizontal: Size.xxl }}>
                        <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 13 }]} title={mobileError} />
                    </View>
                }
                <Button
                    disabled={isLoading ? true : false}
                    title={isLoading ? <Loader /> : Strings.SignUp.SIGNUP}
                    onPress={() => [onSubmitFun(formik), Keyboard.dismiss()]}
                    style={{  marginHorizontal: Size.l, marginTop: Size.x64, }}
                    labelStyle={{ fontSize: 16 }}
                    primaryButton
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}