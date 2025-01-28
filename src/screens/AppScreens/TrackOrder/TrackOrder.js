import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView, FlatList, Image, Text } from 'react-native';
import styles from "./styles";
import { AlertError, BackButtonHeader, Button, Loader, NewHeader, ProgressiveImage } from "../../../components";
import { Size, Strings, Colors, RobotoMediumLabel, MediumLabel, BoldLabel, RegularLabel, RobotoRegularLabel, RobotoBoldLabel, OpenSansBoldLabel, OpenSansRegularLabel, Icon, ImagePath } from "../../../constants";
import { instance } from "../../../utils";
import axios from "axios";
import base64 from 'react-native-base64';
import { dateFormat } from "../../../lib";


export default TrackOrder = ({ navigation, route }) => {

    const orderNumber = route.params?.params?.orderNumber;
    const billEmail = route.params?.params?.billEmail;

    const ListData = [
        {
            id: 1,
            title: "Order Number:"
        },
        {
            id: 2,
            title: "Order Amount:"
        },
        {
            id: 3,
            title: "Order Date:"
        },
        {
            id: 4,
            title: "Delivery Date:"
        },
        {
            id: 5,
            title: "Payment Status:"
        },
        {
            id: 6,
            title: "Order Status:"
        }
    ]

    // console.log("route.params?.params?.orderNumber=-=-=-", route.params?.params?.orderNumber);
    // console.log("route.params?.params?.billEmail=-=-=-", route.params?.params?.billEmail);
    // console.log("orderNumber=-=-=-", orderNumber);
    // console.log("billEmail=-=-=-", billEmail);

    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState();

    // axios.interceptors.request.use(request => {
    //     console.log('=-=-=-=-=-Starting Request-=-=-=-', request);
    //     return request;
    // }, error => {
    //     return Promise.reject(error);
    // });

    // const userData = {
    //     "data": {
    //         "order_id": "BF1718226743",
    //         "email": "henricbelly@mailinator.com",
    //         "domain": "www.bloomsflora.com",
    //         "country_id": "65f93c84cbcd271b36316d77",
    //         "requested_method_name": "track_order",
    //         "url": "www.bloomsflora.com/track-order"
    //     }
    // };

    // const userData = {
    //     'order_id': 'BF1718226743',
    //     'email': 'henricbelly@mailinator.com'
    // };

    // axios.post("https://apis.dev.bloomsflora.com/track_order", userData).then((response) => {
    //     console.log(response.status, response.data);
    // });


    // const url = 'https://apis.dev.bloomsflora.com/track_order'
    // const data = {
    //     "data": {
    //         order_id: "BF1718234494",
    //         // "order_id": "BF1718226743",
    //         email: "henricjanuary@mailinator.com",
    //         // "email": "henricbelly@mailinator.com",
    //         domain: "www.bloomsflora.com",
    //         country_id: "65f93c84cbcd271b36316d77",
    //         requested_method_name: "track_order",
    //         url: "www.bloomsflora.com/track-order"
    //     },
    //     // "api_type": "web",
    //     // "device_id": "",
    //     // "device_token": "",
    //     // "device_type": ""
    // }
    // let postData = base64.encode(JSON.stringify(data));
    // console.log("postData only aixos=-=-=-=-=-", postData);
    // axios.interceptors.request.use(config => {
    //     console.log('Request was sent', config);

    //     return config;
    // });
    // axios
    //     .post(url, { data: postData }, {
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json;charset=UTF-8",
    //         },
    //     })
    //     .then(({ data }) => {
    //         console.log("data=-=-=-=-=-=-", data);
    //     });


    const trackOrder = async () => {
        setIsLoading(true)

        instance.post('/track_order', {
            req: {
                "data": {
                    "email": billEmail,
                    "order_id": orderNumber,
                },
            }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            // console.log('userData track_order before===', userData);
            if (userData.status === 'success') {
                // console.log('userData track_order===', userData);
                setUserData(userData);
                setIsLoading(false);
            }
            else {
                setIsLoading(false);
            }

        }).catch(error => {
            console.log('trackOrder=====catch=====', error);
            navigation.navigate('CatchError');
            AlertError(Strings.Other.catchError);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        trackOrder();
    }, []);


    return (
        <SafeAreaView style={styles.mainContainer}>

            <NewHeader
                exploreIcon
            />
            <View style={{ alignSelf: "center", marginTop: 15 }}>
                <BoldLabel title={'Order Details'} boldStyle={{ fontSize: 18 }} />
            </View>
            {isLoading ?
                <Loader />
                :
                <View>
                    <View style={{ marginTop: 15, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginHorizontal: 12 }} >
                        <BoldLabel title={`Order Number : `} boldStyle={{ fontSize: 14 }} />
                        <View style={{ marginLeft: 5, }}>
                            <RegularLabel title={userData?.result?.order_no} regularStyle={{ fontSize: 14, lineHeight: null }} />
                        </View>
                    </View>
                    <View style={{ marginTop: 15, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginHorizontal: 12 }} >
                        <BoldLabel title={`Order Amount : `} boldStyle={{ fontSize: 14 }} />
                        <View style={{ marginLeft: 5 }}>
                            <RegularLabel title={`${userData?.result?.pay_amount} / ${userData?.result?.payment_currency_code} ${userData?.result?.pay_amount_usd} `} regularStyle={{ fontSize: 14, lineHeight: null }} />
                        </View>
                    </View>
                    <View style={{ marginTop: 15, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginHorizontal: 12 }} >
                        <BoldLabel title={`Order Date : `} boldStyle={{ fontSize: 14 }} />
                        <View style={{ marginLeft: 5 }}>
                            <RegularLabel title={`${dateFormat(userData?.result?.order_placed_date, 'D MMM, YYYY')}`} regularStyle={{ fontSize: 14, lineHeight: null }} />
                        </View>
                    </View>
                    <View style={{ marginTop: 15, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginHorizontal: 12 }} >
                        <BoldLabel title={`Delivery Date : `} boldStyle={{ fontSize: 14 }} />
                        <View style={{ marginLeft: 5 }}>
                            <RegularLabel title={`${dateFormat(userData?.result?.order_del_date, 'D MMM, YYYY')}`} regularStyle={{ fontSize: 14, lineHeight: null }} />
                        </View>
                    </View>
                    <View style={{ marginTop: 15, flexDirection: "row", alignItems: "center", paddingVertical: 10, marginHorizontal: 12 }} >
                        <BoldLabel title={`Payment Status : `} boldStyle={{ fontSize: 14 }} />
                        <View style={{ marginLeft: 5 }}>
                            <RegularLabel title={userData?.result?.payment_status} regularStyle={{ fontSize: 14, color: Colors.FerrariRed, lineHeight: null }} />
                        </View>
                    </View>
                    <View style={{ marginTop: 15, flexDirection: "row", paddingVertical: 10, marginHorizontal: 12 }} >
                        <BoldLabel title={`Order Status : `} boldStyle={{ fontSize: 14 }} />
                        <View style={{ marginLeft: 5 }}>
                            <RegularLabel title={userData?.result?.order_status_val} regularStyle={{ fontSize: 14, color: Colors.FerrariRed, lineHeight: null }} />
                            <RegularLabel
                                title={userData?.result?.order_tag}
                                regularStyle={{ fontSize: 14, width: "90%", }}
                            />
                        </View>
                    </View>
                    <Button
                        primaryButton
                        title={"Track New Order"}
                        onPress={() => navigation.navigate('OrderHistory')}
                        style={{ marginTop: 15, marginHorizontal: 25 }}
                    />
                </View>
            }

        </SafeAreaView >
    )
};
