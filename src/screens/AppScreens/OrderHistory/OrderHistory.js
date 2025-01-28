import React, { useState, useEffect } from "react";
import { FlatList, SafeAreaView, View, Keyboard, TextInput, Image, TouchableOpacity } from 'react-native';
import styles from "./styles";
import { Label, Strings, Spacer, Colors, Typography, Icon, RegularLabel } from "../../../constants";
import { BackButtonHeader, Button, RowColumn, Loader, ToastError, AlertError, ProgressiveImage } from "../../../components";
import { instance } from "../../../utils";
import { useIsFocused } from "@react-navigation/native";
import { dateFormat } from "../../../lib";


export default OrderHistory = ({ navigation }) => {

    const searchIcon = require('../../../assets/Images/WebpIcon/search-Bar-Bold.png')
    const [getOrderHistoryData, setOrderHistorydata] = useState([])
    const [imageUrl, setImageUrl] = useState('');
    const [isLoding, setIsLoding] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(true);
    const [isLodeData, setIsLodeData] = useState(false);
    const [page, setPage] = useState(0);
    const [orderHistoryData, setOrderHistoryData] = useState([])
    const isFocused = useIsFocused();

    const getOrderHistory = (pageNo = 0, loadData = false, searchStr = searchStr ? searchStr : '') => {
        if ((isLoadMore && isDataFetched) || loadData) {
            let currentPage = pageNo == 1 ? 1 : page + 1
            setPage(currentPage);
            setIsDataFetched(false)
            instance.post('/get_customer_order_list', {
                req: { "data": { "order_id": searchStr, "limit": 20, "page": currentPage } }
            }
            ).then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setOrderHistoryData(userData)
                    // console.log('userData orderHistory======', userData);
                    if (userData.total_page <= currentPage) {
                        setIsLoadMore(false);
                    }
                    let newData = userData.result;
                    let updatedData = [...getOrderHistoryData, ...newData];

                    if (currentPage == 1) {
                        updatedData = newData
                        if (newData.length == 0) {
                            ToastError(Strings.Other.notRecord)
                            setIsLoadMore(false);
                            setIsLoding(false);
                        }
                    }
                    setOrderHistorydata(updatedData);
                    setImageUrl(userData?.image_path)
                    setIsLodeData(false)
                    setIsLoding(false);
                }
                else {
                    ToastError(userData?.message);
                    setIsLoding(false);
                    setIsLodeData(false)
                }
                setIsLoding(false);
                setIsDataFetched(true);
            }).catch(error => {
                console.log('getOrderHistory=====catch====', error);
                navigation.navigate('CatchError')
                AlertError(Strings.Other.catchError);
                setIsLoding(false)
                setIsDataFetched(true)
                setIsLodeData(false)
            });
        }
    };

    useEffect(() => {
        if (isFocused == true) {
            setPage(0);
            setIsLoding(true);
            setIsLoadMore(true);
            getOrderHistory(1, true);
        }
    }, [isFocused,])

    const listHeader = () => {

        const [searchData, setSearchData] = useState('');
        const [searchError, setSearchError] = useState('')

        const searchOrder = () => {
            if (searchData === '' || searchData == undefined) {
                // setSearchError('Please enter order ID.')
                // setIsLoding(true);
                // setIsLoadMore(true);
                getOrderHistory(1, true);
                setPage(0);
                setIsLodeData(true);
            } else {
                Keyboard.dismiss();
                setSearchError('')
                setPage(0);
                // setIsLoding(true);
                // setIsLoadMore(true);
                setIsLodeData(true);
                getOrderHistory(1, true, searchData);
            }
        }

        return (
            <View style={{}}>
                <View style={[styles.filterContainer, { marginTop: 10 }]}>
                    <TextInput
                        style={[styles.InputTextCon, { paddingVertical: 8, }]}
                        placeholder="Search in orders"
                        placeholderTextColor={Colors.Black}
                        onChangeText={(e) => { setSearchData(e), setSearchError('') }}
                        returnKeyType="search"
                        onSubmitEditing={() => searchOrder()}
                    />
                    <Button
                        style={styles.filterButton}
                        primaryButton
                        buttomIconStyle={{ tintColor: Colors.White }}
                        primaryIcon={searchIcon}
                        onPress={() => searchOrder()}
                    />
                </View>

                {searchError &&
                    < View style={[{ marginLeft: '3.6%', paddingVertical: Size.xs1 },]}>
                        <RegularLabel regularStyle={{ color: Colors.FerrariRed }} title={searchError} />
                    </View>
                }

                <View style={{ marginLeft: '3.4%', marginTop: 10 }}>
                    {orderHistoryData?.total_record === 0 ?
                        <Label text={'No record found'} />
                        : <Label text={`Results : ${orderHistoryData?.total_record ? orderHistoryData?.total_record : '0'}`} />
                    }

                </View>
            </View>
        )
    }

    const listFooter = () => {
        return (
            <View style={{ marginVertical: '3%' }}>
                {isLoadMore && orderHistoryData?.total_record > 1 &&
                    <Loader mainContainer={{ marginVertical: '3%' }} />
                }
                <Spacer style={{ marginTop: '18%' }} />
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ flex: 1 }}>
                <BackButtonHeader
                    containerStyle={[styles.headerContainer,]}
                    title={Strings.OrderHistory.orderHistory}
                />

                {isLoding == true ?
                    <Loader />
                    :
                    <View>
                        <FlatList
                            data={getOrderHistoryData}
                            scrollEnabled={true}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            automaticallyAdjustKeyboardInsets={true}
                            ListHeaderComponent={listHeader}
                            ListFooterComponent={listFooter}
                            onEndReached={getOrderHistory}
                            onEndReachedThreshold={0.5}
                            renderItem={({ item }) => {

                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        onPress={() => [navigation.navigate('TrackOrder', { 'params': { 'orderNumber': item.order_no, 'billEmail': item.bill_email } }), console.log('order_id=-=-=-', item.order_no, item.bill_email)]}
                                        key={item._id} style={[styles.deliveredContainer, {}]}
                                    >

                                        <View style={{ paddingHorizontal: '2%', width: '99%' }}>
                                            <View style={styles.delivered}>
                                                <Label style={[styles.deliveredTitle, { color: item?.order_status_val == 'Delivered' ? '#00B141' : Colors.Camel, }]} text={item.order_status_val} />
                                                <View style={styles.deliveryData}>
                                                    <Label style={styles.orderId} text={Strings.OrderHistory.orderID} />
                                                    <Label style={styles.orderIdData} text={item.order_no} />
                                                </View>
                                            </View>

                                            <RowColumn
                                                viewStyle={styles.historyRowContainer}
                                                titleStyle={{ marginLeft: 0, width: '50%', }}
                                                labelStyle={styles.recivedName}
                                                labelStyle1={styles.recivedData}
                                                title={item.order_tag}
                                                title1={item.reciver_by}
                                            />

                                            <View style={[styles.historyRowContainer, { flexDirection: 'row' }]}>
                                                <RowColumn
                                                    titleStyle={{ marginLeft: 0 }}
                                                    labelStyle={styles.recivedName}
                                                    labelStyle1={styles.recivedData}
                                                    title={`${dateFormat(item?.order_del_date, 'dddd, DD-MM-YYYY')}`}
                                                />
                                                <RowColumn
                                                    titleStyle={{ marginLeft: 0 }}
                                                    labelStyle={styles.recivedName}
                                                    labelStyle1={styles.recivedData}
                                                    title={Strings.OrderHistory.contactNo}
                                                    title1={item.ship_mobile}
                                                />
                                            </View>

                                            <RowColumn
                                                viewStyle={{ justifyContent: 'flex-end', }}
                                                titleStyle={{ marginLeft: 0 }}
                                                labelStyle={styles.recivedName}
                                                labelStyle1={styles.recivedData}
                                                title1={item.ship_add}
                                            />
                                        </View>

                                        <View style={styles.listContainer}>
                                            {item?.order_items?.map((item, index) => {
                                                return (
                                                    <View key={item?._id}>
                                                        <View style={styles.flowerBoxMainContainer}>
                                                            <ProgressiveImage
                                                                source={{ uri: imageUrl + item?.product_detail?.product_image }} style={styles.oderIcon}
                                                            />

                                                            <View style={styles.flowerBoxContainer}>
                                                                <Label style={styles.flowerBoxTitle} text={item?.product_detail?.product_name} numberOfLines={1} />

                                                                <View style={styles.rowColumn}>
                                                                    <Label style={styles.recivedName} text={Strings.OrderHistory.productId} />
                                                                    <Label style={styles.recivedData} text={item.product_detail?.product_unique_id} />
                                                                </View>

                                                                <View style={styles.rowColumn}>
                                                                    <Label style={styles.recivedName} text={Strings.OrderHistory.qty} />
                                                                    <Label style={styles.recivedData} text={item.product_quantity} />
                                                                </View>

                                                                {item?.vartype && <View style={styles.rowColumn}>
                                                                    <Label style={styles.recivedName} text={Strings.OrderHistory.options} />
                                                                    <Label style={styles.recivedData} text={item?.vartype} />
                                                                </View>}

                                                                {item?.vase_price > 0 && <View style={styles.rowColumn}>
                                                                    <Label style={styles.recivedName} text={"Upgrade to : "} />
                                                                    <Label style={styles.recivedData} text={'Include Glass Vase'} />
                                                                </View>}

                                                                {item?.eggless_price > 0 && <View style={styles.rowColumn}>
                                                                    <Label style={styles.recivedName} text={"Upgrade to : "} />
                                                                    <Label style={styles.recivedData} text={'Eggless'} />
                                                                </View>}

                                                                {item?.alphabet_name !== '' && <View style={styles.rowColumn}>
                                                                    <Label style={styles.recivedName} text={Strings.OrderHistory.selectedAlphabet} />
                                                                    <Label style={styles.recivedData} text={item?.alphabet_name} />
                                                                </View>}

                                                                {item?.personalised_image_name !== "" && <View style={styles.rowColumn}>
                                                                    <Label style={styles.recivedName} text={Strings.OrderHistory.personalisedImage} />
                                                                    <Image style={{ width: 30, height: 33, marginLeft: 3 }} source={{ uri: orderHistoryData?.cart_image_path + item?.personalised_image_name }} resizeMode="cover" />
                                                                </View>}

                                                            </View>
                                                        </View>
                                                        <Spacer style={[styles.boder, {}]} />
                                                    </View>
                                                )
                                            })}
                                        </View>

                                        {/* <RowColumn
                                            viewStyle={styles.amountContainer}
                                            title={Strings.OrderHistory.totalAmount}
                                            title1={`${item?.currency_code} ${item.pay_amount} ${"/"} ${"USD"} ${item.pay_amount_usd}`}
                                            labelStyle={styles.deliveryLabel}
                                            labelStyle1={[styles.deliveryLabel, { fontFamily: Typography.LatoBold }]}
                                        /> */}

                                        <RowColumn
                                            viewStyle={styles.amountContainer}
                                            title={Strings.OrderHistory.totalAmount}
                                            currencyIcon={`${item?.currency_code}`}
                                            title2={`${item.pay_amount} ${"/"} ${"USD"} ${item.pay_amount_usd}`}
                                            titleOne={`${item?.currency_code} ${item.pay_amount} ${"/"} ${"USD"} ${item.pay_amount_usd}`}
                                            labelStyleOne={{ fontFamily: Typography.LatoBold, }}
                                            ratingIconStyle1={{ width: 12, height: 12 }}
                                        />
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                }

                {isLodeData && <View style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <Loader
                        loadStyle={{ backgroundColor: Colors.Black }}
                    // size='small'
                    />
                </View>}
            </View>
        </SafeAreaView >
    )
};