import React, { useState, useEffect, memo } from "react";
import { View, TouchableOpacity, Modal } from 'react-native'
import Swiper from "react-native-swiper";
import styles from "./styles";
import RowColumn from "../RowColumn/RowColumn";
import { RegularLabel, ImagePath, Label, Colors, Strings, Icon, Typography, MediumLabel, } from "../../constants";
import { instance } from "../../utils";
import { AlertError } from "../ToastNotification/ToastNotification";
import { dateFormat } from "../../lib";

const ReviewRating = (props) => {

    const [commonData, setCommonData] = useState({ openModal: false, reviewObg: {}, isTextTruncated: false });
    const [reviewData, setReviewData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { sliderManView, reviewStyles, reviews = '' } = props;

    const ReviewListData = () => {
        instance.post('/review_list', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setReviewData(userData?.result)
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
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

            starImages?.push(
                <View key={i} style={{ marginHorizontal: 1 }}>
                    <Icon source={starType} style={styles.starIcon} />
                </View>
            );
        }
        return starImages;
    };

    useEffect(() => {
        reviews == '' && ReviewListData();
    }, []);

    const handleTextLayout = (e, index) => {
        const { lines } = e.nativeEvent;
        if (lines.length > 3) {
            setReviewData((prevData) =>
                prevData.map((item, i) =>
                    i === index ? { ...item, isTextTruncated: true } : item
                )
            );
        }
    };

    return (
        <View style={{}}>

            {reviews ?
                <View style={{ flexDirection: "row", alignSelf: 'center', }}>
                    {renderStars(reviews)}
                </View>
                :
                <View style={{ paddingTop: 30, paddingBottom: 45 }}>
                    <View style={[{ backgroundColor: Colors.White, height: 255, }, sliderManView]}>
                        {reviewData?.length > 0 &&
                            <Swiper
                                showsPagination={false}
                                scrollEnabled={true}
                                showsButtons={true}
                                loop={false}
                                buttonWrapperStyle={styles.buttonWrapper}
                                onIndexChanged={(index) => setCurrentIndex(index)}
                                nextButton={
                                    <View style={{ marginRight: 5 }}>
                                        <Icon style={{ width: 32, height: 32, }} source={ImagePath.Other.arrowNext} />
                                    </View>
                                }
                                prevButton={
                                    <View style={{ marginLeft: 5 }}>
                                        <Icon style={{ width: 32, height: 32 }} source={ImagePath.Other.arrowBack} />
                                    </View>
                                }
                            >
                                {reviewData?.map((item, index) => {
                                    return (
                                        <View key={item._id} style={[styles.sliderContainer, reviewStyles]}>
                                            <Icon style={{ tintColor: Colors.Alto }} source={ImagePath.Home.quote_left} />
                                            <View style={{ flexDirection: "row", alignSelf: 'center', }}>
                                                {renderStars(item?.rating)}
                                            </View>

                                            <View style={{ marginTop: 10, height: 100 }}>
                                                <RegularLabel
                                                    numberOfLines={3}
                                                    onTextLayout={(e) => handleTextLayout(e, index)}
                                                    regularStyle={{ fontSize: 13, textAlign: 'center', fontFamily: Typography.LatoMedium }}
                                                    title={item.review}
                                                />
                                                {item.isTextTruncated &&
                                                    <TouchableOpacity onPress={() =>
                                                        setCommonData({ ...commonData, openModal: true, reviewObg: item, })}
                                                        style={styles.dottedUnderlineContainer} activeOpacity={0.7}
                                                    >
                                                        <Label style={styles.readMoreText} text={Strings.Other.readMore} />
                                                        <View style={styles.dottedUnderline} />
                                                    </TouchableOpacity>}
                                            </View>
                                            <Icon style={{ tintColor: Colors.Alto, transform: [{ rotate: '180deg' }], alignSelf: 'flex-end', right: 14 }} source={ImagePath.Home.quote_left} />
                                            <Spacer style={{ height: 25 }} />
                                            <RowColumn
                                                viewStyle={{ alignSelf: 'center' }}
                                                titleStyle={{ marginLeft: 0, }}
                                                labelStyle={styles.sliderBuyerName}
                                                labelStyle1={styles.sliderOderOn}
                                                title={Strings.Home.buyerName}
                                                title1={item.full_name}
                                            />
                                        </View>
                                    );
                                })
                                }
                            </Swiper>
                        }
                    </View>

                    {currentIndex === 0 && <View style={styles.crouselButtonRight} >
                        <Icon style={{ width: 32, height: 32, }} source={ImagePath.Other.arrowBack} />
                    </View>}
                    {reviewData?.length - 1 === currentIndex &&
                        <View style={styles.crouselButtonLeft} >
                            <Icon style={{ width: 32, height: 32, }} source={ImagePath.Other.arrowNext} />
                        </View>}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={commonData.openModal}
                        onRequestClose={() => {
                            setCommonData({ ...commonData, openModal: false })
                        }}>
                        <View style={styles.reviewContainer} >
                            <TouchableOpacity
                                onPress={() => setCommonData({ ...commonData, openModal: false })}
                                activeOpacity={0.7}
                                style={styles.closeIconView}
                            >
                                <Icon style={{}} source={ImagePath.Other.close} />
                            </TouchableOpacity>

                            <View style={styles.reviewDescriptionView}>
                                <View style={{ flexDirection: "row", alignSelf: 'center', marginBottom: 4 }}>
                                    {renderStars(commonData?.reviewObg?.rating)}
                                </View>
                                <MediumLabel
                                    mediumStyle={{ fontSize: 13.5, }}
                                    title={commonData?.reviewObg?.review}
                                />

                                <MediumLabel
                                    mediumStyle={{ fontSize: 13.5, marginTop: 3, textAlign: 'right' }}
                                    title={`-${commonData?.reviewObg?.full_name}`}
                                />
                                <MediumLabel
                                    mediumStyle={{ fontSize: 13.5, marginTop: 3, textAlign: 'right' }}
                                    title={dateFormat(commonData?.reviewObg?.created, 'DD MMM, YYYY')}
                                />
                            </View>
                        </View>
                    </Modal>
                </View >}
        </View>
    )
};
export default memo(ReviewRating);