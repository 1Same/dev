import React, { useEffect, useState, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Image, SafeAreaView, Platform, UIManager, TextInput, ScrollView, TouchableOpacity, FlatList, Keyboard, Modal, Dimensions } from 'react-native';
import styles from "./styles";
import { Button, Loader, AlertError, NewHeader, PopUp, ProgressiveImage, ToastError, BackButtonHeader } from "../../../components";
import { Size, Colors, Typography, Strings, Icon, ImagePath, RobotoRegularLabel, BoldLabel, RobotoMediumLabel, MediumLabel, RegularLabel, Label, RobotoBoldLabel, OpenSansBoldLabel, Spacer } from "../../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { instance } from "../../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ShoppingCart = ({ navigation }) => {

    const focus = useIsFocused();
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
        if (focus) {
            setEmptyCart(false)
            setLoading(true);
            shopingCart(true);
            getCouponCode();
        }
    }, [focus]);

    const shopingCart = async (val = true, cartItemId = '') => {

        (val == true) ? setLoading(true) : setLoading(false)

        instance.post('/get_cart_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            // console.log('shopingCart userData========', userData);
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

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

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
    }

    const cartEmpty = () => {
        return (
            isLoading && emptyCart == false ?
                <Loader />
                :
                (
                    <View style={{ flex: 1 }}>
                        <BackButtonHeader
                            // title={"Customer Reviews"}
                            containerStyle={{ marginHorizontal: Size.m11 }}
                        />
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
    }

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
    }

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
                        <View style={{}}>
                            <BoldLabel title={Strings.CouponCode.apply} boldStyle={{ fontSize: Size.xl, }} />
                        </View>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { setOpenCouponModal(false), setCouponError('') }} style={{}}>
                            <Icon source={ImagePath.Other.closeCircleBlack} style={{ height: hp('5%'), width: wp('10%'), }} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputMainContainer}>
                        {apply ?
                            <View style={{ marginTop: hp('.4') }}>
                                <RegularLabel title={couponStatus} regularStyle={{ color: Colors.Dawn }} />
                            </View>
                            :
                            <View style={styles.InputContiner}>
                                <TextInput
                                    placeholderTextColor={Colors.DuneLight}
                                    keyboardType="twitter"
                                    style={styles.codeInput}
                                    value={discountCode}
                                    onChangeText={handleDiscountCodeChange}
                                    placeholder={Strings.ShoppingCart.enterCouponCode}
                                    editable={apply ? false : true}
                                />
                            </View>}

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => apply ? handleRemoveDiscount() : handleApplyDiscount('coupon')}
                            style={styles.applyContain}
                        >
                            <RegularLabel
                                title={apply ? Strings.ShoppingCart.remove : Strings.ShoppingCart.apply}
                                regularStyle={{ fontSize: Size.m, color: Colors.White }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: wp('5.5%') }}>
                        <Label text={couponError ? couponError : ''} style={{ color: Colors.Red, fontSize: 13 }} />
                    </View>

                    <View style={styles.borderContain} />

                    <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        <View style={{ marginTop: 13, marginHorizontal: Size.m011, marginBottom: 13 }}>
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


    return (
        <SafeAreaView style={styles.mainContainer}>

            {(isLoading || deliveryData == '' || emptyCart == false) ?
                <Loader />
                :
                (deliveryData?.result?.length == 0 && emptyCart) ?
                    cartEmpty()
                    :
                    <>
                        <NewHeader
                            exploreIcon
                        />

                        <ScrollView style={{ flexGrow: 1 }} ref={scrollViewRef} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, marginTop: 15 }}>
                                <RobotoMediumLabel title={Strings.ShoppingCart.shoppingCart} robotoMediumStyle={{ fontSize: 22 }} />
                                <TouchableOpacity
                                    onPress={() => { navigation.navigate('Listing', { "menu_url": ItemsData, }) }} activeOpacity={0.7}
                                    style={{ backgroundColor: Colors.BlueRibbon, borderRadius: Size.xm, flexDirection: "row", height: 48, justifyContent: 'center', paddingHorizontal: 20, alignItems: 'center' }}>
                                    <Icon style={{ tintColor: Colors.White, width: 19, height: 19 }} source={ImagePath.Other.bagIcon} />
                                    <RobotoMediumLabel title={Strings.ShoppingCart.continueShopping} robotoMediumStyle={{ fontSize: 13, color: Colors.White, marginLeft: 6, }} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.borderView} />

                            <View style={{ flex: 1, marginTop: 10 }}>

                                {deliveryData?.result.length > 1 &&
                                    <View style={{ flex: 1, marginLeft: 5 }}>
                                        <FlatList
                                            data={deliveryData?.result}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            ListFooterComponent={<Spacer style={{ marginTop: 0, marginRight: 9.50 }} />}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <View style={{ marginLeft: 5, flexDirection: "row", }} key={item._id}>
                                                        <TouchableOpacity onPress={() => { displayCart(item?._id), Keyboard.dismiss() }}
                                                            style={[styles.cartIdContain,
                                                            {
                                                                backgroundColor: showCart === item?._id ? Colors.Primary.Camel : "#FCFCFC",
                                                                borderWidth: .5, borderColor: showCart === item?._id ? Colors.Primary.Camel : Colors.PaleSlate
                                                            }]}
                                                            activeOpacity={0.6} >
                                                            <OpenSansBoldLabel
                                                                title={`${Strings.ShoppingCart.cartId} ${item?.delivery_date_label ? item?.delivery_date_label : item?.delivery_date}`}
                                                                openSansBoldStyle={{ color: showCart === item?._id ? Colors.White : Colors.Secondary.Black, fontSize: 13, }} />
                                                        </TouchableOpacity>

                                                    </View>
                                                )
                                            }} />

                                    </View>
                                }

                                <View>
                                    {deliveryData?.result?.map((data, index) => (
                                        (showCart === data?._id) &&

                                        <View key={data._id} >
                                            <View style={styles.cartItemContain}>
                                                <View style={{ flex: 1, }}>
                                                    <FlatList
                                                        data={data?.items}
                                                        scrollEnabled={false}
                                                        renderItem={({ item }) => {
                                                            return (
                                                                <View key={item._id} style={{ paddingVertical: 5, }}>
                                                                    <View style={{ flexDirection: "row", }}>
                                                                        <TouchableOpacity onPress={() => { navigation.navigate("Detail", { "productSlug": item?.product_detail?.slug, "productId": item?.product_detail?._id }) }} activeOpacity={0.8}>
                                                                            <ProgressiveImage
                                                                                source={{ uri: imageUrl + item?.product_detail?.product_image }}
                                                                                style={{ height: 145, width: 145, }}
                                                                            />
                                                                        </TouchableOpacity>

                                                                        <View style={{ paddingLeft: Size.xm2, flex: 1 }}>
                                                                            <BoldLabel title={`${'id #'}${item?.product_detail?.product_unique_id}`} boldStyle={{ fontSize: 13 }} />
                                                                            <View style={styles.productTitle}>
                                                                                <BoldLabel
                                                                                    title={item?.product_detail?.product_name}
                                                                                    numberOfLines={1}
                                                                                    boldStyle={{ fontSize: 15, fontFamily: Typography.RobotoMedium }} />
                                                                            </View>

                                                                            <View style={{ marginTop: 8 }}>
                                                                                <BoldLabel
                                                                                    title={`${deliveryData?.currency} ${item?.product_detail?.price}`}
                                                                                    boldStyle={{ color: Colors.RossoCorsa, fontSize: 15 }} />
                                                                            </View>

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

                                                                            <View style={[styles.counterContain, { marginTop: (item?.alphabet_name == "" || item?.add_vase === 0 || item?.add_eggless == 0 || item?.personalised_image_name == "") ? 30 : 10 }]}>

                                                                                <View style={styles.buttonContaine}>
                                                                                    <TouchableOpacity onPress={() => {
                                                                                        if (item?.quantity === 1) {
                                                                                            setRemoveCartData({ "cartItemId": item?._id, "cartId": data._id, "cartlength": data?.items?.length })
                                                                                            setRemoveCart(true)
                                                                                        } else {
                                                                                            decrement(item)
                                                                                        }
                                                                                    }} activeOpacity={0.6} hitSlop={styles.hitSlop}>
                                                                                        <Spacer style={styles.decrementView} />
                                                                                    </TouchableOpacity>

                                                                                    <View style={{ marginHorizontal: Size.xm2 }}>
                                                                                        <Label style={[styles.incrementButton, { fontSize: 16 }]} text={item?.quantity} />
                                                                                    </View>
                                                                                    <TouchableOpacity onPress={() => increment(item)} activeOpacity={0.6}>
                                                                                        <Label style={styles.incrementButton} text='+' />
                                                                                    </TouchableOpacity>
                                                                                </View>

                                                                                <TouchableOpacity activeOpacity={0.6}
                                                                                    onPress={() => {
                                                                                        setRemoveCartData({ "cartItemId": item?._id, "cartId": data._id, "cartlength": data?.items?.length })
                                                                                        setRemoveCart(true);
                                                                                    }}
                                                                                    style={{ marginLeft: 18 }}>
                                                                                    <Icon source={ImagePath.Other.deleteBlack} style={styles.arrow} />
                                                                                </TouchableOpacity>

                                                                                {/* {removeCartPopup()} */}
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
                                                                    </View>
                                                                </View>
                                                            )
                                                        }}
                                                    />
                                                </View>
                                                <View style={styles.borderContain} />

                                                <View style={{ marginTop: 5 }}>
                                                    <View style={styles.deliveryDetailContain}>
                                                        <BoldLabel title={Strings.ShoppingCart.deliveryDate} boldStyle={styles.deliveryDetailStyle} />
                                                        <RegularLabel title={data?.delivery_date_label ? data?.delivery_date_label : data?.delivery_date} regularStyle={styles.deliveryDetailStyle} />
                                                    </View>
                                                    <View style={styles.deliveryDetailContain}>
                                                        <BoldLabel title={Strings.ShoppingCart.deliveryTime} boldStyle={styles.deliveryDetailStyle} />
                                                        <RegularLabel title={data?.delivery_time} regularStyle={styles.deliveryDetailStyle} />
                                                    </View>
                                                    <View style={styles.deliveryDetailContain}>
                                                        <BoldLabel title={Strings.ShoppingCart.deliveryCity} boldStyle={styles.deliveryDetailStyle} />
                                                        <RegularLabel title={deliveryData?.userCartData?.city_data?.city_name} regularStyle={styles.deliveryDetailStyle} />
                                                    </View>
                                                </View>

                                                <View style={[styles.borderContain, { marginTop: Size.xm1 }]} />
                                                <View style={styles.subTotalContain}>
                                                    <MediumLabel title={`Subtotal (${data.items?.length} items): `} mediumStyle={{ fontSize: 15 }} />
                                                    <BoldLabel title={`${deliveryData?.currency} ${data?.sub_total_with_out_discount ? data?.sub_total_with_out_discount : 0}`} boldStyle={{ fontSize: 15 }} />
                                                </View>

                                                <Spacer style={{ marginTop: 15 }} />
                                                {/* remove add addPersonalizedMessage text */}

                                            </View>

                                            {/* remove add addPersonalizedMessage all UI */}
                                            {couponModal()}
                                            {/* coupon code start */}
                                            <View style={[styles.borderContain, { marginTop: 18, height: 6 }]} />
                                            <View style={styles.applyCouponContainer}>
                                                <View style={[styles.deliveryDetailContain, { marginTop: 0 }]}>
                                                    <Icon source={ImagePath.Other.couponChip} style={{ height: 17, width: 27 }} />
                                                    <Label text={couponStatus ? couponStatus : 'Have a coupon Code?'} style={{ fontSize: 16 }} />
                                                </View>

                                                <TouchableOpacity onPress={() => { apply ? handleRemoveDiscount() : handleApplyDiscount() }} activeOpacity={0.7} style={[styles.deliveryDetailContain, { marginTop: 0 }]}>
                                                    <RobotoRegularLabel title={apply ? 'Remove' : 'Offers & Benefits Available'} robotoRegularStyle={{ fontSize: 14, color: apply ? Colors.Black : Colors.Green }} />
                                                    {apply && <Icon style={{ width: 18, height: 18 }} source={ImagePath.Other.close} />}
                                                </TouchableOpacity>
                                            </View>

                                            <View style={[styles.borderContain, { marginTop: 20, }]} />
                                            <View style={{ marginHorizontal: Size.xm2, }}>

                                                <View style={{ marginTop: Size.l }}>
                                                    <BoldLabel title={Strings.ShoppingCart.orderSummary} boldStyle={{ fontSize: Size.m1 }} />
                                                </View>


                                                <View style={{ marginBottom: "15%", marginTop: 15 }}>
                                                    {deliveryData?.result.map((data, index) => (
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
                                                        <RegularLabel title={Strings.ShoppingCart.discount} regularStyle={[styles.deliveryDetailText, { color: Colors.Red }]} />
                                                        <RegularLabel title={`${deliveryData?.currency} ${deliveryData?.total_discount_amount ? deliveryData?.total_discount_amount : 0}`} regularStyle={[styles.deliveryDetailText, { color: Colors.RossoCorsa }]} />
                                                    </View>
                                                </View>

                                                <View style={styles.personalizedMessage}>
                                                    <RegularLabel title={Strings.ShoppingCart.total} regularStyle={styles.deliveryDetailText} />
                                                    <RegularLabel title={`${deliveryData?.currency} ${deliveryData?.total_pay_order_amount ? deliveryData?.total_pay_order_amount : 0}`} regularStyle={styles.deliveryDetailText} />
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>

                        </ScrollView>

                        {
                            !isTextInputFocused && <View style={[styles.proceedToCheckContainer]}>
                                {deliveryData && deliveryData?.result.length > 1 ?
                                    <View style={[styles.productFeatureContainer,]}>
                                        <View style={[styles.deleteContainer, {}]}>
                                            <RobotoRegularLabel title={`${'Total Cart: '}`} robotoRegularStyle={{ fontSize: 13.5 }} />
                                            <RobotoBoldLabel title={`${deliveryData?.result.length}`} robotoBoldStyle={styles.boldStyle} />
                                        </View>

                                        <View style={styles.borderHeight} />
                                        <View style={[styles.deleteContainer, {}]}>
                                            <RobotoRegularLabel title={`${'Total Products: '}`} robotoRegularStyle={{ fontSize: 13.5 }} />
                                            <RobotoBoldLabel title={`${deliveryData?.total_cart_product_count ? deliveryData?.total_cart_product_count : ''}`} robotoBoldStyle={styles.boldStyle} />
                                        </View>

                                        <View style={styles.borderHeight} />
                                        <View style={[styles.deleteContainer, {}]}>
                                            <RobotoRegularLabel title={`${'Total Price: '}`} robotoRegularStyle={{ fontSize: 13.5 }} />
                                            <RobotoBoldLabel title={`${deliveryData?.currency} ${deliveryData?.total_pay_order_amount ? deliveryData?.total_pay_order_amount : 0}`} robotoBoldStyle={styles.boldStyle} />
                                        </View>
                                    </View>
                                    :
                                    <View style={[styles.productFeatureContainer, { justifyContent: "space-around" }]}>
                                        <View style={[styles.deleteContainer, {}]}>
                                            <RobotoRegularLabel title={`${'Total Products: '}`} robotoRegularStyle={{ fontSize: 13.5 }} />
                                            <View style={{ marginLeft: 5 }}>
                                                <RobotoBoldLabel title={`${deliveryData?.total_cart_product_count ? deliveryData?.total_cart_product_count : 0}`} robotoBoldStyle={styles.boldStyle} />
                                            </View>
                                        </View>
                                        <View style={styles.borderHeight} />

                                        <View style={[styles.deleteContainer, {}]}>
                                            <RobotoRegularLabel title={`${'Total Price: '}`} robotoRegularStyle={{ fontSize: 13.5 }} />

                                            <View style={{ marginLeft: 5 }}>
                                                <RobotoBoldLabel title={`${deliveryData?.currency} ${deliveryData?.total_pay_order_amount ? deliveryData?.total_pay_order_amount : 0}`} robotoBoldStyle={styles.boldStyle} />
                                            </View>
                                        </View>
                                    </View>
                                }

                                <Button
                                    buttonMainContainer={{}}
                                    title={Strings.ShoppingCart.proceedToCheckout}
                                    onPress={() => navigation.navigate('PersonalizedMessage')}
                                    labelStyle={{ fontSize: 14.5, }}
                                />
                            </View>
                        }

                    </>}
        </SafeAreaView >
    )
};