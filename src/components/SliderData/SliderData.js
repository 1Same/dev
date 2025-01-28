import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setCounrtyData } from '../../features';
import { Colors, Icon, Label, Strings } from '../../constants';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

const SliderData = ({
    data,
    onPress,
    numberOfLines,
    imageUrl,
    isLoading = false
}) => {

    const navigation = useNavigation()
    const countryData = useSelector((state) => state.country);
    const dispatch = useDispatch();
    const ITEM_WIDTH = width / 2 - 20; // Adjust width for 2 columns
    const ITEM_HEIGHT = 320; // Height of each item

    // Group data into rows (each row contains 2 items)
    const groupedData = [];
    for (let i = 0; i < data.length; i += 2) {
        groupedData.push(data.slice(i, i + 2));
    }

    const gotoScreen = async (data) => {
        const item = data.menu_url
        if (typeof data?.slug != 'undefined') {
            navigation.navigate('Detail', { "productSlug": data?.slug, "productId": data?._id, });
            return true;
        }
        else if (item?.page_type !== "static" && item?.page_type !== "product") {
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
                    }

                } else if (item?.country_data != {}) {
                    newCountryData = {
                        "city_name": '',
                        "city_id": '',
                        "country_id": item.country_data?._id ? item.country_data?._id : '',
                        "country_image": item.country_data?.country_image ? item.country_data?.country_image : '',
                        "country_name": item.country_data?.country_name ? item.country_data?.country_name : '',
                        "country_iso_code": item.country_data?.country_iso_code ? item.country_data?.country_iso_code : '',
                    }
                }

                let currCountryData = { ...oldCountryData, ...newCountryData };
                await dispatch(setCounrtyData(currCountryData))
                return '';
            }

            navigation.navigate((item?.page_type == "landing" ? 'Landing' : 'BlankScreen'), { "menu_url": item, "goto": 'Listing' })
        }
        else if (item?.page_type === "product") {
            (item?.slug) ? navigation.navigate("Detail", { "productSlug": item?.slug }) : navigation.navigate("Home", { "menu_url": item })
        }
        else if (item?.page_type === "static") {
            navigation.navigate("Detail", { "menu_url": item })
        }
    }

    return (
        <View style={{ height: 645 }}>
            <Carousel
                scrollEnabled={false}
                vertical={true} // Enable vertical scrolling
                data={groupedData} // Use grouped data for rows
                renderItem={({ item }) => (
                    <View style={styles.rowContainer}>
                        {item?.map((subItem, index) => (
                            <View key={index}>
                                {isLoading ?
                                    <SkeletonPlaceholder>
                                        <SkeletonPlaceholder.Item
                                            height={280}
                                            width={ITEM_WIDTH}
                                            borderTopRightRadius={11}
                                            borderBottomLeftRadius={11}
                                        />
                                    </SkeletonPlaceholder>
                                    :
                                    <View key={index} style={[styles.itemContainer, { width: ITEM_WIDTH }]} >
                                        <TouchableOpacity onPress={() => onPress ? onPress(subItem) : gotoScreen(subItem)} activeOpacity={0.7}>
                                            {/* <ProgressiveImage
                                                 style={[styles.icon, iconStyle]}
                                                 source={icon}
                                                 resizeMode="contain"
                                             /> */}
                                            <Icon
                                                style={styles.icon}
                                                source={subItem?.icon ? subItem?.icon : { uri: imageUrl + subItem?.product_image }}
                                            />

                                            <View style={styles.flowersCon}>
                                                <Label style={styles.regularText}
                                                    numberOfLines={numberOfLines}
                                                    text={subItem?.product_name}
                                                />
                                                <Label style={styles.boldText} text={`${countryData?.country?.currency_symbol} ${subItem?.product_price ? subItem?.product_price : '0'}`} />

                                                <View style={styles.RowColumn}>
                                                    <Label style={[styles.deliveryText, { fontSize: 14 }]} text={subItem?.rating_avg} />
                                                    <Icon style={{ width: 17, height: 17, marginLeft: 5 }} source={ImagePath.Other.singleStar} />
                                                    <Label style={[styles.deliveryText, { fontSize: 14, marginLeft: 12 }]} text={`(${subItem.review_count})`} />
                                                </View>

                                                <View style={{ marginTop: 8 }}>
                                                    <Text style={styles.deliveryText}>{Strings.Home.earliestDelivery}<Text style={styles.deliveryFrequency}>{subItem?.delivery_frequency}</Text></Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                    </View>}
                            </View>
                        ))}
                    </View>
                )}
                sliderHeight={height} // Visible height of the carousel
                itemHeight={ITEM_HEIGHT} // Adjust height for rows
                activeSlideAlignment="start"
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                contentContainerCustomStyle={styles.carouselContainer}
            />
        </View>
    );
};

export default SliderData;

const styles = StyleSheet.create({
    carouselContainer: {
        paddingHorizontal: 12, // Add padding for alignment
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16, // Space between rows,
    },
    itemContainer: {
        backgroundColor: Colors.White,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden',
        borderWidth: 0.8,
        borderColor: Colors.Camel
    },
    listHorizontalCon: {
        flex: 1,
    },
    mainContainer: {
        backgroundColor: null,
        width: null,
        borderWidth: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        marginLeft: 0
    },
    icon: {
        width: wp('47%'),
        height: wp('42%'),
        borderTopRightRadius: 11,
        borderBottomLeftRadius: 11,
    },
    flowersCon: {
        marginVertical: 15,
        marginHorizontal: 10,
    },
    mainContainerBoder: {
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12
    },
    boldText: {
        fontSize: 13,
        color: Colors.Black,
        fontFamily: Typography.RobotoBold,
        marginVertical: 8
    },
    regularText: {
        fontSize: 15,
        color: '#6D6A6A',
        fontFamily: Typography.LatoBold
    },
    deliveryText: {
        fontSize: 12,
        color: Colors.Black,
        fontFamily: Typography.LatoMedium
    },
    deliveryFrequency: {
        fontSize: 12,
        color: Colors.Red,
        fontFamily: Typography.LatoBold
    },
    RowColumn: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});