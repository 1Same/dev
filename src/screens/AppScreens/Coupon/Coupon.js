import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, Size, Strings, Icon, ImagePath, RobotoBoldLabel, BoldLabel, RegularLabel, Label } from "../../../constants";
import { Button, Loader, ToastSuccess, ToastError, AlertError } from "../../../components";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { instance } from "../../../utils";


export default Coupon = ({ route, navigation, }) => {


    const [discountCode, setDiscountCode] = useState('' || route.params?.discountCode && route.params?.discountCode == "" ? route.params?.discountCode : '');
    const [apply, setApply] = useState(route.params?.discountCode && discountCode ? true : false);
    const [couponStatus, setCouponStatus] = useState(route.params?.discountCode ? `'${discountCode}' Applied` : null);
    const [isCouponDeleted, setIsCouponDeleted] = useState(false);
    const [isLoding, setLoding] = useState(false);
    const [couponCodeData, setCouponCodeData] = useState([]);
    const [couponError, setCouponError] = useState();

    const getCouponCode = () => {
        setLoding(true)
        instance.post('/coupon_code_list', {
            req: {
                "data": {}
            }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                // console.log("userData=-=-=-=-=-", userData);
                setCouponCodeData(userData?.result)
                setLoding(false)

            } else {
                setLoding(false);
                ToastError(userData?.message);
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
        });
    }

    useEffect(() => {
        getCouponCode();
    }, []);

    const handleRemoveDiscount = () => {
        setDiscountCode('');
        setApply(false);
        setCouponStatus('');
        setIsCouponDeleted(true);
        ToastSuccess("Coupon code remove successfully")
    };

    const handleApplyDiscount = async () => {

        const isCode = couponCodeData.some((item) => item.promo_code === discountCode);

        setIsCouponDeleted(false);
        if (discountCode === '' || discountCode == undefined) {
            setApply(false);
            setCouponStatus('');
            setCouponError('Please enter a coupon code.');
        } else {
            if (isCode) {
                setApply(true);
                setCouponError('')
                setCouponStatus(`'${discountCode}' Applied`);
                navigation.navigate("ShoppingCart", { discountCode: discountCode, isCouponDeleted: isCouponDeleted })
                ToastSuccess("Coupon code apply successfully")
            } else {
                setApply(false);
                setCouponStatus('Not a valid code');
                setCouponError('Not a valid code')
                ToastError("Coupon code apply failed")
            }
        }
    };

    const handleDiscountCodeChange = (text) => {
       
        setDiscountCode(text);
        if (text === '') {
            setCouponStatus('');
        }
    };


    return (
        <SafeAreaView style={styles.mainContainer}>

            {isLoding ?
                <Loader />
                :
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>

                    <View style={styles.couponCodeContainer}>
                        <View style={{}}>
                            <BoldLabel title={Strings.CouponCode.apply} boldStyle={{ fontSize: Size.xl, }} />
                        </View>
                        {/* <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack("ShoppingCart", { discountCode: apply && discountCode ? discountCode : '', isCouponDeleted: isCouponDeleted })} style={{}}> */}
                        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()} style={{}}>
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
                            onPress={() => apply ? handleRemoveDiscount() : handleApplyDiscount()}
                            style={styles.applyContain}
                        >
                            <RegularLabel
                                title={apply ? Strings.ShoppingCart.remove : Strings.ShoppingCart.apply}
                                regularStyle={{ fontSize: Size.m, color: Colors.White }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: wp('4%') }}>
                        <Label text={couponError ? couponError : ''} style={{ color: Colors.Red, fontSize: 12 }} />
                    </View>

                    <View style={styles.borderContain} />
                    <View style={{ marginTop: 13, marginHorizontal: Size.m011, marginBottom: 13 }}>
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
                                        {/* <View style={{ marginLeft: Size.m011, width: wp('80') }}> */}
                                        {/* <RegularLabel title={"Use code TRYNEW & get 60% off on orders above ₹159. Maximum discount: ₹120."} regularStyle={{ fontSize: 15, lineHeight: 20 }} /> */}
                                        {/* <RegularLabel title={item?.code_description} regularStyle={{}} /> */}
                                        {/* </View> */}
                                        <Button
                                            labelStyle={{ paddingTop: hp('1.8%') }}
                                            title={Strings.CouponCode.applyCoupon}
                                            onPress={() => navigation.navigate("ShoppingCart", { 'discountCode': item?.promo_code })}
                                            style={styles.buttonContainer}
                                        />
                                    </View>
                                )
                            }}
                        />
                    </View>
                </KeyboardAwareScrollView>
            }
        </SafeAreaView>
    )

}


