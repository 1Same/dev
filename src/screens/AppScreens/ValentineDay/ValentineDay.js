import React, { useCallback, useEffect, useState, useRef } from "react";
import { Animated, Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Icon, ImagePath, Label, Spacer, Strings, Typography } from "../../../constants";
import { instance } from "../../../utils";
import { AlertError, Button, Loader, NewHeader, ProductList, ToastError } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import productListing from "../Listing/styles";
import { setCounrtyData } from "../../../features";

const ValentineDay = ({ navigation, route }) => {

    const dispatch = useDispatch();
    const { width } = Dimensions.get("screen");
    const [isLoading, setIsLoading] = useState({ isLoading: false, footerLoading: false });
    const [commonData, setCommonData] = useState({ sortPopup: false });
    const [shortVal, setShortVal] = useState('');
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [getLandingPageBlock, setGetLandingPageBlock] = useState([]);
    const [landingPageBlockAllData, setLandingPageBlockAllData] = useState();
    const [page, setPage] = useState(0);
    const countryData = useSelector((state) => state.country);
    const [isAnimating, setIsAnimating] = useState(false);
    const slideAnim = useRef(new Animated.Value(width)).current; // Start off-screen (Right)
    const backgroundAnim = useRef(new Animated.Value(0)).current;


    const openModal = useCallback(() => {
        if (isAnimating || commonData?.sortPopup) return;
        setIsAnimating(true);
        setCommonData({ ...commonData, sortPopup: true })

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0, // Move to screen (Right → Center)
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start(() => setIsAnimating(false));
    }, [isAnimating, commonData?.sortPopup]);

    const closeModal = useCallback(() => {
        if (isAnimating || !commonData?.sortPopup) return;
        setIsAnimating(true);

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: width, // Move off-screen (Center → Right)
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setCommonData({ ...commonData, sortPopup: false });
            setIsAnimating(false);
        });
    }, [isAnimating, commonData?.sortPopup]);

    useEffect(() => {
        setIsLoading({ ...isLoading, isLoading: true, footerLoading: false });
        getLandingPageBlockProducts(1);
    }, [countryData?.country?.currency_symbol, shortVal]);

    const sortAllData = [
        { value: 'Recommended', id: 5, sort: '', 'icon': ImagePath.Other.singleStar, },
        { value: 'Low to High', id: 6, sort: 'low_to_high', 'icon': ImagePath.Other.upArrow, 'color': Colors.Red },
        { value: 'High to Low', id: 7, sort: 'high_to_low', 'icon': ImagePath.Other.downArrow, 'color': Colors.Green },
    ];

    const getLandingPageBlockProducts = (pageNo = 0) => {
        let pageData = route.params?.menu_url;
        let currentPage = pageNo == 1 ? 1 : page + 1;
        setPage(currentPage);
        if (isLoadMore) {
            instance.post('/get_landing_page_block_products', {
                req: {
                    "data": {
                        "block_key": "row_three_image_one",
                        "page": currentPage,
                        "sort": shortVal,
                        "page_data": pageData
                    },
                }
            }).then(async (response) => {
                const userData = JSON.parse(response?.data);
                if (userData.status === 'success') {
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

    const listHeader = () => {
        return (
            <View style={{ alignItems: 'center', marginTop: 25, marginHorizontal: 18 }}>
                <Label style={styles.flowerHeading} text={'Every Detail Tells a Story'} />
                <Label style={styles.flowerDescription} text={'Love speaks through the subtle moments that matter most.'} />
                <TouchableOpacity
                    onPress={openModal}
                    hitSlop={productListing.hitSlop} activeOpacity={0.7}
                    style={[productListing.rowColumn, { alignSelf: 'flex-end' }]}
                >
                    <Icon style={{ width: 16.5, height: 16.5, transform: [{ rotateX: '180deg' }], marginRight: 2 }} source={ImagePath.Other.sort} />
                    <Label style={productListing.oderTitle} text={'Sort By:'} />
                </TouchableOpacity>
            </View>
        )
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

            <View style={styles.productMainView}>
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
                        ListHeaderComponent={listHeader}
                        renderItem={({ item }) => {
                            return (
                                <ProductList
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

            {commonData.sortPopup && (
                <Animated.View style={[styles.overlay, {
                    backgroundColor: backgroundAnim.interpolate({
                        inputRange: [0, 1], outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.1)"]
                    }),
                }]}>
                    <TouchableOpacity style={styles.overlay} onPress={closeModal} disabled={isAnimating} />
                    <Animated.View style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}>
                        {sortAllData?.map((item) => {
                            return (
                                <TouchableOpacity onPress={() => { setShortVal(item.sort), closeModal() }}
                                    style={productListing.shortContainer}
                                    key={item.id} hitSlop={productListing.hitSlop}
                                >
                                    <Icon style={{ height: 15, width: 15, tintColor: item.color }} source={item?.icon} />
                                    <Text style={{ color: Colors.Black, marginLeft: 3, fontFamily: Typography.LatoMedium }}>{item.value}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </Animated.View>
                </Animated.View>
            )}

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
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center"
    },
    overlayTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        right: 23, // Align to the right
        position: "absolute",
        backgroundColor: Colors.White,
        borderRadius: 5,
        paddingVertical:8,
        paddingHorizontal:30
    },
    activeDot: {
        width: 25,
        height: 11,
        backgroundColor: Colors.White,
        marginHorizontal: 4,
    },
    dotStyle: {
        width: 11,
        height: 11,
        backgroundColor: Colors.Cararra,
        marginHorizontal: 4,
    },
    fristSwiper: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
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
        fontFamily: Typography.LatoBold
    },
    flowerDescription: {
        color: Colors.Black,
        marginTop: 18,
        fontFamily: Typography.LatoMedium,
        textAlign: 'center',
        lineHeight: 25
    },
});