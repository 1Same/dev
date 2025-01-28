import React from "react";
import { View, SafeAreaView, FlatList, Image } from 'react-native';
import styles from "./styles";
import { Size, Colors, Strings, RegularLabel, BoldLabel, Icon, ImagePath, OpenSansBoldLabel, Label, } from "../../../constants";
import { BackButtonHeader, RowColumn } from "../../../components";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Swiper from 'react-native-swiper';

export default ContactUs = ({ navigation }) => {

    const ratingFlawersData = [
        { id: 1, topTitle: Strings.Home.goodService, },
        { id: 2, topTitle: Strings.Home.goodService },
        { id: 3, topTitle: Strings.Home.goodService },
    ]
    const data = [
        {
            id: "1",
            name: "Saudi Arabia"
        },
        {
            id: "2",
            name: "Qatar"
        },
        {
            id: "3",
            name: "Oman"
        },
        {
            id: "4",
            name: "Bahrain"
        },
        {
            id: "5",
            name: "India"
        },
        {
            id: "6",
            name: "Egypt"
        },
        {
            id: "7",
            name: "Turkey"
        },
        {
            id: "8",
            name: "Kuwait"
        },
        {
            id: "9",
            name: "Cyprus"
        },
        {
            id: "10",
            name: "Jordan"
        },
    ]

    const renderItem = ({ item }) => {
        return (
            <View style={styles.subContain}>
                <View style={styles.dotView} />
                <View style={{ width: wp('21%'), }} >
                    <RegularLabel title={item.name} regularStyle={[styles.regularStyle,]} />
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.mainContainer}>
            <BackButtonHeader
                title={Strings.Other.contactUs}
                containerStyle={{ marginHorizontal: Size.xm1 }}
            />
            <View style={{ height: hp('30%'), borderWidth: 1, paddingHorizontal: Size.xm, paddingTop: Size.xm, borderColor: Colors.Primary.Camel, borderRadius: 8, backgroundColor: Colors.Bianca, width: wp('93%'), marginHorizontal: Size.xm2 }}>
                <View style={{}}>
                    <BoldLabel title={Strings.Other.globalFlowers} boldStyle={{ fontSize: Size.xl, lineHeight: null }} />
                </View>
                <View style={{ marginTop: Size.xm }}>
                    <RegularLabel title={"United Arab Emirates"} regularStyle={{ color: Colors.MirageBlue }} />
                </View>
                <View style={{ marginTop: Size.xs1 }}>
                    <RegularLabel title={"Rose Chams DMCC"} regularStyle={{}} />
                </View>
                <View style={{ marginTop: Size.xs1 }}>
                    <RegularLabel title={"Dubai - United Arab Emirates"} regularStyle={{}} />
                </View>
                <View style={[styles.branchView, { marginTop: Size.xm2 }]}>
                    <View style={{}}>
                        <Icon source={ImagePath.Other.mailBox} style={styles.iconStyle} />
                    </View>
                    <RegularLabel title={"wecare@uaeflowers.com"} regularStyle={styles.labelStyle} />
                </View>
                <View style={[styles.branchView, { marginTop: Size.xm }]}>
                    <View style={{}}>
                        <Icon source={ImagePath.Other.mailBox} style={styles.iconStyle} />
                    </View>
                    <RegularLabel title={"aman@globalflora.com (Marketing)"} regularStyle={styles.labelStyle} />
                </View>
                <View style={[styles.branchView, { marginTop: Size.xm }]}>
                    <View style={{}}>
                        <Icon source={ImagePath.Other.telephoneIconGold} style={styles.iconStyle} />
                    </View>
                    <RegularLabel title={"+971 45095300"} regularStyle={styles.labelStyle} />
                </View>
            </View>
            <View style={{ marginTop: Size.xxl, marginHorizontal: Size.xm2, }}>
                <OpenSansBoldLabel title={Strings.Other.branches} openSansBoldStyle={{ lineHeight: null }} />
            </View>
            <View>
                <FlatList
                    data={data}
                    numColumns={4}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                />
            </View>
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
        </SafeAreaView >
    )
}
