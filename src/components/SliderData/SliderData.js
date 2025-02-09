import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setCounrtyData } from '../../features';
import { Colors, Icon, Label, Strings, Typography } from '../../constants';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

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
        <View style={{ flex: 1 }}>
            <FlatList
                numColumns={2}
                scrollEnabled={false}
                data={data}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ marginLeft: wp('0.4%') }}>
                            {isLoading ?
                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item
                                        height={hp(37)}
                                        width={styles.iconContainer.width}
                                        borderTopRightRadius={styles.itemContainer.borderTopRightRadius}
                                        borderBottomLeftRadius={styles.itemContainer.borderBottomLeftRadius}
                                        marginHorizontal={styles.itemContainer?.marginHorizontal}
                                        left={wp('0.4%')}
                                        marginTop={styles.itemContainer?.marginTop}
                                    />
                                </SkeletonPlaceholder>
                                :
                                <View key={index} style={styles.itemContainer} >
                                    <TouchableOpacity onPress={() => onPress ? onPress(item) : gotoScreen(item)} activeOpacity={0.7}>
                                        <View style={styles.iconContainer}>
                                            <Icon
                                                style={styles.icon}
                                                source={{ uri: imageUrl + item?.product_image }}
                                                resizeMode="contain"
                                            />
                                        </View>

                                        <View style={styles.flowersCon}>

                                            <Label style={styles.regularText}
                                                numberOfLines={numberOfLines}
                                                text={item?.product_name}
                                            />
                                            <Label style={styles.boldText} text={`${countryData?.country?.currency_symbol} ${item?.product_price ? item?.product_price : '0'}`} />

                                            <View style={styles.RowColumn}>
                                                <Label style={[styles.deliveryText, { fontSize: 13 }]} text={item?.rating_avg} />
                                                <Icon style={{ width: 14, height: 14, marginLeft: 3, tintColor: Colors.Pizazz }} source={ImagePath.Other.singleStar} />
                                                <Label style={[styles.deliveryText, { fontSize: 13, marginLeft: 12 }]} text={`(${item?.review_count})`} />
                                            </View>

                                            <View style={{ marginVertical: 6 }}>
                                                <Text style={styles.deliveryText}>{Strings.Home.earliestDelivery}<Text style={styles.deliveryFrequency}>{item?.delivery_frequency}</Text></Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    )
                }}
            />
        </View >
    );
};

export default SliderData;

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: Colors.White,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden',
        borderWidth: 0.8,
        borderColor: '#a3916163',
        marginHorizontal: wp('2.5%'),
        marginTop: hp(3)
    },
    iconContainer: {
        width: wp('44%'),
        height: wp('44%'),
        borderTopRightRadius: 11,
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    flowersCon: {
        marginVertical: 10,
        marginHorizontal: wp(2.2),
        width: width * 0.395
    },
    boldText: {
        fontSize: 13,
        color: Colors.MineShaft,
        fontFamily: Typography.RobotoMedium,
        marginVertical: 8
    },
    regularText: {
        fontSize: wp(3.5),
        color: Colors.DoveGrayNew,
        fontFamily: Typography.LatoMedium,
    },
    deliveryText: {
        fontSize: 12,
        color: Colors.MineShaft,
        fontFamily: Typography.RobotoRegular
    },
    deliveryFrequency: {
        fontSize: 12,
        color: Colors.Stiletto,
        fontFamily: Typography.LatoBold
    },
    RowColumn: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});