import React, { useState, useEffect, useCallback, } from "react";
import { SafeAreaView, View, FlatList, TouchableOpacity, Text } from 'react-native';
import styles from "../Listing/styles";
import { ImagePath, Label, Spacer, Size, Strings, RegularLabel, Typography, Colors } from "../../../constants";
import { RowColumn, Loader, ToastError, AlertError, ToastSuccess, NewHeader, ProgressiveImage } from "../../../components";
import { instance } from "../../../utils";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";

export default Wishlist = ({ navigation }) => {

    const [wishlistData, setWishlistData] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const [isLoding, setIsLoding] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(true);
    const [page, setPage] = useState(0);
    const [addProductWishList, setAddProductWishList] = useState();
    const [wishListLoader, setWishListLoader] = useState(false);
    const countryData = useSelector((state) => state.country);
    const heartActiveIcon = require('../../../assets/Images/Other/heartActive.png');

    useFocusEffect(useCallback(() => {
        // navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        setPage(0);
        setIsLoding(true);
        setIsLoadMore(true);
        getProdectData(1, true);
    }, []));

    useEffect(() => {
        getProdectData(1, true);
    }, [countryData?.country?.currency_symbol]);

    const getProdectData = (pageNo = 0, loadData = false) => {

        if ((isLoadMore && isDataFetched) || loadData) {
            let currentPage = pageNo == 1 ? 1 : page + 1
            setPage(currentPage);

            setIsDataFetched(false);
            instance.post('/get_wishlist', {
                req: { "data": { "limit": 10, "page": currentPage } }
            }).then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    if (userData.total_page <= currentPage) {
                        setIsLoadMore(false);
                    }

                    let newData = userData.result;
                    let updatedData = [...wishlistData, ...newData];

                    if (currentPage == 1) {
                        updatedData = newData
                        if (newData.length == 0) {
                            ToastError(Strings.Other.notRecord);
                        }
                    }
                    setWishlistData(updatedData);
                    setImageUrl(userData?.image_path);
                }
                else {
                    ToastError(userData?.message);
                    setIsLoding(false);
                    setIsDataFetched(true);
                    setIsLoadMore(false);
                }

                setIsLoding(false);
                setIsDataFetched(true);

            }).catch(error => {
                console.log('getProdectData=====catch====', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setIsLoding(false);
                setIsDataFetched(true);
                setIsLoadMore(false)
            });
        }
    };

    const removeProdect = (slug) => {
        setWishListLoader(true);
        instance.post('/remove_from_wishlist', {
            req: { "data": { "product_slug": slug } }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData.status === 'success') {
                setWishListLoader(false);
                setPage(0);
                getProdectData(1, true);
                ToastSuccess(userData?.message)

            }
            else {
                ToastError(userData?.message)
                setIsLoding(false);
                setWishListLoader(false);
            }

        }).catch(error => {
            console.log('removeProdect=======catch===', error);
            AlertError(Strings.Other.catchError);
            setIsLoding(false)
            setWishListLoader(false);
        });
    };

    const listFooter = () => {
        return (
            isLoadMore == true ?
                <Loader mainContainer={{ marginVertical: '4%' }} />
                :
                <Spacer />
        )
    }

    return (
        <SafeAreaView style={styles.container}>

            <NewHeader
                // title='Wishlist'
                exploreIcon
                wishListShow
            />

            {isLoding ?
                <Loader />
                :
                wishlistData.length > 0 ?
                    <FlatList
                        data={wishlistData}
                        numColumns={2}
                        scrollEnabled={true}
                        onEndReached={getProdectData}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={listFooter}
                        renderItem={({ item }) => {

                            return (
                                <View key={item?._id}>
                                    <TouchableOpacity onPress={() => navigation?.navigate('Detail', { "productSlug": item?.slug, "productId": item?._id })}
                                        style={{ marginTop: Size.xm2 }} activeOpacity={0.8}>

                                        <View style={styles.flowersContainer} >

                                            <ProgressiveImage
                                                style={styles.flowerIcon}
                                                source={{
                                                    uri: imageUrl + item?.product_image,
                                                }} resizeMode={'stretch'}
                                            />

                                            <View style={{ margin: 5 }}>

                                                <RegularLabel
                                                    regularStyle={styles.regularText}
                                                    title={item?.product_name}
                                                    numberOfLines={1}
                                                    ellipsizeMode={'tail'}
                                                />

                                                <View style={[styles.rowColumn, { marginTop: 2 }]}>
                                                    <Label style={[styles.boldText, { right: 7 }]} text={`${item?.product_price_detail.old_price ? " " : ""} ${countryData?.country.currency_symbol} ${item?.product_price_detail?.new_price ? item.product_price_detail?.new_price : ''}`} />

                                                    {item?.product_price_detail?.hot_offers === 1 &&
                                                        <View style={{}}>
                                                            <Label style={[styles.boldText, { color: Colors.SmokeyGrey, marginTop: Platform.OS == 'ios' ? 3 : 0 }]} text={`${countryData?.country.currency_symbol} ${item?.product_price_detail?.old_price ? item?.product_price_detail?.old_price : ' '}`} />
                                                            <View style={[styles.disCountBoder, { backgroundColor: item?.product_price_detail.old_price ? Colors.SmokeyGrey : Colors.White, borderColor: item?.product_price_detail.old_price ? Colors.SmokeyGrey : Colors.White }]} />
                                                        </View>
                                                    }
                                                </View>

                                                <View style={styles.productRatingCon}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Label style={[styles.deliveryLabel, { color: Colors.Concord }]} text={item?.rating_avg} />
                                                        <View style={{ marginLeft: 1 }}>
                                                            <Icon style={styles.ratingIcon} source={ImagePath.Other.singleStar} />
                                                        </View>

                                                        <Label style={[styles.deliveryLabel, { marginLeft: 3, color: Colors.Concord }]} text={`(${item.review_count})`} />
                                                    </View>

                                                    {item?.delivery_frequency ?
                                                        <View style={{ marginVertical: 5 }}>
                                                            <Text style={{ fontSize: 11, color: Colors.Black, fontFamily: Typography.LatoMedium }}>{`Earliest Delivery:`}<Text style={{ fontSize: 11, color: Colors.Red, fontFamily: Typography.LatoBold }}>{item?.delivery_frequency}</Text></Text>
                                                        </View>
                                                        : <View />
                                                    }
                                                    {/* {item?.delivery_frequency ?
                                                        <View style={styles.samedayDay}>
                                                            <RowColumn
                                                                titleStyle={{ marginLeft: 0, fontSize: 12 }}
                                                                title={item?.delivery_frequency == 'Today' ? Strings.Other.earliestDelivery : null}
                                                                labelStyle={styles.deliveryLabel}
                                                                labelStyle1={[styles.deliveryLabel, { fontFamily: Typography.LatoBold }]}
                                                                title1={item?.delivery_frequency == 'Today' ? '' : item.delivery_frequency == 'Tomorrow' ? item.delivery_frequency : null}
                                                            />
                                                        </View>
                                                        :
                                                        <View />} */}
                                                </View>
                                                {/* <Spacer style={styles.spacerBottom} /> */}
                                            </View>
                                        </View>

                                        <View style={styles.offerIconContainer} >
                                            {item.tag_status == 1 ?
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
                                                : item?.product_price_detail?.hot_offers === 1 ? <Icon style={styles.offerIcon} source={ImagePath.Other.offer} /> : null}

                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => { removeProdect(item?.slug), setAddProductWishList(item._id) }}
                                                    style={styles.heartIconCon} activeOpacity={0.7}>
                                                    {item._id == addProductWishList && wishListLoader == true ? <Loader loadStyle={styles.wishlistLoader} size={'small'} /> : < Icon style={styles.heartIcon} source={heartActiveIcon} />}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    /> :
                    < View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Label text={Strings.Other.notRecord} />
                    </View >
            }

        </SafeAreaView >
    )
}
