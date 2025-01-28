import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View, TouchableOpacity, Modal } from 'react-native';
import styles from "./styles";
import { Loader, Button, NewHeader, ToastSuccess, AlertError, ToastError } from "../../../components";
import { ImagePath, Size, Icon, BoldLabel, Strings, Colors, RobotoMediumLabel, RobotoRegularLabel } from "../../../constants";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { instance, setting } from "../../../utils";
import paypalApi from "../../../utils/paypalApi";
import WebView from "react-native-webview";
import queryString from "query-string";
import { store } from "../../../app/Store";
import { useSelector } from "react-redux";

export default Payment = ({ navigation, route }) => {

    const [select, setSelect] = useState();
    const [orderData, setOrderData] = useState();
    const [webViewModal, setWebViewModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isLoadeMore, setIsLoadeMore] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [paypalUrl, setPaypalUrl] = useState('');
    const StoreData = store.getState();
    const authData = useSelector((state) => state.auth);
    const userCartData = route?.params?.userCartData;
    const orderNumber = route?.params?.orderNumber;

    const getPayment = async () => {
        setLoading(true);
        instance.post('/order_detail_for_payment', {
            req: { "data": { 'order_reference': route?.params?.orderNumber } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                // console.log("userData getPayment=-=-=-=-=-", userData);
                if (userData.status === 'success') {
                    setOrderData(userData)
                    updateOrderPayment(userData?.payment_gate_way_list[0])
                    setLoading(false);
                    const token = await paypalApi.generateToken();
                    const res = await paypalApi.createOrder(token, userData?.pay_amount, userData?.website_currency_code)
                }
                else {
                    setLoading(false);
                }

            }).catch(error => {
                console.log('getPayment=====catch====', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setLoading(false);
            });
    };

    useEffect(() => {
        getPayment()
    }, []);

    const handleWebViewNavigationStateChange = async (newNavState) => {
        const { url } = newNavState;
        console.log("newNavState url----", url);
        if (url.search(setting[setting.environment].cms_url + "payment-failed/") > -1) {
            setWebViewModal(false);
            navigation.navigate('PaymentFailed', { "orderId": orderData?.result[0]?._id, });
        } else if (url.search(setting[setting.environment].cms_url + "payment-success/") > -1) {
            setWebViewModal(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'MyDrawerNav' }, { name: 'SuccessMessage', params: { "orderId": orderData?.result[0]?._id, } }], // Reset the stack with Home as the first screen
            });
        }
    };

    const onPressPaypal = async () => {
        setIsLoadeMore(true);
        try {
            const token = await paypalApi.generateToken()
            const res = await paypalApi.createOrder(token, orderData?.pay_amount, orderData?.website_currency_code)
            setAccessToken(token);
            setIsLoadeMore(false);
            if (!!res?.links) {
                const findUrl = res?.links.find(data => data?.rel == 'approve')
                setPaypalUrl(findUrl.href)
            }
            // console.log('onPressPaypal====+++', res);

        } catch (error) {
            console.log('error====++', error);
            setIsLoadeMore(false)
        }
    }

    const onUrlChange = (webViewState) => {
        const { url } = webViewState;
        if (url.search(setting[setting.environment].cms_url + "payment-success") > -1) {
            setLoading(true);
            const urlValues = queryString.parseUrl(webViewState.url)
            const { token } = urlValues?.query
            if (token) {
                const res = paypalApi.capturePayment(token, accessToken);
                checkOrderPayment(token);
                clearPaypalState();
            }
        }
        if (url.search(setting[setting.environment].cms_url + "payment-failed") > -1) {
            console.log('payment-failed==========', url);
            clearPaypalState();
            setLoading(false);
            return;
        }
    };

    const checkOrderPayment = async (value) => {
        instance.post('/check_order_payment', {
            req: {
                "data": {
                    slug: authData?.data?.slug,
                    payment_id: value, //4HA396706P736884C
                    amount: orderData?.pay_amount,
                    order_reference: orderNumber,
                    payment_gateway_name: "paypal",
                    user_cart_id: userCartData?.userCartData?._id,
                    payment_gateway_id: select?._id,
                }
            }

        }).then(async (response) => {
            const userData = JSON?.parse(response.data);
            if (userData.status === 'success') {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyDrawerNav' }, { name: 'SuccessMessage', params: { "orderId": orderData?.result[0]?._id, } }], // Reset the stack with Home as the first screen
                });
                setLoading(false);
                ToastSuccess("payment successful");
            }
            else {
                navigation.navigate('PaymentFailed', { "orderId": orderData?.result[0]?._id, });
                setLoading(false);
                ToastError("payment failed");
            }

        }).catch(error => {
            console.log('checkOrderPayment====catch===', error);
            setLoading(false);
            AlertError(Strings.Other.catchError);
        });
    };

    const updateOrderPayment = async (value) => {
        setSelect(value);

        instance.post('/update_order_payment_gateway', {
            req: {
                "data": {
                    payment_gateway_name: value?.payment_method,
                    payment_gateway_id: value?._id,
                    order_reference_no: orderNumber,
                }
            }
        }).then(async (response) => {
            const userData = JSON?.parse(response.data);
            if (userData.status === 'success') {
                setLoading(false);
            }
            else {
                setLoading(false);
            }

        }).catch(error => {
            console.log('updateOrderPayment====catch====', error);
            setLoading(false);
            AlertError(Strings.Other.catchError);
        });
    };

    const clearPaypalState = () => {
        setPaypalUrl(null);
        setAccessToken(null);
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            {!isLoading && <NewHeader />}
            {isLoading ?
                <Loader />
                :
                <View style={{ flex: .9 }}>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            ListHeaderComponent={
                                <View style={{}}>
                                    <View style={{ alignSelf: "center", marginTop: 10 }}>
                                        <RobotoMediumLabel title={Strings.Payment.CheckOut} />
                                    </View>

                                    <View style={styles.progressUpdateView}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('SelectAddress', { "userCartData": userCartData })} activeOpacity={0.7}
                                                style={styles.countView}
                                                hitSlop={styles.hitSlop}
                                            >
                                                <RobotoRegularLabel title={`${'1'}`} robotoRegularStyle={styles.countStyle} />
                                            </TouchableOpacity>
                                            <View style={styles.proccessBorder} />
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <TouchableOpacity
                                                onPress={() => navigation.goBack()}
                                                style={styles.countView}
                                                hitSlop={styles.hitSlop}
                                                activeOpacity={0.7}
                                            >
                                                <RobotoRegularLabel title={`${'2'}`} robotoRegularStyle={styles.countStyle} />
                                            </TouchableOpacity>
                                            <View style={styles.proccessBorder} />
                                        </View>

                                        <View style={[styles.countView, { borderColor: Colors.ClearBlue, backgroundColor: null, borderWidth: 1 }]}>
                                            <RobotoRegularLabel title={`${'3'}`} robotoRegularStyle={[styles.countStyle, { color: Colors.ClearBlue }]} />
                                        </View>
                                    </View>

                                    <View style={styles.orderDetailView}>
                                        <RobotoRegularLabel title={Strings.Payment.DeliveryDetails} robotoRegularStyle={{ fontSize: 11, }} />
                                        <RobotoRegularLabel title={Strings.Payment.OrderSummary} robotoRegularStyle={{ fontSize: 11, right: 14 }} />
                                        <RobotoRegularLabel title={Strings.Payment.payment} robotoRegularStyle={{ fontSize: 11, right: 14 }} />
                                    </View>

                                    <View style={styles.borderView} />
                                    <View style={styles.subContain}>
                                        <View style={{}}>
                                            <BoldLabel title={Strings.Payment.orderNo} boldStyle={styles.boldStyle} />
                                            <BoldLabel title={Strings.Payment.totalAmount} boldStyle={[styles.boldStyle, { marginTop: 8, }]} />
                                        </View>
                                        <View style={{ flex: .8, alignItems: 'flex-end' }}>
                                            <View style={{ flex: 1, }}>
                                                <BoldLabel title={orderData?.result[0]?._id} boldStyle={styles.boldStyle} numberOfLines={1} />
                                                <BoldLabel title={`${orderData?.website_currency_code} ${orderData?.pay_amount}`} boldStyle={[styles.boldStyle, { marginTop: 8, }]} numberOfLines={1} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.borderView} />
                                </View>
                            }
                            data={orderData?.payment_gate_way_list}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                let payu = item?.slug == 'payu';
                                return (
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => { setSelect(item), updateOrderPayment(item) }}>
                                        <View style={styles.listContainer}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Icon source={ImagePath.Other[item?.slug]} style={{ height: payu ? 30 : 40, width: payu ? 50 : 60 }} />
                                            </View>
                                            <Icon source={select?._id == item?._id ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioGrey} style={{ height: Size.xl, width: Size.xl }} />
                                        </View>
                                        <View style={styles.border} />
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>

                    <Button
                        style={styles.button}
                        title={isLoadeMore ? <Loader /> : Strings.Otp.continue}
                        onPress={() => (select?.payment_method == 'Paypal') ? onPressPaypal() : (select?._id && select?.slug) ? setWebViewModal(true) : setWebViewModal(false)}
                        labelStyle={{ marginLeft: Size.xm1, fontSize: 14.5 }}
                    />

                    <Modal
                        visible={select?.payment_method == 'Paypal' ? !!paypalUrl : webViewModal}
                        transparent={true}
                    >
                        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White, }}>
                            <NewHeader onPress={() => {
                                clearPaypalState();
                                setWebViewModal(false);
                            }} />
                            {select?.payment_method == 'Paypal' ?
                                <WebView
                                    source={{ uri: paypalUrl }}
                                    onNavigationStateChange={onUrlChange}
                                    startInLoadingState={<Loader />}
                                />
                                : <WebView
                                    style={{ width: '94%', margin: '3%', height: hp('100%') }}
                                    source={{ uri: `${setting[setting.environment].cms_url}mobile/payment?user_slug=${StoreData.auth.data?.slug}&payment_slug=${select?.slug}&payment_id=${select?._id}&order_number=${orderData?.result[0]?._id}&user_email=${StoreData.auth.data?.email}&user_phone=${StoreData.auth.data?.mobile}&website_id=${StoreData.auth.data?.website_id}&user_id=${StoreData.auth.data?._id}` }}
                                    onNavigationStateChange={handleWebViewNavigationStateChange}
                                    startInLoadingState={<Loader />}
                                    onMessage={(event) => {
                                        console.log('isLoading false=====');
                                    }}
                                />}

                        </SafeAreaView>
                    </Modal>
                </View>
            }
        </SafeAreaView>
    )
};