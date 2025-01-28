import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import styles from "./styles";
import { BackButtonHeader, Button, Loader, ProgressiveImage } from "../../../components";
import { Size, Strings, Colors, RobotoMediumLabel, MediumLabel, BoldLabel, RegularLabel, RobotoRegularLabel, RobotoBoldLabel, OpenSansBoldLabel, OpenSansRegularLabel } from "../../../constants";
import { instance } from "../../../utils";

export default Summary = ({ navigation, route }) => {

    const orderNumber = route.params?.orderNumber;
    const [isLoading, setIsLoading] = useState(false);
    const [userCartData, setUserCartData] = useState();

    const summaryList = async () => {
        setIsLoading(true)
        instance.post('/get_cart_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setUserCartData(userData);
            }
            setIsLoading(false);
        }).catch(error => {
            console.log('summaryList=====catch=====', error);
            navigation.navigate('CatchError');
            AlertError(Strings.Other.catchError);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        summaryList();
    }, []);

    return (
        <SafeAreaView style={styles.mainContainer}>

            <BackButtonHeader
                title='Summary'
                containerStyle={styles.headerContainer}
            />

            {isLoading ? <Loader />
                :
                <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
                    <View style={{ alignSelf: "center", marginTop: 10 }}>
                        <RobotoMediumLabel title={Strings.Payment.CheckOut} robotoMediumStyle={{ fontSize: 15 }} />
                    </View>
                    <View>

                        <View style={styles.mainProcessBarCount}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()} activeOpacity={0.7}
                                    style={styles.countView}
                                    hitSlop={styles.hitSlop}
                                >
                                    <RobotoRegularLabel title={`${'1'}`} robotoRegularStyle={styles.countStyle} />
                                </TouchableOpacity>
                                <View style={styles.borderViewStyle} />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={[styles.countView, { borderColor: Colors.ClearBlue, backgroundColor: null, borderWidth: 1, }]}>
                                    <RobotoRegularLabel title={`${'2'}`} robotoRegularStyle={[styles.countStyle, { opacity: .8, color: Colors.ClearBlue }]} />
                                </View>
                                <View style={[styles.borderViewStyle, { backgroundColor: "#7070704F", opacity: null }]} />
                            </View>

                            <View style={[styles.countView, { borderColor: Colors.QuiteGrey, backgroundColor: null, borderWidth: 1 }]}>
                                <RobotoRegularLabel title={`${'3'}`} robotoRegularStyle={[styles.countStyle, { opacity: .8, color: Colors.QuiteGrey }]} />
                            </View>
                        </View>

                        <View style={styles.proccessUpdateView}>
                            <RobotoRegularLabel title={Strings.Payment.DeliveryDetails} robotoRegularStyle={{ fontSize: 11, }} />
                            <RobotoRegularLabel title={Strings.Payment.OrderSummary} robotoRegularStyle={{ fontSize: 11, right: 14 }} />
                            <RobotoRegularLabel title={Strings.Payment.payment} robotoRegularStyle={{ fontSize: 11, right: 14 }} />
                        </View>
                    </View>

                    <View style={styles.borderView} />

                    {userCartData?.result?.map((data, index) => (

                        <View style={{}} key={index}>
                            <View style={styles.cartIdContainer}>
                                <OpenSansBoldLabel
                                    title={`${'CART #'}${index + 1}`}
                                    openSansBoldStyle={{ color: Colors.Secondary.Black, fontSize: 13, }} />
                            </View>

                            <View style={styles.mainProductDetailView}>

                                <FlatList
                                    data={data?.items}
                                    scrollEnabled={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <View>
                                                <View style={styles.productDetailView}>
                                                    <ProgressiveImage
                                                        source={{ uri: userCartData?.image_url + item?.product_detail?.product_image }}
                                                        style={{ height: 83, width: 83 }}
                                                    />
                                                    <View style={styles.productSubDetail}>
                                                        <View style={{ flex: 1 }}>
                                                            <RobotoRegularLabel title={`${'id #'}${item?.product_detail?.product_unique_id}`} robotoRegularStyle={{ fontSize: 13.5 }} />
                                                            <View style={{ marginTop: 5, width: '95%', height: 35, }}>
                                                                <RobotoRegularLabel title={item?.product_detail?.product_name} robotoRegularStyle={{ fontSize: 15.5, color: Colors.DoveGrayNew }} numberOfLines={2} />
                                                            </View>

                                                            <View style={{ marginTop: 2 }}>
                                                                <RobotoRegularLabel title={`Qty : ${item?.quantity}`} robotoRegularStyle={{ fontSize: 13.5 }} />
                                                                {item?.alphabet_name !== "" && <RobotoRegularLabel robotoRegularStyle={{ fontSize: 13.5 }} title={`Alphabet Selected : ${item?.alphabet_name}`} />}
                                                                {item?.add_vase === 1 && <RobotoRegularLabel robotoRegularStyle={{ fontSize: 13.5, lineHeight: 23 }} title={`Glass in Vase : ${userCartData?.currency} ${item?.product_detail?.vase_price}`} />}
                                                                {item?.add_eggless === 1 && <RobotoRegularLabel robotoRegularStyle={{ fontSize: 13.5 }} title={`Eggless : ${userCartData?.currency} ${item?.product_detail?.eggless_price}`} />}

                                                                {item?.personalised_image_name !== '' && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <RobotoRegularLabel robotoRegularStyle={{ fontSize: 13.5, }} title={'Personalised Image : '} />
                                                                    <Image style={{ width: 40, height: 30 }} source={{ uri: userCartData?.cart_image_url + item?.personalised_image_name }} />
                                                                </View>}
                                                            </View>

                                                        </View>
                                                        <View style={{ marginTop: 8, }}>
                                                            <RobotoBoldLabel title={`${userCartData?.currency} ${item?.product_detail?.price}`} robotoBoldStyle={{ fontSize: 15.5, color: Colors.RossoCorsa }} />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.thinBorder} />
                                            </View>
                                        )
                                    }}
                                />

                                <View style={styles.deliveryDetail}>
                                    <RobotoBoldLabel title={Strings.ShoppingCart.deliveryDate} robotoBoldStyle={{ fontSize: 15, }} />
                                    <RobotoRegularLabel title={data?.delivery_date} robotoRegularStyle={styles.dateStyle} />
                                </View>
                                <View style={[styles.deliveryDetail, { marginTop: 8 }]}>
                                    <RobotoBoldLabel title={Strings.ShoppingCart.deliveryTime} robotoBoldStyle={{ fontSize: 15, }} />
                                    <RobotoRegularLabel title={data?.delivery_time} robotoRegularStyle={styles.dateStyle} />
                                </View>

                                <View style={[styles.thinBorder, { marginTop: 15, }]} />
                                <View style={styles.subTotalContain}>
                                    <MediumLabel title={`Subtotal (${data.items?.length} items): `} mediumStyle={{ fontSize: 15 }} />
                                    <BoldLabel title={`${userCartData?.currency} ${data?.sub_total_with_out_discount ? data?.sub_total_with_out_discount : 0}`} boldStyle={{ fontSize: 14.5 }} />
                                </View>

                                <View style={[styles.thinBorder, { marginTop: 15, marginHorizontal: 10, }]} />
                                <View style={styles.personalizedMsgView}>
                                    <View style={{ marginTop: 24 }}>
                                        <OpenSansBoldLabel title={Strings.Other.personalizedMessage} openSansBoldStyle={{ fontSize: 13.5, color: Colors.MirageBlue }} />
                                    </View>
                                    <View style={{ marginTop: 13 }}>
                                        <OpenSansBoldLabel title={data?.card_category_name} openSansBoldStyle={{ fontSize: 15.5, color: Colors.MirageBlue }} />
                                    </View>
                                    <View style={{ marginTop: 15, }}>
                                        <OpenSansRegularLabel title={data?.cart_message} openSansRegularStyle={{ fontSize: 15.5 }} />
                                    </View>
                                    <View style={{ marginTop: 15 }}>
                                        <OpenSansBoldLabel title={data?.sender_name} openSansBoldStyle={{ fontSize: 15.5, color: Colors.MirageBlue }} />
                                    </View>
                                </View>

                            </View>
                        </View>
                    ))}

                    <View style={styles.borderView} />
                    <View style={{ marginTop: 15, marginHorizontal: 10 }}>
                        <RobotoMediumLabel title={`${'Billing Details'}`} robotoMediumStyle={styles.dateStyle} />
                    </View>

                    <View style={styles.chargesDetailMainView}>
                        {userCartData?.result.map((data, index) => (
                            <View style={styles.chargesDetail} key={index}>
                                <RegularLabel title={`Cart ${index + 1}`} regularStyle={styles.deliveryDetailText} />
                                <RegularLabel title={`${userCartData?.currency} ${data?.sub_total_with_out_discount ? data?.sub_total_with_out_discount : 0}`} regularStyle={styles.deliveryDetailText} />
                            </View>
                        ))}
                        <View style={styles.chargesDetail}>
                            <RegularLabel title={`${'Delivery Charges'}`} regularStyle={styles.chargesTitleStyle} />
                            <RegularLabel title={`${userCartData?.currency} ${userCartData?.total_delivery_charge}`} regularStyle={styles.chargesTitleStyle} />
                        </View>
                        <View style={styles.chargesDetail}>
                            <RegularLabel title={Strings.ShoppingCart.discount} regularStyle={[styles.chargesTitleStyle, { color: Colors.Red }]} />
                            <RegularLabel title={`${userCartData?.currency} ${userCartData?.total_discount_amount ? userCartData?.total_discount_amount : 0}`} regularStyle={[styles.chargesTitleStyle, { color: Colors.Red }]} />
                        </View>
                        <View style={styles.chargesDetail}>
                            <RegularLabel title={Strings.ShoppingCart.total} regularStyle={styles.chargesTitleStyle} />
                            <RegularLabel title={`${userCartData?.currency} ${userCartData?.total_pay_order_amount}`} regularStyle={styles.chargesTitleStyle} />
                        </View>
                    </View>

                </ScrollView>}

            {!isLoading && <View style={{ backgroundColor: Colors.White, paddingVertical: 12 }}>
                <Button
                    buttonMainContainer={styles.buttonView}
                    style={styles.button}
                    title={Strings.Other.proceedTopay}
                    onPress={() => navigation.navigate('Payment', { 'orderNumber': orderNumber, "userCartData": userCartData })}
                    labelStyle={{ marginLeft: Size.xm1, fontSize: 14.5, }}
                />
            </View>}
        </SafeAreaView>
    )
};
