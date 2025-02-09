import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import styles from '../ShoppingCart/styles'
import { Formik } from 'formik';
import * as yup from 'yup';
import { instance, Validation } from '../../../utils';
import { BoldLabel, Colors, ImagePath, MediumLabel, OpenSansBoldLabel, RegularLabel, RobotoBoldLabel, Strings, Typography } from '../../../constants';
import { AlertError, Button, Loader, NewHeader, NewInputText, ToastSuccess } from '../../../components';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function PersonalizedMessage({ navigation }) {

    const formikRef = useRef(null);
    const [isLoading, setLoading] = useState(false);
    const [currCartData, setCurrCartData] = useState([]);
    const [senderName, setSenderName] = useState('');
    const [message, setMessage] = useState('');
    const [showCart, setShowCart] = useState();
    const [cardMessageId, setCardMessageId] = useState('');
    const [selectFill, setSelectFill] = useState('');
    const [cartData, setCartData] = useState([]);
    const [deliveryData, setDeliveryData] = useState('');
    const [cartMessageError, setCartMessageError] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    let cartID;

    const cartValidationSchema = yup.object().shape({
        message: Validation.message,
        senderName: Validation.senderName,
    });

    const refarr = {
        "message": useRef(null),
        "senderName": useRef(null),
        "cartMessageError": useRef(null),
    };
    useFocusEffect(useCallback(() => {
        setCartMessageError('');
        shopingCart();
    }, []));

    const shopingCart = async (loading = true, cartItemId = '') => {

        setLoading(loading)

        instance.post('/get_cart_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData?.status === 'success') {
                setDeliveryData(userData);
                setSelectFill('');
                let preMesData = [];
                userData?.result?.map((data, index) => {
                    let itemCartMsg = {
                        "message": data?.cart_message,
                        "sender_name": data?.sender_name,
                        "cart_id": data?._id,
                        "card_category_name": data?.card_category_name,
                    }
                    preMesData = [...preMesData, itemCartMsg]

                    if (cartItemId == '' && index === 0) {
                        setCurrCartData(itemCartMsg);
                        setSenderName(itemCartMsg.sender_name)
                        setMessage(itemCartMsg.message)
                    } else if (showCart === data._id) {
                        setCurrCartData(itemCartMsg)
                        setSenderName(itemCartMsg.sender_name)
                        setMessage(itemCartMsg.message)
                    }
                });

                setCartData(preMesData);
                if (cartItemId == '' || cartID === 1) {
                    setShowCart(userData?.result[0]?._id);
                }
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        }).catch(error => {
            navigation.navigate('CatchError');
            AlertError(Strings.Other.catchError);
            console.log('shopingCart=======catch==', error);
        });
    };

    const saveCardMessage = async (cardUpdateData) => {
        instance.post('/save_card_message_to_cart', {
            req: {
                "data": { "card_data": cardUpdateData }
            },
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);

            if (userData?.status === 'success') {
                // console.log('save_card_message_to_cart===========', userData);
                shopingCart(false, showCart);
                ToastSuccess(userData?.message);
                setTimeout(() => {
                    setIsSubmit(false)
                }, 1500)
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('saveCardMessage=========catch===', error);
        });
    };

    const cart = (item) => {
        setIsSubmit(true)
        let filterCartData = cartData?.map((data) => {
            if (data?.cart_id == showCart) {
                return {
                    "message": item?.message,
                    "sender_name": item?.senderName,
                    "cart_id": showCart,
                }
            }
            return data;
        });
        setCartData(false, filterCartData);
        saveCardMessage(filterCartData);
        setCartMessageError('');
    };

    const displayCart = (id) => {
        // setIsExpand(false);
        let updatedData = cartData?.filter((data) => {
            if (data?.cart_id === id) {
                if ((data?.message == undefined && data?.sender_name == undefined) || (data?.message == "" && data?.sender_name == "")) {
                    setCartMessageError('Ensure all fields in the message card are completed.');
                    // setIsExpand(true);
                } else if (data?.message != undefined && data?.sender_name != undefined) {
                    setCartMessageError('');
                }
                return data
            }
        });
        setCurrCartData(updatedData[0] ? updatedData[0] : {});
        setSenderName(updatedData[0].sender_name)
        setMessage(updatedData[0]?.message)
        setShowCart(id);
        setSelectFill('');
        setCardMessageId('');
    }

    const personalizedMessage = () => {
        let personalizedMessArray = [];
        if (message == '' || senderName == '') {
            formikRef.current.submitForm()
            return;
        }
        else if (currCartData.message != message || currCartData.sender_name != senderName) {
            setCartMessageError("Please first save or submit the updated message.")
            // return;
        }
        else {
            let isBlankMsg = false
            cartData?.map((data, ind) => {
                if ((data?.message == "" || data?.message == undefined || data?.sender_name == undefined || data?.sender_name === "") && isBlankMsg == false) {
                    isBlankMsg = true;
                    personalizedMessArray?.push(data?.cart_id);
                    setMessage(data?.message || "")
                    setSenderName(data?.sender_name || "")
                    setCartMessageError('Ensure all fields in the message card are completed.');
                    setShowCart(personalizedMessArray[0]);
                    setCurrCartData({});
                    // setIsExpand(true);
                    return;
                }
            });
        }
        cartData?.map((data, ind) => {
            if (data?.message !== undefined && data?.sender_name !== undefined && cartMessageError === '' && personalizedMessArray?.length === 0) {
                navigation.navigate('SelectAddress', { "userCartData": deliveryData });
            }
        });
    };

    return (
        <SafeAreaView style={[styles.mainContainer,]}>
            <NewHeader
                exploreIcon={false}
            />

            {isLoading ? <Loader /> :
                <View>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <Formik
                            validationSchema={cartValidationSchema}
                            enableReinitialize
                            innerRef={formikRef}
                            initialValues={{
                                message: selectFill ? selectFill : currCartData?.message ? currCartData?.message : '',
                                senderName: currCartData?.sender_name ? currCartData?.sender_name : '',
                            }}
                            onSubmit={values => {
                                cart(values);
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, touched, values, errors, resetForm }) => (
                                <View style={styles.cartMainView} ref={refarr["cartMessageError"]}>
                                    <View style={[styles.deliveryDetailContain, { backgroundColor: Colors.WhiteLinen, marginTop: 0, paddingVertical: 8, paddingHorizontal: 15, borderTopLeftRadius: 10, borderBottomRightRadius: 10, }]}>
                                        <Icon style={{ width: 24, height: 24, tintColor: Colors.Black }} source={ImagePath.webIcons.message_card_icon} />
                                        <RobotoBoldLabel title={Strings.ShoppingCart.cartMessage} robotoBoldStyle={{ fontSize: 17, marginLeft: 10 }} />
                                    </View>

                                    <View style={{ marginHorizontal: 12 }}>
                                        <FlatList
                                            data={deliveryData?.result}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            ListFooterComponent={<Spacer style={{ marginTop: 0, marginRight: 16 }} />}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <View style={{ flexDirection: "row", }}>
                                                        <TouchableOpacity onPress={() => { displayCart(item?._id), Keyboard.dismiss() }}
                                                            style={[styles.cartIdContain,
                                                            {
                                                                marginTop: 12,
                                                                borderWidth: .5,
                                                                paddingVertical: 12,
                                                                backgroundColor: showCart === item?._id ? Colors.Seashell : Colors.White,
                                                                borderColor: showCart === item?._id ? Colors.Black : Colors.White,
                                                                paddingHorizontal: 12,
                                                                marginHorizontal: 14,
                                                                borderBottomWidth: 0,
                                                            }]}
                                                            activeOpacity={0.6} >
                                                            <OpenSansBoldLabel
                                                                title={`Message Cart#${index + 1}`}
                                                                openSansBoldStyle={{ color: Colors.Secondary.Black, fontSize: 13, }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }} />
                                        <View style={{ backgroundColor: Colors.Black, height: 1 }} />
                                    </View>

                                    <View style={{ marginHorizontal: 12, marginVertical: 20 }}>
                                        {cartMessageError &&
                                            <View style={{ backgroundColor: Colors.Azalea, padding: 10, borderRadius: 5 }}>
                                                <MediumLabel mediumStyle={styles.error} title={cartMessageError} />
                                            </View>
                                        }

                                        <NewInputText
                                            mainContainerStyle={{ marginHorizontal: 0, marginTop: cartMessageError ? 10 : 0 }}
                                            style={{ height: 100, fontFamily: Typography.LatoMedium, }}
                                            containerStyle={{ height: 100, borderRadius: 5, }}
                                            placeholder={Strings.ShoppingCart.enterMessage}
                                            placeholderTextColor={Colors.DoveGrayNew}
                                            onChangeText={(val) => {
                                                handleChange('message')(val);
                                                setMessage(val)
                                            }}
                                            textAlignVertical="top"
                                            onBlur={() => { handleBlur('message') }}
                                            name="message"
                                            multiline
                                            errors={errors.message}
                                            value={values.message}
                                            touched={touched.message}
                                        />
                                        <RegularLabel title={Strings.ShoppingCart.maxCharacters + values.message?.length + '/300'} regularStyle={styles.inputLength} />

                                        <NewInputText
                                            style={{ fontFamily: Typography.LatoMedium }}
                                            mainContainerStyle={{ marginHorizontal: 0, marginTop: 7 }}
                                            containerStyle={{ borderRadius: 5, }}
                                            placeholder={Strings.ShoppingCart.enterSenderName}
                                            placeholderTextColor={Colors.DoveGrayNew}
                                            onChangeText={(val) => {
                                                handleChange('senderName')(val);
                                                setSenderName(val)
                                            }}
                                            textAlignVertical="top"
                                            onBlur={() => { handleBlur('senderName') }}
                                            name="senderName"
                                            errors={errors.senderName}
                                            value={values.senderName}
                                            touched={touched.senderName}
                                        />
                                        <RegularLabel title={Strings.ShoppingCart.maxCharacters + values.senderName?.length + '/40'} regularStyle={styles.inputLength} />

                                        <TouchableOpacity activeOpacity={0.6} style={styles.messageSubmit} onPress={() => { handleSubmit(), Keyboard.dismiss() }} >
                                            <BoldLabel title={'Submit'} boldStyle={{ fontSize: 14, color: Colors.White }} />
                                        </TouchableOpacity>

                                        <Button
                                            title={Strings.ShoppingCart.coutinue}
                                            onPress={() => { personalizedMessage(); }}
                                            style={{ opacity: isSubmit ? 0.7 : Colors.Black }}
                                            labelStyle={{ fontSize: 18, }}
                                            disabled={isSubmit ? true : false}
                                        />
                                    </View>
                                </View>

                            )}
                        </Formik>
                    </KeyboardAwareScrollView>
                </View>}
        </SafeAreaView>
    )
}
export default PersonalizedMessage;