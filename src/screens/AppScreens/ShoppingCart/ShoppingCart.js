import React, { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Image, SafeAreaView, Platform, UIManager, TextInput, ScrollView, TouchableOpacity, FlatList, Keyboard, Modal, Dimensions } from 'react-native';
import styles from "./styles";
import { Button, Loader, AlertError, NewHeader, PopUp, ProgressiveImage, ToastError, BackButtonHeader } from "../../../components";
import { Size, Colors, Typography, Strings, Icon, ImagePath, RobotoRegularLabel, BoldLabel, RobotoMediumLabel, MediumLabel, RegularLabel, Label, RobotoBoldLabel, OpenSansBoldLabel, Spacer } from "../../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { instance } from "../../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ShoppingCart = ({ navigation }) => {

    const scrollViewRef = useRef(null);
    const [discountCode, setDiscountCode] = useState('');
    const [apply, setApply] = useState(false);
    const [couponStatus, setCouponStatus] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [deliveryData, setDeliveryData] = useState('');
    const [imageUrl, setImageUrl] = useState();
    const [useCartId, setUserCartId] = useState('');
    const [showCart, setShowCart] = useState();
    const [removeCart, setRemoveCart] = useState(false);
    const [removeCartData, setRemoveCartData] = useState();
    const [isTextInputFocused, setIsTextInputFocused] = useState(false);
    const [openCouponModal, setOpenCouponModal] = useState(false);
    const [couponError, setCouponError] = useState();
    const [couponCodeData, setCouponCodeData] = useState([]);
    const [emptyCart, setEmptyCart] = useState(false);
    let cartID;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsTextInputFocused(true);
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsTextInputFocused(false);
            },
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useFocusEffect(useCallback(() => {
        // if (deliveryData === '') {
        setEmptyCart(false)
        setLoading(true);
        shopingCart(true);
        getCouponCode();
        // }
    }, []));

    const shopingCart = async (val = true, cartItemId = '') => {

        (val == true) ? setLoading(true) : setLoading(false)

        instance.post('/get_cart_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData?.status === 'success') {

                let preMesData = [];
                userData?.result?.map((data, index) => {
                    let itemCartMsg = {
                        "message": data?.cart_message,
                        "sender_name": data?.sender_name,
                        "cart_id": data?._id,
                        "card_category_name": data?.card_category_name,
                    }
                    preMesData = [...preMesData, itemCartMsg]
                });

                if (cartItemId == '' || cartID === 1) {
                    setShowCart(userData?.result[0]?._id);
                }
                setImageUrl(userData?.image_url);
                setDeliveryData(userData);
                setCouponStatus(userData?.userCartData?.coupon_detail?.promo_code);
                setApply(userData?.userCartData?.coupon_detail?.promo_code ? true : false);
                setUserCartId(userData?.userCartData?._id);
                setLoading(false);
                setEmptyCart(true)
            }
            else {
                setLoading(false);
                setEmptyCart(false)
            }
        }).catch(error => {
            navigation.navigate('CatchError');
            AlertError(Strings.Other.catchError);
            console.log('shopingCart=======catch==', error);
        });
    };

    const handleRemoveDiscount = () => {
        setApply(false);
        setDiscountCode('')
        setCouponStatus('');
        removeCouponCode();
    };

    const handleApplyDiscount = async (val) => {

        const isCode = couponCodeData.some((item) => item.promo_code === discountCode);

        if (couponStatus === '' || couponStatus == undefined) {
            setOpenCouponModal(true)
            setApply(false);
            (val == 'coupon' && discountCode == '') ? setCouponError(Strings.Other.pleaseEnterCoupon) : (val == 'coupon' && discountCode.length > 0) && setCouponError(Strings.Other.invalidCoupon)
        }

        if (isCode == true) {
            setOpenCouponModal(false);
            setCouponError('');
            setCouponStatus(discountCode);
        }
    };

    const applyCouponCode = async () => {

        instance.post('/apply_coupon_code', {
            req: {
                "data": { coupon_code: couponStatus, user_cart_id: useCartId }
            }
        }).then(async (response) => {

            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                shopingCart();
                setLoading(false);
            }
            else {
                setLoading(false)
            }
        }).catch(error => {
            setLoading(false)
            AlertError(Strings.Other.catchError);
            console.log('applyCouponCode=======catch====', error);
        });
    };

    const RemoveFromCart = async (val) => {
        instance.post('/remove_from_cart', {
            req: { "data": { "cart_item_id": val?.cartItemId, "cart_id": val?.cartId } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);

            if (userData.status === 'success') {
                (cartID === 1) ? shopingCart(true, val?.cartItemId) : shopingCart(false, val?.cartItemId)
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('applyCouponCode=======catch====', error);
        });
    };

    const removeCouponCode = async () => {
        instance.post('/remove_coupon_code', {
            req: {
                "data": { user_cart_id: useCartId }
            }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);

            if (userData.status === 'success') {
                shopingCart();
                setLoading(false)
            }
            else {
                setLoading(false)
            }
        }).catch(error => {
            setLoading(false)
            AlertError(Strings.Other.catchError);
            console.log('removeCouponCode=========catch===', error);
        });
    };

    const increment = async (val) => {
        updateCartData({ actionType: 'add', productSlug: val?.product_detail.slug, cartItemId: val?._id });
    };

    const decrement = async (val) => {
        updateCartData({ actionType: 'remove', productSlug: val?.product_detail.slug, cartItemId: val?._id });
    };

    const updateCartData = async (val) => {

        instance.post('/update_cart_data', {
            req: {
                "data": { "product_slug": val?.productSlug, "action_type": val?.actionType, "cart_item_id": val?.cartItemId, }
            }
        }).then(async (response) => {

            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                shopingCart(false, val.cartItemId);
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('updateCartData=========catch===', error);
        });
    };

    const displayCart = (id) => {
        setShowCart(id);
    };

    const cartEmpty = () => {
        return (
            isLoading && emptyCart == false ?
                <Loader />
                :
                (
                    <View style={{ flex: 1 }}>
                        <View style={styles.mainEmptyCart}>
                            <Icon source={ImagePath.Other.cartIcon} style={styles.cartEmptyarrow} />
                            <View style={{ marginTop: Size.xxxl, }}>
                                <Label text={Strings.CartEmpty.nothingHere} style={{ letterSpacing: .3, fontSize: 17, fontFamily: Typography.poppinsBold, }} />
                            </View>
                            <View style={{ marginTop: 12, }}>
                                <RegularLabel title={Strings.CartEmpty.discoverMore} regularStyle={styles.emptyCartDetail} />
                            </View>
                            <View style={{ width: "75%" }}>
                                <RegularLabel title={Strings.CartEmpty.toYou} regularStyle={styles.emptyCartDetail} />
                            </View>

                            <Button
                                primaryButton
                                onPress={() => navigation.navigate('Home')}
                                style={styles.btnStyle}
                                title={Strings.CartEmpty.backToHome}
                            />
                        </View>
                    </View>
                )
        )
    };

    const getCouponCode = () => {
        setLoading(true)
        instance.post('/coupon_code_list', {
            req: {
                "data": {}
            }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setCouponCodeData(userData?.result)
                setLoading(false)

            } else {
                setLoading(false);
                ToastError(userData?.message);
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('getCouponCode========catch===', error);
        });
    };

    useEffect(() => {
        if (couponStatus) {
            setApply(true);
            applyCouponCode();
        }
    }, [couponStatus]);

    const handleDiscountCodeChange = (text) => {
        setCouponError('');
        setDiscountCode(text)
        if (text === '') {
            setCouponStatus('');
        }
    };

    const couponModal = () => {
        return (
            openCouponModal &&

            <Modal
                transparent={false}
                visible={openCouponModal}
                animationType="none"
                onRequestClose={() => {
                    setOpenCouponModal(false);
                }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.couponCodeContainer}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { setOpenCouponModal(false), setCouponError('') }} style={{}}>
                            <Icon source={ImagePath.Other.closeCircleBlack} style={{ height: hp('4%'), width: wp('8%'), }} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <BoldLabel title={Strings.CouponCode.apply} boldStyle={{ fontSize: 18, }} />
                        </View>
                        <View style={{ height: hp('4%'), width: wp('8%') }} />
                    </View>


                    <View style={{ marginHorizontal: Size.m011, marginTop: 70, flex: 1 }}>
                        {apply ?
                            <RegularLabel title={couponStatus} regularStyle={{ color: Colors.Dawn }} />
                            :
                            <View style={styles.inputCouponCodeContiner}>
                                <TextInput
                                    placeholderTextColor={Colors.DuneLight}
                                    keyboardType="twitter"
                                    style={styles.codeInput}
                                    value={discountCode}
                                    onChangeText={handleDiscountCodeChange}
                                    placeholder={Strings.ShoppingCart.enterCouponCode}
                                    editable={apply ? false : true}
                                />

                                <Button
                                    style={styles.applyContain}
                                    onPress={() => apply ? handleRemoveDiscount() : handleApplyDiscount('coupon')}
                                    title={apply ? Strings.ShoppingCart.remove : Strings.ShoppingCart.apply}
                                />
                            </View>}
                        {couponError && <Label text={couponError} style={{ color: Colors.Red, fontSize: 13 }} />}

                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            <View style={{ flex: 1, marginTop: 15 }}>
                                {couponCodeData?.length > 0 ?
                                    <FlatList
                                        data={couponCodeData}
                                        scrollEnabled={false}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => String(item._id)}
                                        renderItem={({ item }) => {

                                            return (
                                                <View style={styles.renderContainer}>
                                                    <View style={styles.couponContainer}>

                                                        <View style={styles.codeContainer}>
                                                            <RobotoBoldLabel title={item?.promo_code} robotoBoldStyle={{ letterSpacing: .1, fontSize: 14 }} />
                                                            <RegularLabel title={"Tap to Copy"} regularStyle={{ letterSpacing: .1, fontSize: 13, color: Colors.DuneLight, opacity: .5 }} />
                                                        </View>
                                                        <View style={styles.iconContainer}>
                                                            <Icon source={ImagePath.Other.cutIcon} style={{ height: hp('5%'), width: wp('8%'), }} />
                                                        </View>
                                                    </View>

                                                    <View style={{ marginLeft: 14, marginTop: Size.xm2, }}>
                                                        <RobotoBoldLabel title={'Get 60% off'} robotoBoldStyle={{ fontSize: 18 }} />
                                                    </View>

                                                    <Button
                                                        labelStyle={{}}
                                                        title={Strings.CouponCode.applyCoupon}
                                                        onPress={() => { setOpenCouponModal(false), setCouponStatus(item?.promo_code) }}
                                                        style={styles.buttonContainer}
                                                    />
                                                </View>

                                            )
                                        }}
                                    />
                                    : <Label text={Strings.Other.NoCouponAvailable} />}
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView >
            </Modal>
        )
    }

    const ItemsData = deliveryData?.flower_url_obj;

    useEffect(() => {
        const updateCartCount = async () => {
            if (deliveryData?.total_cart_product_count) {
                try {
                    await AsyncStorage.setItem(
                        "cartCount",
                        String(deliveryData?.total_cart_product_count)
                    );
                } catch (error) {
                    console.error("Error saving cart count to AsyncStorage:", error);
                }
            }
        };

        updateCartCount();
    }, [deliveryData?.total_cart_product_count]);

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <NewHeader
                exploreIcon={deliveryData?.result?.length == 0 ? false : true}
            />
            {(isLoading || deliveryData == '' || emptyCart == false) ?
                <Loader />
                :
                (deliveryData?.result?.length == 0 && emptyCart) ?
                    cartEmpty()
                    :
                    <>
                        <ScrollView style={{ flexGrow: 1, }} ref={scrollViewRef} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
                            <View style={styles.cartMainView}>
                                <View style={[styles.deliveryDetailContain, { backgroundColor: Colors.WhiteLinen, marginTop: 0, paddingVertical: 8, paddingHorizontal: 15, borderTopLeftRadius: 10, borderBottomRightRadius: 10, }]}>
                                    <Icon style={{ width: 24, height: 24 }} source={ImagePath.Other.shoppingCart} />
                                    <RobotoBoldLabel title={Strings.ShoppingCart.shoppingCart} robotoBoldStyle={{ fontSize: 17, marginLeft: 10 }} />
                                </View>

                                <Button
                                    onPress={() => { navigation.navigate('Listing', { "menu_url": ItemsData, }) }}
                                    style={{ backgroundColor: Colors.BlueRibbon, flexDirection: 'row', borderRadius: 100, height: 35, paddingHorizontal: 12, alignSelf: 'flex-end', marginHorizontal: 12, marginTop: 10 }}
                                    title={Strings.ShoppingCart.continueShopping}
                                    labelStyle={[styles.buttonName]}
                                    icon={ImagePath.Other.bagIcon}
                                    cartIconStyle={{ width: 17, height: 17, marginRight: 5, tintColor: Colors.White }}
                                />

                                <View style={{ flex: 1, marginTop: 7 }}>
                                    <FlatList
                                        data={deliveryData?.result}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View style={{ borderBottomWidth: 1, paddingHorizontal: 4, marginHorizontal: 10, flexDirection: "row", borderBottomColor: showCart === item?._id ? Colors.Red : Colors.Black }} key={item._id}>
                                                    <TouchableOpacity onPress={() => { displayCart(item?._id), Keyboard.dismiss() }}
                                                        style={styles.cartIdContain}
                                                        activeOpacity={0.6} >
                                                        <OpenSansBoldLabel
                                                            title={Strings.ShoppingCart.cartId}
                                                            openSansBoldStyle={{ color: showCart === item?._id ? Colors.Red : Colors.Secondary.Black, fontSize: 14, }} />
                                                        <MediumLabel
                                                            title={item?.delivery_date_label ? item?.delivery_date_label : item?.delivery_date}
                                                            mediumStyle={{ color: Colors.Secondary.Black, fontSize: 13, }} />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }} />
                                </View>

                                {deliveryData?.result?.map((data, index) => ((showCart === data?._id) &&
                                    <View key={data._id} >
                                        <View style={styles.cartItemContain}>
                                            <View style={{ flex: 1, }}>
                                                <FlatList
                                                    data={data?.items}
                                                    scrollEnabled={false}
                                                    renderItem={({ item }) => {
                                                        return (
                                                            <View style={{ flexDirection: "row", borderBottomWidth: 0.6, borderBottomColor: Colors.MountainMist, paddingVertical: 15, marginTop: 8 }}>
                                                                <View style={{ alignItems: 'center' }}>
                                                                    <TouchableOpacity onPress={() => { navigation.navigate("Detail", { "productSlug": item?.product_detail?.slug, "productId": item?.product_detail?._id }) }} activeOpacity={0.8}>
                                                                        <ProgressiveImage
                                                                            source={{ uri: imageUrl + item?.product_detail?.product_image }}
                                                                            style={{ height: 70, width: 70, borderTopLeftRadius: 8, borderBottomRightRadius: 8, }}
                                                                            resizeMode="contain"
                                                                        />
                                                                    </TouchableOpacity>
                                                                    <BoldLabel title={`#${item?.product_detail?.product_unique_id}`} boldStyle={{ fontSize: 13, marginTop: 5, color: Colors.DoveGray }} />
                                                                </View>

                                                                <View style={{ marginHorizontal: Size.xm2, flex: 1 }}>
                                                                    <BoldLabel
                                                                        title={item?.product_detail?.product_name}
                                                                        numberOfLines={1}
                                                                        boldStyle={{ fontSize: 14, fontFamily: Typography.RobotoMedium }}
                                                                    />

                                                                    <MediumLabel
                                                                        title={`${item?.upgrade_option} : ${deliveryData?.currency} ${item?.product_detail?.price}`}
                                                                        mediumStyle={{ fontSize: 13 }}
                                                                    />

                                                                    <View style={{ marginTop: 6 }}>
                                                                        {item?.alphabet_name !== "" && <Label style={{ fontSize: 14 }} text={`Alphabet Selected : ${item?.alphabet_name}`} />}
                                                                        {item?.add_vase === 1 && <Label style={{ lineHeight: 23, fontSize: 14 }} text={`Glass in Vase : ${deliveryData?.currency} ${item?.product_detail?.vase_price}`} />}
                                                                        {item?.add_eggless === 1 && <Label style={{ fontSize: 14 }} text={`Eggless : ${deliveryData?.currency} ${item?.product_detail?.eggless_price}`} />}

                                                                        {item?.personalised_image_name !== "" &&
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                                                                <View style={{}}>
                                                                                    <Label text={'Personalised '} />
                                                                                    <Label text={'Image : '} />
                                                                                </View>
                                                                                <Image style={{ height: 32, width: 42, marginLeft: 5 }} source={{ uri: deliveryData?.cart_image_url + item?.personalised_image_name }} resizeMode="cover" />
                                                                            </View>}
                                                                    </View>
                                                                </View>

                                                                <View style={{ alignItems: 'center' }}>
                                                                    <View style={styles.buttonContaine}>
                                                                        <TouchableOpacity onPress={() => {
                                                                            if (item?.quantity === 1) {
                                                                                setRemoveCartData({ "cartItemId": item?._id, "cartId": data._id, "cartlength": data?.items?.length });
                                                                                setRemoveCart(true);
                                                                            } else {
                                                                                decrement(item);
                                                                            }
                                                                        }}
                                                                            style={[styles.butonContainView, styles.decBorderRadius]}
                                                                            activeOpacity={0.6} hitSlop={styles.hitSlop}>
                                                                            <Label style={[styles.incrementButton, { bottom: 1 }]} text={'-'} />
                                                                        </TouchableOpacity>

                                                                        <View style={{ marginHorizontal: Size.xm2 }}>
                                                                            <Label style={[styles.incrementButton, { fontSize: 14 }]} text={item?.quantity} />
                                                                        </View>
                                                                        <TouchableOpacity style={[styles.butonContainView, styles.incBordeRradius]} onPress={() => increment(item)} activeOpacity={0.6}>
                                                                            <Label style={styles.incrementButton} text='+' />
                                                                        </TouchableOpacity>
                                                                    </View>

                                                                    <TouchableOpacity activeOpacity={0.6}
                                                                        onPress={() => {
                                                                            setRemoveCartData({ "cartItemId": item?._id, "cartId": data._id, "cartlength": data?.items?.length })
                                                                            setRemoveCart(true);
                                                                        }}
                                                                        style={{ marginTop: 4 }}>
                                                                        <BoldLabel boldStyle={{ color: Colors.DoveGray, fontSize: 14 }} title='Remove' />
                                                                    </TouchableOpacity>

                                                                    <PopUp
                                                                        visible={removeCart}
                                                                        onRequestClose={() => {
                                                                            setRemoveCart(false);
                                                                        }}
                                                                        title={Strings.Other.areyousureremoveitemcart}
                                                                        yesTitle={'Yes Delete it!'}
                                                                        cancelTitle={'Cancel'}
                                                                        cancelOnpress={() => {
                                                                            setRemoveCart(false);
                                                                            setRemoveCartData();
                                                                        }}
                                                                        yesOnpress={() => {
                                                                            RemoveFromCart({ "cartItemId": removeCartData?.cartItemId, "cartId": removeCartData?.cartId },
                                                                                cartID = removeCartData?.cartlength)
                                                                            setRemoveCart(false);
                                                                            setRemoveCartData();
                                                                        }}
                                                                    />
                                                                </View>
                                                            </View>
                                                        )
                                                    }}
                                                />
                                            </View>

                                            <View style={{ marginTop: 20 }}>
                                                <View style={styles.deliveryDetailContain}>
                                                    <BoldLabel title={Strings.ShoppingCart.deliveryCity} boldStyle={styles.deliveryDetailStyle} />
                                                    <RegularLabel title={deliveryData?.userCartData?.city_data?.city_name} regularStyle={styles.deliveryDetailStyle} />
                                                </View>
                                                <View style={styles.deliveryDetailContain}>
                                                    <BoldLabel title={Strings.ShoppingCart.deliveryDate} boldStyle={styles.deliveryDetailStyle} />
                                                    <RegularLabel title={data?.delivery_date_label ? data?.delivery_date_label : data?.delivery_date} regularStyle={styles.deliveryDetailStyle} />
                                                </View>
                                                <View style={styles.deliveryDetailContain}>
                                                    <BoldLabel title={Strings.ShoppingCart.deliveryTime} boldStyle={styles.deliveryDetailStyle} />
                                                    <RegularLabel title={data?.delivery_time} regularStyle={styles.deliveryDetailStyle} />
                                                </View>
                                            </View>
                                        </View>

                                        <TouchableOpacity onPress={() => { apply ? handleRemoveDiscount() : handleApplyDiscount() }} activeOpacity={0.7}
                                            style={styles.applyCouponContainer}>
                                            <View style={[styles.deliveryDetailContain, { marginTop: 0 }]}>
                                                <Icon source={ImagePath.Other.couponChip} style={{ height: 17, width: 21 }} />
                                                <BoldLabel title={couponStatus ? couponStatus : 'Apply Coupon'} boldStyle={{ fontSize: 15, marginLeft: 8 }} />
                                            </View>

                                            <View style={[styles.deliveryDetailContain, { marginTop: 0 }]}>
                                                <RobotoRegularLabel title={apply ? 'Remove' : 'Offers & Benefits Available'} robotoRegularStyle={{ fontSize: 13, }} />
                                                {apply && <Icon style={{ width: 18, height: 18 }} source={ImagePath.Other.close} />}
                                            </View>
                                        </TouchableOpacity>
                                        {couponModal()}

                                        <View style={styles.orderSummaryView}>
                                            <View style={{ marginTop: Size.l, alignSelf: 'center' }}>
                                                <BoldLabel title={Strings.ShoppingCart.orderSummary} boldStyle={{ fontSize: 18 }} />
                                                <View style={styles.summaryBorder} />
                                            </View>

                                            <View style={{ marginVertical: 20 }}>
                                                <View style={{ marginHorizontal: 4 }}>
                                                    {deliveryData?.result?.map((data, index) => (
                                                        <View key={data?._id} style={styles.personalizedMessage}>
                                                            <RegularLabel title={`Cart ${index + 1}`} regularStyle={styles.deliveryDetailText} />
                                                            <RegularLabel title={`${deliveryData?.currency} ${data?.sub_total_with_out_discount ? data?.sub_total_with_out_discount : 0}`} regularStyle={styles.deliveryDetailText} />
                                                        </View>
                                                    ))}
                                                    <View style={styles.personalizedMessage}>
                                                        <RegularLabel title={'Delivery Charges'} regularStyle={styles.deliveryDetailText} />
                                                        <RegularLabel title={`${deliveryData?.currency} ${deliveryData?.total_delivery_charge ? deliveryData?.total_delivery_charge : 0}`} regularStyle={styles.deliveryDetailText} />
                                                    </View>
                                                    <View style={styles.personalizedMessage}>
                                                        <RegularLabel title={Strings.ShoppingCart.discount} regularStyle={[styles.deliveryDetailText]} />
                                                        <RegularLabel title={`${deliveryData?.currency} ${deliveryData?.total_discount_amount ? deliveryData?.total_discount_amount : 0}`} regularStyle={[styles.deliveryDetailText]} />
                                                    </View>
                                                </View>

                                                <View style={[styles.personalizedMessage, styles.totalAmount]}>
                                                    <BoldLabel title={Strings.ShoppingCart.total} boldStyle={{ fontSize: 14.5, }} />
                                                    <BoldLabel title={`${deliveryData?.currency} ${deliveryData?.total_pay_order_amount ? deliveryData?.total_pay_order_amount : 0}`} boldStyle={{ fontSize: 14.5, }} />
                                                </View>
                                            </View>
                                        </View>

                                        <Button
                                            style={{ marginHorizontal: 12, marginBottom: 20 }}
                                            title={Strings.ShoppingCart.coutinue}
                                            onPress={() => navigation.navigate('PersonalizedMessage')}
                                            labelStyle={{ fontSize: 17, }}
                                        />
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </>}
        </SafeAreaView >
    )
};
export default ShoppingCart;