import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Image, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, Size, Strings, Icon, ImagePath, BoldLabel, HeaveyLabel, NunitoBoldLabel, RegularLabel } from "../../../constants";
import { InputText, Button } from "../../../components";
import { Formik } from "formik";
import * as yup from 'yup'
import { Validation } from "../../../utils";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default EditEmail = ({ navigation }) => {

    const ValidationSchema = yup.object().shape({
        email: Validation.email,
    })

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
                <View style={{ marginHorizontal: Size.l }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()} style={{ marginTop: Size.xl }}>
                        <Icon source={ImagePath.Auth.backArrow} style={styles.arrow} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Size.x96, }}>
                        <BoldLabel title={Strings.Other.editEmail} boldStyle={{ fontSize: Size.x5l, lineHeight: Size.x5l, }} />
                    </View>
                    <View style={{ marginTop: Size.xl, width: Size.xlp1, }}>
                        <RegularLabel title={Strings.ForgotPassword.LoremIpsum} regularStyle={{ fontSize: Size.m1, }} />
                    </View>
                </View>

                <Formik
                    validationSchema={ValidationSchema}
                    initialValues={{ email: '', }}
                    onSubmit={values => navigation.navigate('OTP', { email: values.email })}

                >
                    {({ handleChange, handleBlur, handleSubmit, touched, values, errors }) => (

                        <>
                            <InputText
                                mediumlabel
                                style={{ height: hp('7') }}
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
                            <Button labelStyle={{ paddingTop: Size.l }} title={Strings.Otp.continue} onPress={handleSubmit} style={{ marginTop: Size.x67, }} />
                        </>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}