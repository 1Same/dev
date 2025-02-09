import React, { useState, useEffect, memo } from "react";
import { View, Image, FlatList, TouchableOpacity } from 'react-native'
import { RegularLabel, ImagePath, Label, RobotoBoldLabel, Colors, Strings, Typography, } from "../../constants";
import { instance } from "../../utils";
import { useNavigation } from "@react-navigation/native";
import { AlertError } from "../ToastNotification/ToastNotification";
import styles from "./styles";
import Loader from "../Loader/loader";

const ReviewRatingDetail = (props) => {

    const [reviewData, setReviewData] = useState([]);
    const [loadeMore, setLoadeMore] = useState(false);
    const [allData, setAllData] = useState([]);
    const { productId = '' } = props;
    const navigation = useNavigation();

    const reviewListData = (type) => {
        setLoadeMore(prevS => ({ ...prevS, 'isLoading': type == true ? true : false }))

        instance.post('/review_list', {
            req: { "data": { product_id: productId, page_url: "customer-review", page: 1, limit: 10 } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);

            if (userData.status === 'success') {
                let oldDataOne = userData?.result[0]
                let oldDataTwo = userData?.result[1]
                userData?.result?.length > 2 ? setReviewData(type == true ? userData?.result : [oldDataOne, oldDataTwo]) : setReviewData(userData?.result);
                setAllData(userData?.result)
                setLoadeMore(prevS => ({ ...prevS, 'isLoading': false, }));
            }
            else {
                setLoadeMore(prevS => ({ ...prevS, 'isLoading': false }));
            }
        }).catch(error => {
            console.log("reviewListData======catch======", error);
            AlertError(Strings.Other.catchError);
            setLoadeMore(prevS => ({ ...prevS, 'isLoading': false }))
        });
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
        reviewListData();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.White }}>
            <View style={{ marginLeft: 20, marginTop: 10 }}>
                {allData?.length > 0 && <RobotoBoldLabel robotoBoldStyle={[styles.title, { fontSize: 15 }]} title={Strings.Home.reviews} />}
            </View>
            {reviewData?.length > 0 && (
                <View>
                    <FlatList
                        style={{ marginHorizontal: 2 }}
                        data={reviewData}
                        renderItem={({ item, index }) => {
                            return (
                                <View key={item._id} style={{ marginBottom: 10 }}>
                                    <View style={[styles.sliderContainer, { paddingVertical: index == 0 ? 15 : 0 }]}>
                                        <Label style={styles.sliderTopTitle} text={item?.full_name} />

                                        <View style={{ flexDirection: "row", marginTop: 8, }}>
                                            {renderStars(item.rating)}
                                        </View>
                                        <View style={{ height: 48, marginTop: 8, marginBottom: index == 0 ? 0 : 8 }}>
                                            <RegularLabel
                                                regularStyle={{ fontSize: 13, }}
                                                title={item.review}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: '#f6f6f6', height: 1, width: "100%" }} />
                                </View>
                            )
                        }}
                    />
                    < TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigation.navigate('CustomerReviews', { productId: productId })} activeOpacity={0.7}>
                        {loadeMore?.isLoading == true ? <Loader loadStyle={styles.loader} size={'small'} /> :
                            <Label style={{ fontSize: 15, color: Colors.WaterBlue, textAlign: 'center', fontFamily: Typography.poppinsSemiBold }} text={'View More'} />}
                    </TouchableOpacity>
                </View>
            )}
        </View >
    )
}
export default memo(ReviewRatingDetail)