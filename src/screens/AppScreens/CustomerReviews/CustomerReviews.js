import React, { useState, useEffect } from "react";
import { View, Image, FlatList } from 'react-native'
import styles from "../../../components/ReviewRatingDetail/styles";
import { instance } from "../../../utils";
import { AlertError, BackButtonHeader, Loader, NewHeader, RowColumn } from "../../../components";
import { RegularLabel, ImagePath, Label, Colors, Strings, Size, Spacer } from "../../../constants";
import { dateFormat } from "../../../lib";

const CustomerReviews = ({ route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [allData, setAllData] = useState([]);
    const [page, setPage] = useState(0);

    const reviewListData = (pageNo = 0) => {
        let currentPage = page + 1;
        setPage(currentPage);

        if (isLoadMore) {
            instance.post('/review_list', {
                req: { "data": { page_url: "customer-review", page: currentPage, limit: 20 } }
            }).then(async (response) => {
                const userData = JSON.parse(response.data);

                if (userData.status === 'success') {
                    console.log('reviewListData======', userData?.total_page);
                    if (userData?.total_page <= currentPage) {
                        setIsLoadMore(false);
                    }
                    let newData = userData?.result;
                    let updatedData = currentPage != 1 ? [...allData, ...newData] : newData;
                    setAllData(updatedData);
                    setIsLoading(false);
                }
                else {
                    console.log("reviewListData else=====", userData.error);
                    setIsLoading(false);
                }
            }).catch(error => {
                console.log("reviewListData======catch======", error);
                AlertError(Strings.Other.catchError);
                setIsLoadMore(false);
                setIsLoading(false);
            });
        }
    };

    const renderStars = (rating) => {
        const starImages = [];
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            const starType =
                i <= rating
                    ? ImagePath.Other.singleStar
                    : i === Math.round(rating) && rating % 1 !== 0
                        ? ImagePath.Other.halfStar
                        : ImagePath.Other.emptyStar;

            starImages.push(
                <View key={i} style={{ marginHorizontal: 1 }}>
                    <Image source={starType} style={styles.starIcon} />
                </View>
            );
        }

        return starImages;
    };

    useEffect(() => {
        setIsLoading(true)
        reviewListData(1);
    }, []);

    const listingFooter = () => {
        return isLoadMore && <Loader mainContainer={{ marginVertical: '3%' }} />
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.White }}>
            <NewHeader />

            {isLoading ?
                <Loader />
                :
                <FlatList
                    data={allData}
                    onEndReached={reviewListData}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={listingFooter}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={item._id} style={{ marginBottom: 10 }}>
                                <View style={[styles.sliderContainer, { paddingVertical: 10 }]}>
                                    <Label style={styles.sliderTopTitle} text={item?.full_name} />
                                    <View style={{ marginTop: 7, }}>
                                        <RowColumn
                                            titleStyle={{ marginLeft: 0 }}
                                            labelStyle={styles.sliderBuyerName}
                                            labelStyle1={{ fontSize: 12 }}
                                            // title={Strings.Home.orderOn}
                                            title1={dateFormat(item?.created, 'DD MMM, yyyy')}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 8, }}>
                                        {renderStars(item.rating)}
                                    </View>
                                    <View style={{ marginTop: 8, marginBottom: index == 0 ? 0 : 8 }}>
                                        <RegularLabel
                                            regularStyle={{ fontSize: 13, }}
                                            title={item.review}
                                        />
                                    </View>
                                    {/* <RowColumn
                                        titleStyle={{ marginLeft: 0, }}
                                        labelStyle={styles.sliderBuyerName}
                                        labelStyle1={styles.sliderOderOn}
                                        title={Strings.Home.buyerName}
                                        title1={item.full_name}
                                    /> */}

                                </View>
                                <View style={{ backgroundColor: '#f6f6f6', height: 1, width: "100%" }} />
                            </View>
                        )
                    }}
                />}
        </View >
    )
}
export default CustomerReviews