import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Platform, Keyboard } from 'react-native';
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, Size, Strings, Icon, ImagePath, BoldLabel, RegularLabel } from "../../../constants";
import { InputText, Button, Loader, ToastSuccess, ToastError, AlertError } from "../../../components";
import { Formik } from "formik";
import * as yup from 'yup'
import { Validation } from "../../../utils";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { instance } from "../../../utils";

export default ForgotPassword = ({ navigation, route }) => {

    const forgotPaasValidationSchema = yup.object().shape({
        email: Validation.email,
    })

    const [isLoading, setIsLoading] = useState(false)

    const getForgotPaasword = (values) => {

        const requestData = {
            email: values.email
        };
        setIsLoading(true)
        instance.post('/customer_forget_password', {
            req: { "data": requestData }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);

            if (userData.status === 'success') {
                setIsLoading(false)
                ToastSuccess(userData?.message)
                navigation.navigate('NewPassword', { goto: 'Login', email: values.email })
            }
            else {
                setIsLoading(false)
                ToastError(userData?.message)
            }

        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('getForgotPaasword=======catch===', error);
            setIsLoading(false)
        });
    }

    const initialValues = { email: '', }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} >
                <View style={{ marginHorizontal: Size.l }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()} style={{ marginTop: Size.xl }}>
                        <Icon source={ImagePath.Auth.backArrow} style={styles.arrow} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Size.x96, }}>
                        <BoldLabel title={Strings.ForgotPassword.ForgotPassword} boldStyle={{ fontSize: Size.x5l, lineHeight: Size.x5l, }} />
                    </View>
                    <View style={{ marginTop: Size.xl, width: Size.xlp1, }}>
                        <RegularLabel title={`${'Enter Your Email to Forgot Password'}`} regularStyle={{ fontSize: Size.m1, }} />
                    </View>
                </View>

                <Formik
                    validationSchema={forgotPaasValidationSchema}
                    initialValues={initialValues}
                    onSubmit={(values) => { getForgotPaasword(values) }}

                >
                    {({ handleChange, handleBlur, handleSubmit, touched, values, errors }) => (

                        <>
                            <InputText
                                mediumlabel
                                style={{ height: hp('6.8'), padding: null, paddingHorizontal: Platform.OS == 'ios' ? 8 : 6 }}
                                mediumStyle={{ marginHorizontal: Size.xl }}
                                mainContainerStyle={{ marginTop: Size.x64 }}
                                containerStyle={{ marginTop: Size.xm1, borderRadius: 6 }}
                                title={Strings.ForgotPassword.email}
                                placeholderTextColor={Colors.Black}
                                keyboardType="email-address"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                name="email"
                                errors={errors.email}
                                value={values.email}
                                touched={touched.email}
                            />
                            <Button
                                disabled={isLoading ? true : false}
                                // labelStyle={{ paddingTop: isLoading ? 10 : Size.l }}
                                title={isLoading ? <Loader /> : Strings.ForgotPassword.resetPass}
                                onPress={() => [handleSubmit(), Keyboard.dismiss()]}
                                // style={{ marginTop: Size.x67, }}
                                style={{ marginHorizontal: Size.l, marginTop: Size.x64, }}
                                labelStyle={{ fontSize: 16 }}
                                primaryButton
                            />
                        </>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}