import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { AlertError, Baner, BottomSheet, Button, Categories, Loader, NewHeader, ProgressiveImage, ReviewRating, SliderData, ToastError } from "../../../components";
import styles from "./styles";
import { BoldLabel, Colors, Icon, ImagePath, Label, Strings, Typography } from "../../../constants";
import { instance, setting } from "../../../utils";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Swiper from "react-native-swiper";
import Video from 'react-native-video';
import { useDispatch, useSelector } from "react-redux";
import { setCounrtyData } from "../../../features";
import { useFocusEffect } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';

const Home = ({ navigation, route }) => {

    const countryData = useSelector((state) => state.country);
    const dispatch = useDispatch();
    const { width } = Dimensions.get('window');
    const [isLoading, setIsLoading] = useState({ isLoadMore: false, isLoading: false });
    const [getPageBlocks, setPageBlocks] = useState([]);
    const [pageBlocksData, setPageBlocksData] = useState('');
    const [shop_by_occasion, set_shop_by_occasion] = useState({});
    const [shop_by_design, set_shop_by_design] = useState({});
    const [shop_by_gifts, set_shop_by_gifts] = useState({});
    const [filterLoading, setFilterLoading] = useState({ shop_by_occasion: false, shop_by_design: false, shop_by_gifts: false });
    const [bottomCarouselIndex, setBottomCarouselIndex] = useState(1);

    useEffect(() => {
        setIsLoading({ ...isLoading, isLoadMore: true })
        getHomePageBlocks();
    }, [countryData?.country?.currency_symbol]);

    const getHomeData = async () => {
        instance.post('/get_home_page_details', {
            req: {
                "data": {}
            }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData.status === 'success') {
                setPageBlocks(userData);
            } else {
                ToastError(userData?.message)
            }
        }).catch(error => {
            navigation.navigate('CatchError');
            AlertError(Strings.Other.catchError);
        });
    };

    const getHomePageBlocks = async (val) => {
        setIsLoading({ ...isLoading, isLoading: true });
        instance.post('/get_home_page_blocks', {
            req: {
                "data": {}
            }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setPageBlocksData(userData?.result);
                const shop_by_design = userData?.result?.shop_by_design ?? []
                const shop_by_occasion = userData?.result?.shop_by_occasion ?? []
                const shop_by_gifts = userData?.result?.shop_by_gifts ?? []
                if (shop_by_design.length > 0) {
                    set_shop_by_design(shop_by_design[0]);
                }
                if (shop_by_occasion.length > 0) {
                    set_shop_by_occasion(shop_by_occasion[0]);
                }
                if (shop_by_gifts.length > 0) {
                    set_shop_by_gifts({ ...shop_by_gifts[0] });
                }
                setIsLoading({ ...isLoading, isLoading: false, isLoadMore: false });
            }
            else {
                setIsLoading({ ...isLoading, isLoading: false, isLoadMore: false })
                ToastError(userData?.message)
            }

        }).catch(error => {
            navigation.navigate('CatchError')
            setIsLoading({ ...isLoading, isLoading: false, isLoadMore: false })
            AlertError(Strings.Other.catchError);
        });
    };

    const getLandingPageBlock = async (type, item) => {
        instance.post('/get_landing_page_block_products', {
            req: {
                "data": {
                    page_data: getPageBlocks?.result,
                    block_key: item.key
                }
            }
        }).then(async (response) => {

            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                if (type == 'shop_by_occasion') {
                    set_shop_by_occasion(userData?.result);
                } else if (type == 'shop_by_design') {
                    set_shop_by_design(userData?.result);
                } else if (type == 'shop_by_gifts') {
                    set_shop_by_gifts(userData?.result);
                }
                setFilterLoading({ shop_by_occasion: false, shop_by_design: false, shop_by_gifts: false })
            }
        }).catch(error => {
            console.log("getLandingPageBlock==========catch===", error);
        }).finally(() => {
            setFilterLoading(false)
        });
    };

    const gotoScreen = async (data) => {
        const item = data.menu_url
        if (item?.url === "") {
            return '';
        }
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
                        "isFromLandingPage": true,
                    }
                } else if (item?.country_data != {}) {
                    newCountryData = {
                        "city_name": '',
                        "city_id": '',
                        "country_id": item?.country_data?._id ? item?.country_data?._id : '',
                        "country_image": item?.country_data?.country_image ? item?.country_data?.country_image : '',
                        "country_name": item?.country_data?.country_name ? item?.country_data?.country_name : '',
                        "country_iso_code": item?.country_data?.country_iso_code ? item?.country_data?.country_iso_code : '',
                        "menu_url": item,
                        "isFromLandingPage": true,
                    }
                }

                let currCountryData = { ...oldCountryData, ...newCountryData };
                await dispatch(setCounrtyData(currCountryData))
                return '';
            }
            navigation.navigate((item?.page_type == "landing" ? 'Landing' : 'Listing'), { "menu_url": item, "goto": 'Listing' })
        }
        else if (item?.page_type === "product") {
            (item?.slug) ? navigation.navigate("Detail", { "productSlug": item?.slug }) : navigation.navigate("Home", { "menu_url": item })
        }
        else if (item?.page_type === "static") {
            navigation.navigate("Detail", { "menu_url": item });
        }
    }

    useFocusEffect(useCallback(() => {
        console.log("I am on Home screen");
        let oldCountryData = countryData.country
        let newCountryData = {
            "country_id": oldCountryData["default_country_id"],
            "country_image": oldCountryData["default_country_image"],
            "country_name": oldCountryData["default_country_name"],
            "country_iso_code": oldCountryData["default_country_iso_code"],
            "isFromLandingPage": false
        }
        let currCountryData = { ...oldCountryData, ...newCountryData };
        dispatch(setCounrtyData(currCountryData))
    }, []))

    useEffect(() => {
        getHomeData()
    }, []);

    const goToNextPic = () => {
        isCarousel.snapToNext();
    };

    const goToBackPic = () => {
        isCarousel.snapToPrev();
    };

    const ProductSlider = ({ heading, data, sliderData, style, clickOnCategory, loding = '' }) => {
        return (
            <View style={[styles.productSliderMainView, style]}>
                {heading && <Label style={styles.textHeading} text={heading} />}
                <FlatList style={{ marginVertical: 30 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal
                    data={data ?? []}
                    renderItem={({ item, index }) => (
                        <Button
                            onPress={() => clickOnCategory(item)}
                            style={[styles.productSliderView, {
                                marginRight: data?.length - 1 == index ? 10 : 0,
                                backgroundColor: sliderData?._id === item?._id ? Colors.Black : Colors.White,
                                borderColor: sliderData?._id === item?._id ? 'transparent' : Colors.Black,
                            }]}
                            title={item.banner_text}
                            labelStyle={{ color: sliderData?._id === item?._id ? Colors.White : Colors.Black }}
                        />
                    )}
                />

                <SliderData
                    imageUrl={getPageBlocks?.product_image_path}
                    data={sliderData?.product_list ?? []}
                    paginationStyle={{ paddingVertical: Size.l }}
                    numberOfLines={1}
                    isLoading={filterLoading[loding]}
                />
                <Button
                    onPress={() => gotoScreen(sliderData)}
                    style={[styles.exploreButton, { alignSelf: 'center' }]}
                    title={Strings.Home.exploreMore}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
            <NewHeader
                title={'Home'}
                exploreIcon
            />
            <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
                <View>
                    <BottomSheet openSheet={'open'} isLoading={isLoading?.isLoading} />
                    <FlatList style={[styles.categoriesContainer, { paddingHorizontal: isLoading?.isLoading ? 5 : 0, borderColor: isLoading?.isLoading ? Colors.Silver : Colors.Camel, }]}
                        data={isLoading?.isLoading ? [{}, {}, {}, {}, {}, {}, {}, {}] : getPageBlocks?.result?.page_blocks?.gift_shop}
                        numColumns={4}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    {index == 8 ? '' :
                                        <Categories
                                            onPress={() => gotoScreen(item)}
                                            key={index}
                                            loding={isLoading?.isLoading}
                                            image={item?.mobile_image && { uri: getPageBlocks?.image_path + item?.mobile_image }}
                                            title={item?.banner_text}
                                            bottomWidthLoading={index == 3 ? 0 : index == 7 ? 0 : 1}
                                            rowWidthLoading={index > 3 ? 0 : 1}
                                        />}
                                </>
                            )
                        }}
                    />
                    <View style={{ height: 340 }}>
                        {isLoading?.isLoading ?
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item
                                    height={30}
                                    marginHorizontal={10}
                                    marginTop={15}
                                />
                            </SkeletonPlaceholder>
                            :
                            getPageBlocks?.result?.page_blocks?.row_three_title_one?.title &&
                            <View style={{ alignSelf: 'center', marginVertical: 23 }}>
                                <Label style={styles.textHeading} text={getPageBlocks?.result?.page_blocks?.row_three_title_one?.title} />
                            </View>
                        }
                        {isLoading?.isLoading ?
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item
                                    height={268}
                                    width={width}
                                    marginTop={19} />
                            </SkeletonPlaceholder>
                            :
                            getPageBlocks?.result?.page_blocks?.banner_images?.length > 0 &&
                            <Swiper style={styles.swiperContainer}
                                autoplay
                                activeDotStyle={styles.activeDot}
                                dotStyle={styles.dotStyle}
                                dotColor={Colors.White}
                                activeDotColor={'rgba(0,0,0,0.01)'}
                                paginationStyle={{ marginBottom: -17 }}
                            >
                                {getPageBlocks?.result?.page_blocks?.banner_images?.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => gotoScreen(item)} key={index} style={{}} activeOpacity={0.8}>
                                            <ProgressiveImage
                                                style={styles.fristSwiper}
                                                source={item?.mobile_image && { uri: getPageBlocks?.image_path + item?.mobile_image }}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    )
                                })}
                            </Swiper>}
                    </View>

                    <View style={{ alignItems: "center", marginVertical: 20 }}>
                        <Label style={styles.textHeading} text={getPageBlocks?.result?.page_blocks?.row_six_title_one?.title} />
                    </View>

                    <View style={styles.brandBuiltRowView}>
                        <View style={{ alignItems: 'center' }}>
                            <Label style={[styles.textHeading, { fontSize: 17 }]} text={Strings.Home.google} />
                            <View style={{ marginTop: 6 }}>
                                <Icon style={{ width: 97, height: 28 }} source={ImagePath.Other.star} />
                            </View>
                            <Label style={styles.ratingText} text={`${Strings.Home.rating}4.2`} />
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <Label style={[styles.textHeading, { fontSize: 17 }]} text={Strings.Home.trustpilot} />
                            <View style={{ marginTop: 6 }}>
                                <Icon style={{ width: 97, height: 28 }} source={ImagePath.Other.trustpilotStars} />
                            </View>
                            <Label style={styles.ratingText} text={`${Strings.Home.rating}4.5`} />
                        </View>

                        <View style={{ alignItems: 'center', }}>
                            <Label style={[styles.textHeading, { fontSize: 17 }]} text={Strings.Home.website} />
                            <View style={{ marginTop: 6 }}>
                                <Icon style={{ width: 97, height: 28 }} source={ImagePath.Other.star} />
                            </View>
                            <Label style={styles.ratingText} text={`${Strings.Home.rating}4.5`} />
                        </View>
                    </View>

                    <View>
                        {setting?.reactionVideoShow == 1 &&
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsHorizontalScrollIndicator={false} horizontal={true}>
                                <Video
                                    source={{ uri: setting?.reactionVideoUrl }}
                                    style={styles.video}
                                    controls={false}
                                    resizeMode="contain"
                                    repeat={true}
                                    muted={true}
                                />
                            </ScrollView>}
                        <Label style={[styles.ratingText, { textAlign: 'center' }]} text={Strings.Home.genuineReactionVideos} />
                    </View>

                    {!isLoading?.isLoading && <>
                        {/* Shop Flowers by Design */}
                        <ProductSlider
                            data={pageBlocksData?.shop_by_design}
                            heading={getPageBlocks?.result?.page_blocks?.row_seven_title_one?.title}
                            sliderData={shop_by_design}
                            loding='shop_by_design'
                            clickOnCategory={(item) => {
                                setFilterLoading({ shop_by_design: true });
                                getLandingPageBlock('shop_by_design', item);
                            }}
                        />

                        {/* Shop Flowers by budget */}
                        {(getPageBlocks?.result?.page_blocks?.row_eight_title_one?.title) &&
                            <Label style={styles.textHeading} text={getPageBlocks?.result?.page_blocks?.row_eight_title_one?.title} />}

                        {(getPageBlocks?.result?.page_blocks?.by_budget?.length > 0 && getPageBlocks?.image_path) &&
                            <FlatList style={{ marginTop: 25 }}
                                data={getPageBlocks?.result?.page_blocks?.by_budget}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => gotoScreen(item)} activeOpacity={0.7}>
                                        <Icon style={{ width: 170, height: 75 }} source={{ uri: getPageBlocks?.image_path + item?.mobile_image }} />
                                    </TouchableOpacity>
                                )}
                            />}

                        {/* Upcoming occasions */}
                        <ProductSlider
                            data={pageBlocksData?.shop_by_occasion}
                            heading={getPageBlocks?.result?.page_blocks?.row_sixteen_title_one?.title}
                            sliderData={shop_by_occasion}
                            style={{ backgroundColor: Colors.Magnolia, }}
                            loding='shop_by_occasion'
                            clickOnCategory={(item) => {
                                setFilterLoading({ shop_by_occasion: true });
                                getLandingPageBlock('shop_by_occasion', item)
                            }}
                        />

                        {/* Shop Flower By Recipient */}
                        {(getPageBlocks?.result?.page_blocks?.row_ten_title_one?.title) &&
                            <Label style={styles.textHeading} text={getPageBlocks?.result?.page_blocks?.row_ten_title_one?.title} />}

                        {(getPageBlocks?.result?.page_blocks?.recipients?.length > 0 && getPageBlocks?.image_path) &&
                            <FlatList style={{ marginTop: 16 }}
                                data={getPageBlocks?.result?.page_blocks?.recipients}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{}}>
                                            <Baner
                                                onPress={() => gotoScreen(item)}
                                                isLoading={false}
                                                style={[styles.shopByRecipient, { marginLeft: wp(index == 0 ? '3%' : '4%'), marginRight: wp(getPageBlocks?.result?.page_blocks?.recipients?.length - 1 == index ? '3%' : '0%') }]}
                                                imageStyle={[styles.recipientsImages, styles.recipients]}
                                                image={item?.mobile_image && { uri: getPageBlocks?.image_path + item?.mobile_image }}
                                            />
                                            <View style={[styles.shopByFlowerView, { marginLeft: (index == 0 || index == 3) ? wp('3%') : wp('4.5%'), borderWidth: 1, borderColor: Colors.Camel, bottom: 20, }]}>
                                                <BoldLabel boldStyle={{ fontSize: 13, textAlign: 'center', fontFamily: Typography.RobotoBold }} title={item?.image_alt} />
                                            </View>
                                        </View>
                                    )
                                }}
                            />}

                        {/* Shop Amazing gifts*/}
                        <ProductSlider
                            data={pageBlocksData?.shop_by_gifts}
                            heading={getPageBlocks?.result?.page_blocks?.row_twenty_title_one?.title}
                            sliderData={shop_by_gifts}
                            loding='shop_by_gifts'
                            clickOnCategory={(item) => {
                                setFilterLoading({ shop_by_gifts: true });
                                getLandingPageBlock('shop_by_gifts', item);
                            }}
                        />

                        {/* Shop by flowers*/}
                        <FlatList
                            data={getPageBlocks?.result?.page_blocks?.shop_by_flowers}
                            numColumns={3}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            ListHeaderComponent={
                                (getPageBlocks?.result?.page_blocks?.row_nine_title_one?.title) &&
                                <Label style={[styles.textHeading, { marginBottom: 10 }]} text={getPageBlocks?.result?.page_blocks?.row_nine_title_one?.title} />
                            }
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{}}>
                                        <Baner
                                            onPress={() => gotoScreen(item)}
                                            style={[styles.shopByBaner, { marginLeft: (index == 0 || index == 3) ? wp('3%') : wp('4.5%'), }]}
                                            imageStyle={styles.shopByImage}
                                            image={item?.mobile_image && { uri: getPageBlocks?.image_path + item?.mobile_image }}
                                            border
                                        />
                                        <View style={[styles.shopByFlowerView, { marginLeft: (index == 0 || index == 3) ? wp('3%') : wp('4.5%') }]}>
                                            <BoldLabel boldStyle={{ fontSize: 13, textAlign: 'center', fontFamily: Typography.RobotoBold }} title={item?.banner_text} />
                                        </View>
                                    </View>
                                )
                            }}
                        />

                        {/* Luxury flowers*/}
                        <View style={{ flex: 1, marginTop: 23 }}>
                            <ImageBackground style={styles.flowerBackIcon} source={pageBlocksData?.row_eleven_banner_one?.mobile_image && { uri: getPageBlocks?.image_path + pageBlocksData?.row_eleven_banner_one?.mobile_image }} resizeMode='cover' />

                            <View style={{ position: 'absolute' }}>
                                {pageBlocksData?.row_eleven_banner_one?.mobile_image &&
                                    <>
                                        <View style={styles.luxuryFlowersContainer}>
                                            {pageBlocksData?.row_eleven_banner_one?.banner_text && <Label style={[styles.textHeading, { color: Colors.White }]} text={pageBlocksData?.row_eleven_banner_one?.banner_text} />}
                                            {pageBlocksData?.row_eleven_banner_one?.product_price?.min_price && (
                                                <Label style={{ fontSize: 14, color: Colors.White, lineHeight: 33 }}
                                                    text={`Starting at ${countryData?.country?.currency_symbol} ${pageBlocksData?.row_eleven_banner_one?.product_price?.min_price || '0'}`}
                                                />
                                            )}
                                        </View>

                                        <Carousel
                                            ref={(c) => {
                                                isCarousel = c;
                                            }}
                                            data={pageBlocksData?.row_eleven_banner_one?.product_list}
                                            sliderWidth={width}
                                            itemWidth={width * 0.520}
                                            inactiveSlideScale={1}
                                            scrollEnabled={false}
                                            separatorWidth={0}
                                            firstItem={bottomCarouselIndex}
                                            onSnapToItem={index => setBottomCarouselIndex(index)}

                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity onPress={() => gotoScreen(item)} activeOpacity={0.7} style={{ alignItems: 'center', marginTop: 15, }} key={index}>
                                                        <ProgressiveImage
                                                            source={{ uri: getPageBlocks?.product_image_path + item?.product_image }}
                                                            style={styles.luxuryFlowersImages}
                                                            resizeMode='stretch'
                                                        />
                                                        <View style={{ marginTop: 6 }}>
                                                            <Label style={{ color: Colors.White, lineHeight: 25, fontSize: 14, fontFamily: Typography.LatoBold }} text={item?.product_name} numberOfLines={1} />
                                                        </View>
                                                        <Label style={{ color: Colors.White, fontSize: 13, fontFamily: Typography.LatoBold, }} text={`${countryData?.country?.currency_symbol} ${item?.product_price}`} />
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                        <View style={[styles.crouselButton, { bottom: '42%' }]}>
                                            <TouchableOpacity
                                                onPress={goToBackPic} activeOpacity={0.6} hitSlop={styles.hitSlop}
                                                style={[styles.crouselButtonRight, { opacity: bottomCarouselIndex == 0 ? 0.3 : 1 }]}
                                                disabled={bottomCarouselIndex == 0}
                                            >
                                                <Icon style={styles.swiperIcon} source={ImagePath.Home.arrowBack} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={goToNextPic} activeOpacity={0.6} hitSlop={styles.hitSlop}
                                                style={[styles.crouselButtonLeft, { opacity: bottomCarouselIndex == pageBlocksData?.row_eleven_banner_one?.product_list?.length - 1 ? 0.3 : 1 }]}
                                                disabled={bottomCarouselIndex == pageBlocksData?.row_eleven_banner_one?.product_list?.length - 1}
                                            >
                                                <Icon style={styles.swiperIcon} source={ImagePath.Home.arrowNext} />
                                            </TouchableOpacity>
                                        </View>
                                        {pageBlocksData?.row_eleven_banner_one &&
                                            <Button
                                                onPress={() => gotoScreen(pageBlocksData?.row_eleven_banner_one)}
                                                primaryButton
                                                style={styles.viewCollectionButton}
                                                title={Strings.Home.viewCollection}
                                                labelStyle={styles.viewCollectionButtontTitle}
                                            />}

                                    </>
                                }
                            </View>
                        </View>

                        {/* Customer Reviews*/}
                        <ReviewRating />
                    </>}
                </View>
            </ScrollView >

            {/* {(isLoading?.isLoadMore) &&
                <View style={styles.loadingMainContainer}>
                    <Loader />
                </View>
            } */}
        </SafeAreaView >
    )
}
export default Home;