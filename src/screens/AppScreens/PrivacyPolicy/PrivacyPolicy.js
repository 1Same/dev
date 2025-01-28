import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, Image } from 'react-native';
import styles from "./styles";
import { Size, Strings, Label, ImagePath, Icon } from "../../../constants";
import { BackButtonHeader } from "../../../components";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Swiper from 'react-native-swiper';
import { WebView } from 'react-native-webview';
import { setting } from "../../../utils";
export default PrivacyPolicy = ({ route, navigation }) => {

    const [pageTitle, setPageTitle] = useState();
    const [isLoding, setLoding] = useState(false);
    const [webViewHeightNew, setWebViewHeightNew] = useState(50);
    const ratingFlawersData = [
        { id: 1, topTitle: Strings.Home.goodService, },
        { id: 2, topTitle: Strings.Home.goodService },
        { id: 3, topTitle: Strings.Home.goodService },
    ]

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <BackButtonHeader
                    title={pageTitle}
                    containerStyle={{ marginHorizontal: Size.xm1 }}
                />
                {isLoding ?
                    <Loader />
                    :
                    route.params?.requestPage &&
                    <WebView
                        originWhitelist={['*']}
                        source={{ uri: setting[setting.environment].cms_url + route.params?.requestPage }}
                        style={{ flex: 1, width: wp('100%'), height: webViewHeightNew, backgroundColor: "red", margin: 5 }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        automaticallyAdjustContentInsets={false}
                        injectedJavaScript='window.ReactNativeWebView.postMessage(document.body.scrollHeight)'
                        onMessage={(event) => {
                            console.log("Number(event.nativeEvent.data)==", Number(event.nativeEvent.data))
                            setWebViewHeightNew(Number(event.nativeEvent.data))
                        }}
                    />
                }
                <View style={[styles.slideMainContainer, {}]}>
                    <Spacer style={styles.spacerTop} />
                    <Label style={[styles.title, { fontSize: Size.m1 }]} text={Strings.Home.UAEFlowersReviews} />
                    <Spacer style={{ marginTop: Size.m1 }} />

                    <Swiper style={{ height: hp('21%') }}
                        showsPagination={false}
                        scrollEnabled={false}
                        showsButtons
                        nextButton={
                            <View style={styles.swiperButtonNext} hitSlop={styles.hitSlop}>
                                <Image style={styles.swiperIcon} source={ImagePath.Home.arrowNext} />
                            </View>
                        }
                        prevButton={
                            <View style={styles.swiperButtonBack} hitSlop={styles.hitSlop}>
                                <Image style={styles.swiperIcon} source={ImagePath.Home.arrowBack} />
                            </View>}
                    >

                        {ratingFlawersData.map((item) => {
                            return (
                                <View
                                    key={item.id}
                                    style={styles.sliderContainer}>
                                    <Label style={styles.sliderTopTitle} text={item.topTitle} />
                                    <View style={{ marginVertical: Size.xs2 }}>
                                        <Icon style={styles.sliderRatingIcon} source={ImagePath.Home.ratingStar} />
                                    </View>
                                    <Label style={{ fontSize: Size.m0, }} text={Strings.Home.boughtFlowers} />

                                    <Spacer />
                                    <RowColumn
                                        titleStyle={{ marginLeft: 0 }}
                                        labelStyle={styles.sliderBuyerName}
                                        labelStyle1={styles.sliderOderOn}
                                        title={Strings.Home.buyerName}
                                        title1='Terry Shirley'
                                    />
                                    <RowColumn
                                        titleStyle={{ marginLeft: 0 }}
                                        labelStyle={styles.sliderBuyerName}
                                        labelStyle1={styles.sliderOderOn}
                                        title={Strings.Home.orderOn}
                                        title1='12 Feb, 2023'
                                    />
                                </View>
                            );
                        })
                        }
                    </Swiper>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}