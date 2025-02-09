import React, { useState, useEffect, useCallback, } from "react";
import { SafeAreaView, View, FlatList } from 'react-native';
import styles from "../Listing/styles";
import { ImagePath, Label, Spacer, Strings } from "../../../constants";
import { Loader, ToastError, AlertError, ToastSuccess, NewHeader, ProductList } from "../../../components";
import { instance } from "../../../utils";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";

const Wishlist = ({ navigation }) => {

    const [wishlistData, setWishlistData] = useState([]);
    const [imageUrl, setImageUrl] = useState();
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(true);
    const [page, setPage] = useState(0);
    const [wishListLoader, setWishListLoader] = useState(false);
    const countryData = useSelector((state) => state.country);
    const heartActiveIcon = require('../../../assets/Images/Other/heartActive.png');

    useFocusEffect(useCallback(() => {
        setPage(0);
        setIsLoadMore(true);
    }, []));

    useEffect(() => {
        getProdectData(1, true);
        setWishListLoader(true);
    }, [countryData?.country?.currency_symbol]);

    const getProdectData = (pageNo = 0, loadData = false) => {

        if ((isLoadMore && isDataFetched) || loadData) {
            let currentPage = pageNo == 1 ? 1 : page + 1;
            setPage(currentPage);

            setIsDataFetched(false);
            instance.post('/get_wishlist', {
                req: { "data": { "limit": 20, "page": currentPage } }
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
                    setWishListLoader(false);
                    setIsDataFetched(true);
                    setIsLoadMore(false);
                }
                setWishListLoader(false);
                setIsDataFetched(true);
            }).catch(error => {
                console.log('getProdectData=====catch====', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setWishListLoader(false);
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
                setWishListLoader(false);
            }
        }).catch(error => {
            console.log('removeProdect=======catch===', error);
            AlertError(Strings.Other.catchError);
            setWishListLoader(false);
        });
    };

    const listFooter = () => {
        return (
            isLoadMore == true ?
                <Loader mainContainer={{ marginVertical: '4%' }} />
                :
                <Spacer style={{ height: 30 }} />
        )
    }

    const getOffer = (item) => (
        item.tag_status == 1 ?
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
            : item?.product_price_detail?.hot_offers === 1 ?
                <Icon style={styles.offerIcon} source={ImagePath.Other.offer} />
                : null
    );

    return (
        <SafeAreaView style={styles.container}>
            <NewHeader
                exploreIcon
                wishListShow
            />

            {(wishlistData.length > 0 && imageUrl) ?
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
                            <ProductList
                                onClickProduct={() => navigation?.navigate('Detail', { "productSlug": item?.slug, "productId": item?._id })}
                                onClick={() => removeProdect(item?.slug)}
                                productImage={{ uri: imageUrl + item?.product_image }}
                                productImageStyle={item.product_name ? styles.flowerIcon : styles.bannerFlowerIcon}
                                productName={item?.product_name}
                                numberOfLines={1}
                                productPrice={`${countryData?.country.currency_symbol} ${item.product_price_detail?.new_price || '0'}`}
                                oldPrice={item?.product_price_detail?.hot_offers === 1 && `${countryData?.country.currency_symbol} ${item?.product_price_detail?.old_price ? item?.product_price_detail?.old_price : ''}`}
                                rating_avg={item?.rating_avg}
                                review_count={`(${item.review_count})`}
                                delivery_frequency={item?.delivery_frequency}
                                heartIcon={heartActiveIcon}
                                offerIcon={getOffer(item)}
                            />
                        )
                    }}
                /> :
                !wishListLoader && < View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Label text={Strings.Other.notRecord} />
                </View >}

            {wishListLoader &&
                <View style={styles.loadingMainContainer}>
                    <Loader />
                </View>
            }
        </SafeAreaView >
    )
};
export default Wishlist;