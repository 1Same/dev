import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, Keyboard, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import styles from '../ShoppingCart/styles'
import { Formik } from 'formik';
import * as yup from 'yup';
import { instance, Validation } from '../../../utils';
import { BoldLabel, Colors, MediumLabel, OpenSansBoldLabel, RegularLabel, Strings } from '../../../constants';
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
                // console.log('shopingCart PersonalizedMessage=======', userData);

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

                setDeliveryData(userData);
                setSelectFill('');
                // setCardMessageId('');
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
        <SafeAreaView style={styles.mainContainer}>
            <NewHeader
                title={'Message Card'}
            />

            {isLoading ? <Loader /> :
                <View>
                    {deliveryData?.result?.length > 1 &&
                        <View style={{}}>
                            <FlatList
                                data={deliveryData?.result}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                ListFooterComponent={<Spacer style={{ marginTop: 0, marginRight: 16 }} />}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ marginLeft: index === 0 ? 16 : 7, flexDirection: "row", }}>
                                            <TouchableOpacity onPress={() => { displayCart(item?._id), Keyboard.dismiss() }}
                                                style={[styles.cartIdContain,
                                                {
                                                    backgroundColor: showCart === item?._id ? Colors.Primary.Camel : "#FCFCFC",
                                                    borderWidth: .5, borderColor: showCart === item?._id ? Colors.Primary.Camel : Colors.PaleSlate
                                                }]}
                                                activeOpacity={0.6} >
                                                <OpenSansBoldLabel
                                                    title={`Message Cart#${index + 1}`}
                                                    openSansBoldStyle={{ color: showCart === item?._id ? Colors.White : Colors.Secondary.Black, fontSize: 13, }} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }} />

                        </View>
                    }
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
                                <View style={{ marginTop: 5, }} ref={refarr["cartMessageError"]}>
                                    {cartMessageError &&
                                        <View style={{ backgroundColor: Colors.Azalea, padding: 10, borderRadius: 5, marginHorizontal: 16 }}>
                                            <MediumLabel mediumStyle={styles.error} title={cartMessageError} />
                                        </View>
                                    }

                                    <NewInputText
                                        style={{ height: 100 }}
                                        containerStyle={{ height: 100 }}
                                        inputName={Strings.ShoppingCart.message}
                                        placeholder={Strings.ShoppingCart.message}
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
                                        mainContainerStyle={{ marginTop: 0 }}
                                        inputName={Strings.ShoppingCart.senderName}
                                        placeholder={Strings.ShoppingCart.senderName}
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
                                        title={'Continue'}
                                        onPress={() => {
                                            personalizedMessage();
                                        }}
                                        style={{ opacity: isSubmit ? 0.7 : Colors.Black }}
                                        // labelStyle={{ marginLeft: Size.xm1, fontSize: 14.5, }}
                                        disabled={isSubmit ? true : false}
                                    />
                                </View>

                            )}
                        </Formik>
                    </KeyboardAwareScrollView>
                </View>}
        </SafeAreaView>
    )
}
export default PersonalizedMessage;