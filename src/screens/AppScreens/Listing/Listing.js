import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Modal, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { AlertError, BottomSheet, Loader, NewHeader, ProductList, ReviewRating, ToastError, ToastSuccess } from "../../../components";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Colors, Icon, ImagePath, Label, Spacer, Typography } from "../../../constants";
import { isEmptyObj } from "../../../lib";
import { instance } from "../../../utils";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { setCounrtyData } from "../../../features";

const Listing = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [commonData, setCommonData] = useState({ sortData: false, openLocationPopup: false, wishListLoader: false });
    const [sortValue, setSortValue] = useState("");
    const [searchKey, setSearchKey] = useState('');
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(true);
    const [pageDataParam, setPageDataParam] = useState([]);
    const [productListingData, setProductListingData] = useState();
    const [addProductWishList, setAddProductWishList] = useState();
    const [productData, setProductData] = useState([]);
    const [wishListIds, setWishListIds] = useState([]);
    const [page, setPage] = useState(0);
    const [imageUrl, setImageUrl] = useState();
    const countryData = useSelector((state) => state.country);
    const authData = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const heartActiveIcon = require('../../../assets/Images/Other/heartActive.png');

    useFocusEffect(useCallback(() => {
        async function fatchData() {
            let location = await AsyncStorage.getItem('location');
            (location == null && countryData?.country?.country_name === 'India' && countryData?.country?.city_name === '') ? setCommonData({ ...commonData, openLocationPopup: true }) : setCommonData({ ...commonData, openLocationPopup: false });
        }
        fatchData();
    }, []));

    useEffect(() => {
        setPage(0);
        setIsLoading(true);
        setIsDataFetched(true);
        setSearchKey(route.params?.menu_url ? '' : route.params?.searchStr ? route.params?.searchStr : '')
        setPageDataParam(route.params?.menu_url ? route.params?.menu_url : {})
        getProdectData(1, false, '');
    }, [countryData?.country?.currency_symbol, route?.params]);

    // sort type array
    const sortAllData = [
        { value: 'Popularity', id: 5, sort: 'popularity', 'icon': ImagePath.Other.singleStar, },
        { value: 'Low to High', id: 6, sort: 'low_to_high', 'icon': ImagePath.Other.upArrow, 'color': Colors.Red },
        { value: 'High to Low', id: 7, sort: 'high_to_low', 'icon': ImagePath.Other.downArrow, 'color': Colors.Green },
    ];

    // sortButton action function
    const sortButton = (val) => {
        setIsLoading(true)
        setSortValue(val);
        getProdectData(1, true, val);
        setCommonData({ ...commonData, sortData: false });
    };

    // get_product_list api
    const getProdectData = (pageNo = 0, loadData = false, sortParam = '', onPagesearchStr = '') => {

        let searchStr = ''
        if (pageNo == 1) {
            searchStr = onPagesearchStr ? onPagesearchStr : route.params?.searchStr ? route.params?.searchStr : ''
            if (searchStr == '' && searchKey != '') {
                searchStr = searchKey;
            }
        }
        else {
            searchStr = searchKey
        }

        let sortVal = sortParam ? sortParam : sortValue;
        let pageData = route.params?.menu_url;

        if ((isLoadMore && isDataFetched) || loadData) {
            if (searchStr == '' && typeof pageData != "object") {
                if (!isEmptyObj(pageDataParam)) {
                    pageData = pageDataParam
                }
                else {
                    navigation.navigate('Home');
                    return;
                }
            }

            let currentPage = pageNo == 1 ? 1 : page + 1;
            setPage(currentPage);
            setIsDataFetched(false);
            instance.post('/get_product_list', {
                req: {
                    "data": {
                        "page": currentPage,
                        "limit": 40,
                        "sort": sortVal,
                        "search_keyword": searchStr,
                        "page_data": searchStr ? {} : pageData
                    },
                }

            }).then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {

                    setProductListingData(userData);
                    if (userData?.total_page <= currentPage) {
                        setIsLoadMore(false);
                    }

                    let newData = userData?.result;
                    let updatedData = currentPage != 1 ? [...productData, ...newData] : newData;
                    setImageUrl(userData);
                    setProductData(updatedData);
                    let wishlsitDataTemp = [];
                    newData?.map((e) => { if (e?.is_in_wishlist) { wishlsitDataTemp?.push(e?.slug) } })
                    let wishListMarge = currentPage != 1 ? [...wishListIds, ...wishlsitDataTemp] : wishlsitDataTemp;
                    setWishListIds(wishListMarge);
                }
                setIsLoading(false);
                setIsDataFetched(true);
                setCommonData({ ...commonData, openLocationPopup: false, sortData: false })
            }).catch(error => {
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setIsLoading(false);
                setIsLoadMore(false);
                setIsDataFetched(false);
            });
        }
    };

    // add_to_wishlist api
    const AddWishlistData = (slug) => {
        setCommonData({ ...commonData, wishListLoader: true });
        instance.post('/add_to_wishlist', {
            req: { "data": { "product_slug": slug } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData?.status === 'success') {
                let oldWishListIds = wishListIds;
                oldWishListIds?.push(slug);
                setWishListIds([...oldWishListIds]);
                ToastSuccess(userData?.message)
            }
            else {
                ToastError(userData?.message);
            }
            setCommonData({ ...commonData, wishListLoader: false });
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            setCommonData({ ...commonData, wishListLoader: false });
        });

    };

    // remove_from_wishlist api
    const removeProdect = (slug) => {
        setCommonData({ ...commonData, wishListLoader: true });
        instance.post('/remove_from_wishlist', {
            req: { "data": { "product_slug": slug } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);

            if (userData?.status === 'success') {
                let oldWishListIds = wishListIds
                let i = oldWishListIds.indexOf(slug);
                oldWishListIds?.splice(i, 1);
                setWishListIds([...oldWishListIds]);
                ToastSuccess(userData?.message);
            }
            else {
                ToastError(userData?.message);
            }
            setCommonData({ ...commonData, wishListLoader: false });
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            setCommonData({ ...commonData, wishListLoader: false });
        });
    };

    // product listingHeader component
    const listingHeader = () => {
        return (
            <>
                {productData?.length > 0 ?
                    <View>
                        {productListingData?.seo_content?.seo_title !== '' &&
                            <View style={styles.manView}>
                                <View style={{ width: '82%' }}>
                                    <Label style={styles.oderTitle} text={productListingData?.seo_content?.seo_title} />
                                </View>
                            </View>}
                        <Spacer style={{ marginTop: 10 }} />
                    </View>
                    :
                    !isLoading && <View style={{ height: hp('38%'), justifyContent: "center", alignItems: "center" }}>
                        <Label style={{}} text={"No Products Found."} />
                    </View>
                }
            </>
        )
    };

    // product listingFooter component
    const listingFooter = () => {
        return (
            (isLoadMore && !isLoading) ?
                <Loader mainContainer={{ marginVertical: '3%' }} />
                : !isLoading && <ReviewRating />
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
    }

    const clickHeartIcon = (item) => {
        setAddProductWishList(item._id)
        if (!authData?.data?.slug) {
            navigation.navigate('Login', { showmsg: 'yes' });
            return '';
        } else {
            wishListIds?.includes(item?.slug) ? removeProdect(item.slug) : AddWishlistData(item.slug);
        }
    };

    const getOffer = (item) => (
            item?.tag_status == 1 ?
                < Icon style={styles.offerFlowerIcon} source={
                    item?.tag_key == Strings.detail.freeShiping ?
                        ImagePath.Other.freeShiping
                        :
                        item?.tag_key == Strings.detail.freeCake ?
                            ImagePath.Other.freeCake
                            :
                            item?.tag_key == Strings.detail.freeChocolate ?
                                ImagePath.Other.freeChocolate
                                :
                                item?.tag_key == Strings.detail.freeGlassVase ?
                                    ImagePath.Other.freeGlassVase
                                    :
                                    item?.tag_key == Strings.detail.doubleTheFlowersFree ?
                                        ImagePath.Other.doubleTheFlowersFree
                                        :
                                        null}
                />
                : item?.product_price_detail?.hot_offers === 1 ? <Icon style={styles.offerIcon} source={ImagePath.Other.offer} /> : null
    )

    return (
        <SafeAreaView style={styles.container}>
            <NewHeader
                exploreIcon
            />

            <View style={{ flex: 1 }}>
                {/* product listing Flatlist */}
                <FlatList
                    data={productData}
                    numColumns={2}
                    onEndReached={getProdectData}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={listingHeader}
                    ListFooterComponent={listingFooter}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <ProductList
                                onClickProduct={() => gotoScreen(item)}
                                onClick={() => clickHeartIcon(item)}
                                productImage={{ uri: imageUrl?.image_path + item?.product_image }}
                                productImageStyle={item.product_name ? styles.flowerIcon : styles.bannerFlowerIcon}
                                productName={item?.product_name}
                                numberOfLines={1}
                                productPrice={`${countryData?.country.currency_symbol} ${item.product_price_detail?.new_price + ' /' || '0'}`}
                                oldPrice={`${countryData?.country.currency_symbol} ${item?.product_price_detail?.old_price ? item?.product_price_detail?.old_price : ''}`}
                                rating_avg={item?.rating_avg}
                                review_count={`(${item.review_count})`}
                                delivery_frequency={item?.delivery_frequency}
                                heartIcon={wishListIds?.includes(item?.slug) ? heartActiveIcon : ImagePath.Other.heartIcon}
                                loader={item._id == addProductWishList && commonData.wishListLoader}
                                offerIcon={getOffer(item)}
                            />
                        )
                    }}
                />
            </View>

            {/* sortData button */}
            {productData?.length > 0 &&
                <TouchableOpacity onPress={() => setCommonData({ ...commonData, sortData: true })}
                    activeOpacity={0.7} style={styles.filterContainer}>
                    <Icon style={styles.filterIcon} source={ImagePath.Other.filterBlack} />
                </TouchableOpacity>}

            {commonData.sortData ?
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={commonData.sortData}
                    onRequestClose={() => {
                        setCommonData({ ...commonData, sortData: false })
                    }}>
                    <TouchableWithoutFeedback onPress={() => setCommonData({ ...commonData, sortData: false })}>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 1, justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.9}>
                            <TouchableOpacity disabled={false} activeOpacity={10} style={styles.shortingPopup}>
                                {sortAllData?.map((item) => {
                                    return (
                                        <TouchableOpacity onPress={() => sortButton(item.sort)} style={styles.shortContainer} key={item.id} hitSlop={styles.hitSlop}>
                                            <Icon style={{ height: 18, width: 18, tintColor: item.color }} source={item?.icon} />
                                            <Label style={{ fontSize: 16, fontFamily: Typography.LatoMedium, marginLeft: 10 }} text={item.value} />
                                        </TouchableOpacity>
                                    )
                                })}
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal >
                : null}

            {!isLoading && <BottomSheet
                openSheet={commonData.openLocationPopup}
                isLoading={null}
            />}

            {isLoading &&
                <View style={styles.loadingMainContainer}>
                    <Loader />
                </View>
            }
        </SafeAreaView>
    )
}
export default Listing;