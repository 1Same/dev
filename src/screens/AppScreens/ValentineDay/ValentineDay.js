import React, { useCallback, useEffect, useState, useRef } from "react";
import { Animated, Dimensions, FlatList, ImageBackground, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Icon, ImagePath, Label, Spacer, Strings, Typography } from "../../../constants";
import { instance } from "../../../utils";
import { AlertError, AnimatedPopup, BottomSheet, Button, Loader, NewHeader, ProductList, ProgressiveImage, ToastError } from "../../../components";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from "react-redux";
import productListing from "../Listing/styles";
import { setCounrtyData } from "../../../features";
import Swiper from "react-native-swiper";
import { useFocusEffect } from "@react-navigation/native";

const ValentineDay = ({ navigation, route }) => {

    const dispatch = useDispatch();
    const countryData = useSelector((state) => state.country);
    const [isLoading, setIsLoading] = useState({ isLoading: false, footerLoading: false });
    const [sortPopup, setSortPopup] = useState(false);
    const [shortVal, setShortVal] = useState('');
    const [bannerTextValue, setBannerTextValue] = useState('');
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [getLandingPageBlock, setGetLandingPageBlock] = useState([]);
    const [getLandingPageBlockDetail, setGetLandingPageBlockDetail] = useState([]);
    const [landingPageBlockAllData, setLandingPageBlockAllData] = useState();
    const [page, setPage] = useState(0);

    useEffect(() => {
        getLandingData();
    }, []);

    useEffect(() => {
        setIsLoading({ ...isLoading, isLoading: true, footerLoading: false });
        getLandingPageBlockProducts(1,);
    }, [countryData?.country?.currency_symbol, shortVal,]);

    const getLandingData = async () => {
        let pageData = route.params?.menu_url;
        instance.post('/get_landing_page_details', {
            req: {
                "data": {
                    "page_data": pageData
                }
            }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData?.status === 'success') {
                setGetLandingPageBlockDetail(userData);
                setBannerTextValue(userData?.result?.page_blocks?.valentine_products[0])
                // console.log("getLandingData=====", userData);
            }
            else {
                console.log("getLandingData else=====", userData.error);
            }
        }).catch(error => {
            console.log("catch error ===somthing whent wrong--landing---", error);
        });
    };

    const getLandingPageBlockProducts = (pageNo = 0, bannerTextVal = '') => {
        bannerTextVal === '' ? '' : setBannerTextValue(bannerTextVal)

        let pageData = route.params?.menu_url;
        let currentPage = pageNo == 1 ? 1 : page + 1;
        setPage(currentPage);
        if (isLoadMore) {
            instance.post('/get_landing_page_block_products', {
                req: {
                    "data": {
                        "block_key": bannerTextVal?.key ? bannerTextVal?.key : bannerTextValue?.key ? bannerTextValue?.key : 'row_three_image_one',
                        "page": currentPage,
                        "sort": shortVal?.sort || "",
                        "page_data": pageData
                    },
                }
            }).then(async (response) => {
                const userData = JSON.parse(response?.data);
                if (userData.status === 'success') {
                    // console.log('getLandingPageBlockProducts==========', userData?.result);
                    if (userData?.result?.product_list?.length != 0) {
                        if (userData?.result?.product_result?.total_page <= currentPage) {
                            setIsLoadMore(false);
                        }
                        let newData = userData?.result?.product_list;
                        let updatedData = currentPage != 1 ? [...getLandingPageBlock, ...newData] : newData;
                        setGetLandingPageBlock(updatedData);
                        setLandingPageBlockAllData(userData);
                    } else {
                        ToastError(userData?.message);
                    }
                }
                setIsLoading({ ...isLoading, isLoading: false, footerLoading: false });
            }).catch(error => {
                console.log('getLandingPageBlockProducts=====catch=====', error);
                AlertError(Strings.Other.catchError);
                setIsLoadMore(false);
                setIsLoading({ ...isLoading, isLoading: false, footerLoading: false });
            });
        }
    };

    const listFooter = () => {
        return (
            isLoadMore ?
                <View style={{ alignItems: 'center', marginVertical: 40 }}>
                    <Label style={{ color: Colors.DoveGrayNew }} text={`Showing ${getLandingPageBlock?.length} out of ${landingPageBlockAllData?.result?.product_result?.total_record}`} />
                    <Button
                        onPress={() => {
                            setIsLoading({ ...isLoading, footerLoading: true });
                            getLandingPageBlockProducts()
                        }}
                        style={{ height: 47, borderRadius: 5, paddingHorizontal: 50 }}
                        labelStyle={{ fontSize: 16 }}
                        title={isLoading?.footerLoading ?
                            <Loader loadStyle={{ backgroundColor: null }} color={Colors.White} />
                            : Strings.Home.loadMore
                        }
                    />
                </View>
                :
                <Spacer style={{ height: 30 }} />
        )
    };

    const gotoScreen = async (data) => {
        setSortPopup(false);
        const item = data.menu_url
        if (item == '') {
            return '';
        }
        if (typeof data.slug != 'undefined') {
            navigation.navigate('Detail', { "productSlug": data.slug, "productId": data._id, });
            return true;
        }
        else if (item.page_type !== "static" && item.page_type !== "product") {
            if (item?.page_type == "landing") {
                let oldCountryData = countryData.country
                let newCountryData;
                if (item?.city_data?.country_data) {
                    newCountryData = {
                        "city_name": item?.city_data?.city_name ? item?.city_data?.city_name : '',
                        "city_id": item?.city_data?._id ? item?.city_data?._id : '',
                        "country_id": item?.city_data?.country_data?._id ? item?.city_data?.country_data?._id : '',
                        "country_image": item?.city_data?.country_data?.country_image ? item?.city_data?.country_data?.country_image : '',
                        "country_name": item?.city_data?.country_data?.country_name ? item?.city_data?.country_data?.country_name : '',
                        "country_iso_code": item?.city_data?.country_data?.country_iso_code ? item?.city_data?.country_data?.country_iso_code : '',
                        "isFromLandingPage": true,
                    }

                } else if (item?.country_data != {}) {
                    newCountryData = {
                        "city_name": '',
                        "city_id": '',
                        "country_id": item.country_data?._id ? item.country_data?._id : '',
                        "country_image": item.country_data?.country_image ? item.country_data?.country_image : '',
                        "country_name": item.country_data?.country_name ? item.country_data?.country_name : '',
                        "country_iso_code": item.country_data?.country_iso_code ? item.country_data?.country_iso_code : '',
                        "isFromLandingPage": true,
                    }
                }

                let currCountryData = { ...oldCountryData, ...newCountryData };
                await dispatch(setCounrtyData(currCountryData))
                return '';
            }
            navigation.navigate((item?.page_type == "landing" ? 'Landing' : 'BlankScreen'), { "menu_url": item, "goto": 'Listing' })
        }
        else if (item.page_type === "product") {
            (item.slug) ? navigation.navigate("Detail", { "productSlug": item.slug }) : navigation.navigate("Home", { "menu_url": item })
        }
        else if (item.page_type === "static") {
            navigation.navigate("Detail", { "menu_url": item })
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White, }}>
            <NewHeader
                title={'Home'}
                exploreIcon
            />

            <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <BottomSheet openSheet={'open'} />
                <View style={{ backgroundColor: Colors.White, paddingBottom: 35, alignItems: 'center', paddingTop: 35 }}>
                    {getLandingPageBlockDetail?.image_path &&
                        <ImageBackground
                            style={styles.backgroundImage}
                            source={{ uri: getLandingPageBlockDetail?.image_path + getLandingPageBlockDetail?.result?.page_blocks?.row_one_image_one.image }}
                        >
                            <Label style={[styles.flowerHeading, { color: Colors.White, fontSize: 15, lineHeight: 20 }]} text={getLandingPageBlockDetail?.result?.page_blocks?.row_one_image_one?.banner_text || ''} />
                        </ImageBackground>}

                    <View style={{ height: Platform.OS == 'ios' ? 267 : 245, marginVertical: 20, }}>
                        {getLandingPageBlockDetail?.result?.page_blocks?.valentine_bouqutes?.length > 0 &&
                            <Swiper
                                autoplay
                                autoplayTimeout={4}
                                activeDotStyle={styles.activeDot}
                                dotStyle={styles.dotStyle}
                                paginationStyle={{ bottom: -35, }}
                                removeClippedSubviews={false}
                            >
                                {getLandingPageBlockDetail?.result?.page_blocks?.valentine_bouqutes?.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => gotoScreen(item)} key={index} activeOpacity={0.8}>
                                            <ProgressiveImage
                                                style={styles.fristSwiper}
                                                source={item?.mobile_image && { uri: getLandingPageBlockDetail?.image_path + item?.mobile_image }}
                                                resizeMode='contain'
                                            />
                                        </TouchableOpacity>
                                    )
                                })}
                            </Swiper>}
                    </View>
                </View>

                <View style={styles.productMainView}>
                    <View style={{ marginHorizontal: 18, marginTop: 23 }}>
                        <Label style={styles.flowerHeading} text={getLandingPageBlockDetail?.result?.page_blocks?.row_three_title_one?.title || ''} />
                        <Label style={styles.flowerDescription} text={getLandingPageBlockDetail?.result?.page_blocks?.row_three_title_two?.title || ''} />

                        {getLandingPageBlockDetail?.result?.page_blocks?.valentine_products?.length > 0 &&
                            <FlatList style={{ marginTop: 20 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={getLandingPageBlockDetail?.result?.page_blocks?.valentine_products}
                                renderItem={({ item, index }) => (
                                    <Button
                                        onPress={() => {
                                            setIsLoading({ ...isLoading, isLoading: true, footerLoading: false });
                                            getLandingPageBlockProducts(1, item)
                                        }}
                                        style={[styles.productSliderView, {
                                            marginLeft: index === 0 ? 0 : 10,
                                            marginRight: getLandingPageBlockDetail?.result?.page_blocks?.valentine_products - 1 == index ? 10 : 0,
                                            backgroundColor: bannerTextValue?._id === item?._id ? Colors.Rosewood : Colors.White,
                                            borderColor: bannerTextValue?._id === item?._id ? 'transparent' : Colors.Black,
                                        }]}
                                        title={item?.banner_text}
                                        labelStyle={{ color: bannerTextValue?._id === item?._id ? Colors.White : Colors.Black, fontSize: 13, fontFamily: Typography.LatoMedium }}
                                    />
                                )}
                            />}
                        <TouchableOpacity
                            onPress={() => setSortPopup(true)}
                            hitSlop={productListing.hitSlop} activeOpacity={0.7}
                            style={[productListing.rowColumn, { alignSelf: 'flex-end', marginTop: 12, marginBottom: 12 }]}
                        >
                            <Icon style={{ width: 16.5, height: 16.5, transform: [{ rotateX: '180deg' }], marginRight: 2 }} source={ImagePath.Other.sort} />
                            <Label style={productListing.oderTitle} text={'Sort By:'} />
                        </TouchableOpacity>

                        <AnimatedPopup
                            visible={sortPopup}
                            onClose={() => setSortPopup(false)}
                            getValue={(values) => {
                                setShortVal(values)
                            }}
                        />
                    </View>
                    {(getLandingPageBlock?.length > 0 && !!landingPageBlockAllData) &&
                        < FlatList
                            data={getLandingPageBlock}
                            numColumns={2}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            automaticallyAdjustKeyboardInsets={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={listFooter}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                                return (
                                    <ProductList
                                        style={{ marginTop: index > 1 ? 35 : 0 }}
                                        onClickProduct={() => gotoScreen(item)}
                                        productImage={{ uri: landingPageBlockAllData?.result?.product_result?.image_path + item?.product_image }}
                                        productImageStyle={item.product_name ? productListing.flowerIcon : productListing.bannerFlowerIcon}
                                        productName={item?.product_name}
                                        numberOfLines={1}
                                        productPrice={`${countryData?.country.currency_symbol} ${item.product_price_detail?.new_price || '0'}`}
                                        rating_avg={item?.rating_avg}
                                        review_count={`(${item.review_count})`}
                                        delivery_frequency={item?.delivery_frequency}
                                    />
                                )
                            }}
                        />}
                </View>
            </ScrollView>

            {isLoading?.isLoading &&
                <View style={styles.loadingMainContainer}>
                    <Loader />
                </View>
            }
        </SafeAreaView>
    )
}
export default ValentineDay;

const styles = StyleSheet.create({
    activeDot: {
        width: 9,
        height: 9,
        backgroundColor: Colors.Black,
        borderRadius: 10,
        marginLeft: 15
    },
    dotStyle: {
        width: 9,
        height: 9,
        backgroundColor: Colors.BorderColor,
        borderRadius: 10,
        marginLeft: 15
    },
    fristSwiper: {
        width: wp('94%'),
        height: '100%',
        borderRadius: 20,
        marginLeft: wp('3%')
    },
    productMainView: {
        backgroundColor: Colors.WhiteLinen,
        flex: 1
    },
    loadingMainContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: "100%",
        width: "100%",
        position: "absolute",
    },
    flowerHeading: {
        fontSize: 19,
        color: Colors.MineShaft,
        fontFamily: Typography.LatoBold,
        textAlign: 'center'
    },
    flowerDescription: {
        color: Colors.Black,
        marginTop: 18,
        fontFamily: Typography.LatoMedium,
        textAlign: 'center',
        lineHeight: 25
    },
    productSliderView: {
        marginTop: 0,
        marginHorizontal: 0,
        height: null,
        borderRadius: 2.5,
        minWidth: wp('38%'),
        borderWidth: 1,
        padding: 7
    },
    backgroundImage: {
        width: wp('93%'),
        alignItems: 'center',
        paddingVertical: 13,
        borderRadius: 5,
        overflow: 'hidden',
        paddingHorizontal: 30
    },
});