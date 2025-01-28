import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, SafeAreaView, View, TouchableOpacity, Dimensions, ImageBackground, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';
import { useIsFocused } from "@react-navigation/native";
import Carousel from 'react-native-snap-carousel';
import styles from "./styles";
import {
    SwiperCom,
    Button,
    Categories,
    Baner,
    ProductList,
    NewHeader,
    BottomSheet,
    RowColumn,
    SliderData,
    ReviewRating
} from "../../../components";
import {
    Spacer,
    ImagePath,
    Strings,
    Colors,
    Label,
    Size,
    Typography,
    Icon,
} from "../../../constants";
import { instance } from "../../../utils";
import YoutubePlayer from "react-native-youtube-iframe";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useSelector, useDispatch } from "react-redux";
import { setCounrtyData } from "../../../features";

export default Home = ({ navigation }) => {

    let isCarousel = useRef();
    const playerRef = useRef();
    const { width } = Dimensions.get('window');
    const [bottomCarouselIndex, setBottomCarouselIndex] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [homePageData, setHomePageData] = useState();
    const [pageData, setPageData] = useState();
    const [pageBlocksData, setPageBlocksData] = useState();
    const [rowOneData, setRowOneData] = useState([]);
    const [rowThreeData, setRowThreeData] = useState([]);
    const [rowFourData, setRowFourData] = useState([]);
    const [rowSevenData, setRowSevenData] = useState([]);
    const [rowEigthData, setRowEigthData] = useState([]);
    const [rowNineData, setRowNineData] = useState([]);
    const authData = useSelector((state) => state.auth);
    const countryData = useSelector((state) => state.country);

    const dispatch = useDispatch();
    const isFocused = useIsFocused()

    useEffect(() => {
        getLandingData()
        setIsLoading(false);
    }, [countryData?.country?.currency_symbol]);

    useEffect(() => {
        if (isFocused) {
            console.log("I am on landing screen");
            getLandingData();
        }
    }, [isFocused])

    const getLandingData = async () => {
        setIsLoading(true);
        setRowOneData([{}]);
        instance.post('/get_landing_page_details', {
            req: {
                "data": {
                    "page_data": {
                        "_id": countryData?.country?.menu_url?._id
                    }
                }
            }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData.status === 'success') {
                setLandingData(userData);
                getLandingPageBlocks();
                setIsLoading(false);
            }
            else {
                // console.log("getLandingData else=====", userData.error);
                setIsLoading(false)
            }
        }).catch(error => {
            navigation.navigate('CatchError');
            console.log("catch error ===somthing whent wrong--landing---", error);
            setIsLoading(false)
        });
    };

    const getLandingPageBlocks = async () => {
        instance.post('/get_landing_page_blocks', {
            req: {
                "data": {
                    "page_data": {
                        "_id": countryData?.country?.menu_url?._id
                    }
                }
            }
        }).then(async (response) => {
            const userData = JSON.parse(response?.data);
            if (userData.status === 'success') {
                setPageBlocksData(userData?.result);
                setIsLoading(false);
            }
            else {
                console.log("getLandingPageBlocks else=====", userData.error);
                setIsLoading(false)
            }
        }).catch(error => {
            navigation.navigate('CatchError');
            console.log("catch error ===somthing whent wrong--landing---", error)
            setIsLoading(false);
        });
    };

    const setLandingData = (userData) => {
        const pageBlock = userData?.result?.page_blocks;
        setHomePageData(userData);
        setPageData(userData?.result?.page_blocks);
        setRowOneData(pageBlock?.banner_images);
        setRowFourData(pageBlock?.what_we_do);
        setRowSevenData(pageBlock?.popular_cities);
        setRowThreeData(pageBlock?.gift_shop);
        setRowNineData(pageBlock?.shop_by_flowers);
        setRowEigthData([
            pageBlock?.row_eight_image_five,
            pageBlock?.row_eight_image_six,
            pageBlock?.row_eight_image_seven,
            pageBlock?.row_eight_image_eight,
        ]);
    };

    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    const goToNextPic = () => {
        isCarousel.snapToNext();
    };

    const goToBackPic = () => {
        isCarousel.snapToPrev();
    };

    const gotoScreen = async (data) => {
        const item = data.menu_url
        if (item?.url === "") {
            return '';
        }
        if (typeof data?.slug != 'undefined') {
            navigation.navigate(authData.data?.slug ? 'Detail' : 'Login', { "productSlug": data?.slug, "productId": data?._id, });
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
                        "isFromLandingPage": true,
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

    const videoUrl = pageData?.row_twelve_video_one?.video_url;
    let videoId;

    if (videoUrl) {
        const parts = videoUrl.split("/");
        videoId = parts[parts.length - 1];
    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White }}>
            <NewHeader
                title={'Landing'}
                exploreIcon
            />
            <FlatList
                data={isLoading ? [{}, {}, {}, {}] : rowEigthData}
                numColumns={2}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onEndReached={isLoadMore == true ? getHomePageBlocks : null}
                onEndReachedThreshold={0.5}

                ListHeaderComponent={

                    <View style={{}}>
                        <BottomSheet isLoading={isLoading} />
                        <FlatList style={[styles.categoriesContainer, { paddingHorizontal: isLoading ? 5 : 0, borderColor: isLoading ? Colors.Silver : Colors.Camel, }]}
                            data={isLoading ? [{}, {}, {}, {}, {}, {}, {}, {}] : rowThreeData}
                            numColumns={4}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        {index == 8 ? '' :
                                            <Categories
                                                onPress={() => gotoScreen(item)}
                                                key={index}
                                                loding={isLoading}
                                                image={item?.mobile_image && { uri: homePageData?.image_path + item?.mobile_image }}
                                                title={item?.image_alt}
                                                bottomWidthLoading={index == 3 ? 0 : index == 7 ? 0 : 1}
                                                rowWidthLoading={index > 3 ? 0 : 1}
                                            />}
                                    </>
                                )
                            }}
                        />
                        {isLoading ?
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item
                                    height={228}
                                    width={width}
                                    marginTop={19} />
                            </SkeletonPlaceholder>
                            :
                            rowOneData?.length > 0 &&
                            < Swiper style={styles.swiperContainer}
                                autoplay
                                activeDotStyle={styles.activeDot}
                                dotStyle={styles.dotStyle}
                                dotColor={Colors.White}
                                activeDotColor={'rgba(0,0,0,0.01)'}
                                paginationStyle={{ marginBottom: -20 }}
                            >
                                {rowOneData?.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => gotoScreen(item)} key={index} style={{}} activeOpacity={0.7}>
                                            <Image style={{ width: width, height: 228 }} source={item?.mobile_image && { uri: homePageData?.image_path + item?.mobile_image }} resizeMode="cover" />
                                        </TouchableOpacity>
                                    )
                                })}
                            </Swiper>
                        }
                        <>
                            <Baner
                                onPress={() => gotoScreen(pageData?.row_two_image_one)}
                                isLoading={isLoading}
                                style={{ marginTop: 11 }}
                                border
                                image={pageData?.row_two_image_one?.mobile_image && { uri: homePageData?.image_path + pageData?.row_two_image_one?.mobile_image }}
                            />

                            <Baner
                                onPress={() => gotoScreen(pageData?.row_two_image_two)}
                                isLoading={isLoading}
                                style={{ marginTop: 7 }}
                                border
                                image={pageData?.row_two_image_two?.mobile_image && { uri: homePageData?.image_path + pageData?.row_two_image_two?.mobile_image }}
                            />
                            {(pageData?.row_eight_title_one?.title || pageData?.row_eight_title_two?.title) && <View style={{ alignItems: 'center', marginHorizontal: 17, marginTop: 7, paddingVertical: 6 }}>
                                <Label style={{ fontSize: 20, fontFamily: Typography.RobotoMedium, lineHeight: 33 }} text={pageData?.row_eight_title_one?.title} />
                                {pageData?.row_eight_title_two?.title && <Label style={{ fontSize: 13, textAlign: 'center', lineHeight: 15 }} text={pageData?.row_eight_title_two?.title} />}
                            </View>}
                            {/* For Her */}

                            {pageData?.row_eight_image_one?.mobile_image &&
                                <Baner
                                    onPress={() => gotoScreen(pageData?.row_eight_image_one)}
                                    isLoading={isLoading}
                                    style={{ marginTop: 7 }}
                                    imageStyle={{ height: 160, resizeMode: "cover" }}
                                    image={pageData?.row_eight_image_one?.mobile_image && { uri: homePageData?.image_path + pageData?.row_eight_image_one?.mobile_image }}
                                />}
                            {/* For him */}

                            {pageData?.row_eight_image_two?.mobile_image &&
                                <Baner
                                    onPress={() => gotoScreen(pageData?.row_eight_image_two)}
                                    isLoading={isLoading}
                                    style={{ marginTop: 10, }}
                                    imageStyle={{ height: 160, resizeMode: "cover" }}
                                    image={pageData?.row_eight_image_two?.mobile_image && { uri: homePageData?.image_path + pageData?.row_eight_image_two?.mobile_image }}
                                />}
                        </>

                        {(pageData?.row_eight_image_three || pageData?.row_eight_image_four) &&
                            <FlatList style={{ marginTop: 10 }}
                                data={[pageData?.row_eight_image_three, pageData?.row_eight_image_four]}
                                numColumns={2}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Baner
                                            onPress={() => gotoScreen(item)}
                                            isLoading={isLoading}
                                            style={styles.banerView}
                                            imageStyle={{ width: wp('47.650%'), height: 79, }}
                                            image={item?.mobile_image && { uri: homePageData?.image_path + item?.mobile_image }}
                                        />
                                    )
                                }}
                            />}
                    </View>
                }
                ListFooterComponent={
                    <View>
                        <FlatList
                            data={isLoading ? [{}, {}, {}, {}, {}, {}] : rowNineData}
                            numColumns={2}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            ListHeaderComponent={
                                (pageData?.row_nine_title_one?.title || pageData?.row_nine_title_two?.title) &&
                                <View style={{ alignItems: 'center', marginHorizontal: 17, marginTop: 7, paddingVertical: 6 }}>
                                    <Label style={{ fontSize: 18, fontFamily: Typography.RobotoMedium, lineHeight: 33 }} text={pageData?.row_nine_title_one?.title} />
                                    {pageData?.row_nine_title_two?.title && <Label style={{ fontSize: 12, textAlign: 'center', lineHeight: 15 }} text={pageData?.row_nine_title_two?.title} />}
                                </View>
                            }
                            renderItem={({ item }) => {
                                return (
                                    <Baner
                                        onPress={() => gotoScreen(item)}
                                        isLoading={isLoading}
                                        style={styles.shopByBaner}
                                        imageStyle={styles.shopByImage}
                                        image={item?.mobile_image && { uri: homePageData?.image_path + item?.mobile_image }}
                                        titleBottom={item?.banner_text}
                                        border
                                    />
                                )
                            }}
                        />
                        <>
                            {(pageData?.row_ten_title_one?.title || pageData?.row_ten_title_two?.title) &&
                                <View style={{ alignItems: 'center', marginHorizontal: 17, marginTop: 7, paddingVertical: 6 }}>
                                    <Label style={{ fontSize: 18, fontFamily: Typography.RobotoMedium, lineHeight: 33 }} text={pageData?.row_ten_title_one?.title} />
                                    <Label style={{ fontSize: 13, textAlign: 'center', lineHeight: 15 }} text={pageData?.row_ten_title_two?.title} />
                                </View>}

                            <SwiperCom
                                onClick={() => gotoScreen(pageData?.row_ten_image_one)}
                                isLoading={isLoading}
                                style={{ marginHorizontal: '1.6%', marginTop: pageData?.row_ten_image_one ? 10 : 0 }}
                                iconStyle={[styles.bigBanerIcon, { height: pageData?.row_ten_image_one ? 198 : 0 }]}
                                icon={pageData?.row_ten_image_one?.mobile_image ? { uri: homePageData?.image_path + pageData?.row_ten_image_one?.mobile_image } : ImagePath.Other.blankImage}
                                resizeMode="cover"
                            />

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: (pageData?.row_ten_image_two || pageData?.row_ten_image_three) ? 17 : 0, }}>
                                <SwiperCom
                                    onClick={() => gotoScreen(pageData?.row_ten_image_two)}
                                    style={styles.banerContainer}
                                    isLoading={isLoading}
                                    iconStyle={[styles.longBanerIcon, { height: pageData?.row_ten_image_two ? wp('47.120%') : 0 }]}
                                    icon={pageData?.row_ten_image_two?.mobile_image ? { uri: homePageData?.image_path + pageData?.row_ten_image_two?.mobile_image } : ImagePath.Other.blankImage}
                                    resizeMode="cover"
                                />
                                <SwiperCom
                                    onClick={() => gotoScreen(pageData?.row_ten_image_three)}
                                    style={styles.banerContainer}
                                    isLoading={isLoading}
                                    iconStyle={[styles.longBanerIcon, { height: pageData?.row_ten_image_three ? wp('47.120%') : 0 }]}
                                    icon={pageData?.row_ten_image_three?.mobile_image ? { uri: homePageData?.image_path + pageData?.row_ten_image_three?.mobile_image } : ImagePath.Other.blankImage}
                                    resizeMode="cover"
                                />
                            </View>
                        </>

                        <View style={{ flex: 1, height: '100%', marginTop: 31 }}>

                            {isLoadMore ?
                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item
                                        height={width * 1.540}
                                        width={wp('100%')}
                                    />
                                </SkeletonPlaceholder>
                                :
                                <>
                                    <ImageBackground style={styles.flowerBackIcon} source={pageBlocksData?.row_eleven_banner_one?.mobile_image && { uri: homePageData?.image_path + pageBlocksData?.row_eleven_banner_one?.mobile_image }} resizeMode='cover' />
                                    <View style={{ position: 'absolute' }}>

                                        {pageBlocksData?.row_eleven_banner_one?.mobile_image &&
                                            <>
                                                {(pageBlocksData?.row_eleven_banner_one?.banner_text || pageBlocksData?.row_eleven_banner_one || pageBlocksData?.row_eleven_banner_one?.product_price?.min_price) &&
                                                    <View style={styles.luxuryFlowersContainer}>
                                                        {pageBlocksData?.row_eleven_banner_one?.banner_text && <Label style={{ fontSize: Size.l, color: Colors.Camel, fontFamily: Typography.LatoBold }} text={pageBlocksData?.row_eleven_banner_one?.banner_text} />}
                                                        {pageBlocksData?.row_eleven_banner_one?.product_price?.min_price && <Label style={{ fontSize: 13, color: Colors.Camel, lineHeight: 24 }} text={`Starting at ${pageBlocksData?.row_eleven_banner_one?.product_price?.min_price ? pageBlocksData?.row_eleven_banner_one?.product_price?.min_price : '0'}`} />}

                                                        {pageBlocksData?.row_eleven_banner_one &&
                                                            <Button
                                                                onPress={() => gotoScreen(pageBlocksData?.row_eleven_banner_one)}
                                                                primaryButton
                                                                style={styles.viewCollectionButton}
                                                                title={Strings.Home.viewCollection}
                                                                labelStyle={styles.viewCollectionButtontTitle}
                                                            />}
                                                    </View>}

                                                <Carousel
                                                    ref={(c) => {
                                                        isCarousel = c;
                                                    }}
                                                    data={pageBlocksData?.row_eleven_banner_one?.product_list}
                                                    sliderWidth={width}
                                                    itemWidth={width * 0.693}
                                                    inactiveSlideScale={1}
                                                    scrollEnabled={false}
                                                    separatorWidth={0}
                                                    firstItem={bottomCarouselIndex}
                                                    onSnapToItem={index => setBottomCarouselIndex(index)}

                                                    renderItem={({ item, index }) => {
                                                        return (
                                                            <TouchableOpacity onPress={() => gotoScreen(item)} activeOpacity={0.7} style={{ alignItems: 'center', marginTop: 20, }} key={index}>
                                                                <Image style={{
                                                                    height: width * 0.580, width: width * 0.580,
                                                                    borderWidth: 1, borderColor: Colors.Camel,
                                                                    borderTopRightRadius: 12,
                                                                    borderBottomLeftRadius: 12
                                                                }} source={{ uri: homePageData?.product_image_path + item?.product_image }} resizeMode='stretch' />

                                                                <View style={{ marginTop: 6, paddingHorizontal: 20 }}>
                                                                    <Label style={{ color: Colors.White, lineHeight: 25, fontSize: 14 }} text={item?.product_name} numberOfLines={1} />
                                                                </View>
                                                                <Label style={{ color: Colors.White, fontSize: 13, fontFamily: Typography.LatoBold, }} text={`${countryData?.country?.currency_symbol} ${item?.product_price}`} />
                                                            </TouchableOpacity>
                                                        )
                                                    }}
                                                />
                                                <View style={[styles.crouselButton, { bottom: '45%' }]}>
                                                    <TouchableOpacity
                                                        onPress={goToBackPic} activeOpacity={0.6} hitSlop={styles.hitSlop}
                                                        style={[styles.crouselButtonRight, { opacity: bottomCarouselIndex == 0 ? 0.3 : 1 }]}
                                                        disabled={bottomCarouselIndex == 0}
                                                    >
                                                        <Image style={styles.swiperIcon} source={ImagePath.Home.arrowBack} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={goToNextPic} activeOpacity={0.6} hitSlop={styles.hitSlop}
                                                        style={[styles.crouselButtonLeft, { opacity: bottomCarouselIndex == pageBlocksData?.row_eleven_banner_one?.product_list?.length - 1 ? 0.3 : 1 }]}
                                                        disabled={bottomCarouselIndex == pageBlocksData?.row_eleven_banner_one?.product_list?.length - 1}
                                                    >
                                                        <Image style={styles.swiperIcon} source={ImagePath.Home.arrowNext} />
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        }
                                    </View>
                                </>
                            }
                        </View>

                        {!isLoadMore && <>
                            {pageData?.row_twelve_image_one?.mobile_image &&
                                <SwiperCom
                                    onClick={() => gotoScreen(pageData?.row_twelve_image_one)}
                                    isLoading={isLoading}
                                    style={{ marginHorizontal: '1.6%', marginTop: 12 }}
                                    iconStyle={styles.smolBaner}
                                    icon={homePageData && { uri: homePageData?.image_path + pageData?.row_twelve_image_one?.mobile_image }}
                                    emptyView={styles.emptyViewBaner}
                                    resizeMode={'stretch'}
                                />}
                            {pageData?.row_twelve_image_two?.mobile_image && <SwiperCom
                                onClick={() => gotoScreen(pageData?.row_twelve_image_two)}
                                isLoading={isLoading}
                                style={{ marginHorizontal: '1.6%', marginTop: 12 }}
                                iconStyle={styles.smolBaner}
                                icon={homePageData && { uri: homePageData?.image_path + pageData?.row_twelve_image_two?.mobile_image }}
                                emptyView={styles.emptyViewBaner}
                                resizeMode={'stretch'}
                            />}

                            {(pageData?.row_twelve_image_three || pageData?.row_twelve_image_four) &&
                                < FlatList
                                    scrollEnabled={false}
                                    data={[pageData?.row_twelve_image_three, pageData?.row_twelve_image_four]}
                                    numColumns={2}
                                    renderItem={({ item }) => {
                                        return (
                                            <View key={item?._id} >
                                                <ProductList
                                                    onClickProduct={() => gotoScreen(item)}
                                                    isLoading={isLoading}
                                                    style={styles.arrivalsProduct}
                                                    productNameView={{ width: '96%', paddingVertical: 10 }}
                                                    productNameStyle={{ color: Colors.Black, fontSize: 14 }}
                                                    productImageStyle={styles.arrivalsIcon}
                                                    productImage={homePageData && { uri: homePageData?.image_path + item?.mobile_image }}
                                                    productName={item?.banner_text}
                                                />
                                            </View>
                                        )
                                    }}
                                />}

                            {videoId && <View style={styles.videoContainer}>
                                <YoutubePlayer
                                    ref={playerRef}
                                    height={250}
                                    play={playing}
                                    videoId={videoId}
                                    onChangeState={onStateChange}
                                    webViewStyle={{}}
                                />
                            </View>}

                            {pageData?.row_thirteen_image_one?.mobile_image &&
                                <SwiperCom
                                    onClick={() => gotoScreen(pageData?.row_thirteen_image_one)}
                                    isLoading={isLoading}
                                    style={{ marginHorizontal: '1.5%', marginTop: 23 }}
                                    icon={homePageData && { uri: homePageData?.image_path + pageData?.row_thirteen_image_one?.mobile_image }}
                                    iconStyle={{ borderRadius: 8, height: 80, }}
                                    allTitleStyle={styles.bestAddContainer}
                                    labelStyle={{ fontSize: Size.m1, fontFamily: Typography.LatoRegular }}
                                    white
                                    center
                                    CamelColor
                                    resizeMode="cover"
                                />}

                            <View >
                                <View style={{ alignItems: "center", paddingVertical: 18 }}>
                                    <Label style={{ fontSize: 18, fontFamily: Typography.RobotoMedium }} text={pageData?.row_six_title_one?.title} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 7 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Label style={{ fontSize: 15, fontFamily: Typography.LatoBold }} text='Google' />
                                        <View style={{ marginTop: 6 }}>
                                            <Icon style={{ width: 97, height: 28 }} source={ImagePath.Other.star} />
                                        </View>
                                        <Label style={{ fontSize: 13, lineHeight: 22 }} text={`${'Rating:'} 5`} />
                                        <Label style={{ fontSize: 12, }} text={`${'Based on:'} ${'1'} reviews`} />
                                    </View>

                                    <View style={{ alignItems: 'center' }}>
                                        <Label style={{ fontSize: 15, fontFamily: Typography.LatoBold }} text='Trustpilot' />
                                        <View style={{ marginTop: 6 }}>
                                            <Icon style={{ width: 97, height: 28 }} source={ImagePath.Other.star} />
                                        </View>
                                        <Label style={{ fontSize: 13, lineHeight: 22 }} text={`${'Rating:'} 5`} />
                                        <Label style={{ fontSize: 12, }} text={`${'Based on:'} ${'1'} reviews`} />
                                    </View>

                                    <View style={{ alignItems: 'center', }}>
                                        <Label style={{ fontSize: 15, fontFamily: Typography.LatoBold }} text='Website' />
                                        <View style={{ marginTop: 6 }}>
                                            <Icon style={{ width: 97, height: 28 }} source={ImagePath.Other.star} />
                                        </View>
                                        <Label style={{ fontSize: 13, lineHeight: 22 }} text={`${'Rating:'} 5`} />
                                        <Label style={{ fontSize: 12, }} text={`${'Based on:'} ${'1'} reviews`} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.Black, justifyContent: 'space-between', paddingHorizontal: '1.5%', marginTop: 20 }}>
                                    <Image style={styles.ratingUserImages} source={ImagePath.webIcons.weddingflowersuae} />
                                    <Image style={styles.ratingUserImages} source={ImagePath.webIcons.weddingmobile} />
                                    <Image style={styles.ratingUserImages} source={ImagePath.webIcons.weddingflowersuae} />
                                </View>
                            </View>

                            {(pageData?.row_seven_title_one?.title || pageData?.row_seven_title_two?.title) &&
                                <View style={{ alignItems: 'center', marginHorizontal: 17, marginTop: 7, paddingVertical: 6 }}>
                                    <Label style={{ fontSize: 18, fontFamily: Typography.RobotoMedium, lineHeight: 33 }} text={pageData?.row_seven_title_one?.title} />
                                    {pageData?.row_seven_title_two?.title && <Label style={{ fontSize: 12, textAlign: 'center', lineHeight: 15 }} text={pageData?.row_seven_title_two?.title} />}
                                </View>}

                            {rowSevenData?.length > 0 && <View >
                                <Swiper
                                    style={styles.popularCitiesSliderMainCon}
                                    nextButton={
                                        <View style={[styles.sliderButtonStyle, { left: 10, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }]}>
                                            <Image style={styles.popularCitiesSliderIcon} source={ImagePath.Other.rightarrows} />
                                        </View>
                                    }
                                    prevButton={
                                        <View style={[styles.sliderButtonStyle, { right: 10, borderBottomRightRadius: 3, borderTopRightRadius: 3 }]}>
                                            <Image style={styles.popularCitiesSliderIcon} source={ImagePath.Other.leftarrow} />
                                        </View>
                                    }
                                    loop={true}
                                    showsButtons={true}
                                    scrollEnabled={false}
                                    activeDotStyle={styles.popularCitiesActiveDot}
                                    dotStyle={styles.popularCitiesDotStyle}
                                    dotColor={Colors.Black}
                                    paginationStyle={{ marginBottom: -25 }}
                                >
                                    {rowSevenData?.map((item, index) => {
                                        return (
                                            <TouchableOpacity onPress={() => gotoScreen(item)} style={styles.popularCitiesSlider} key={index} activeOpacity={0.7}>
                                                <Image source={{ uri: homePageData?.image_path + item?.mobile_image }} style={styles.popularCitiesImage} resizeMode="cover" />
                                                <View style={{ marginVertical: 8 }}>
                                                    <Label style={{ fontSize: 16, fontFamily: Typography.LatoBold, textAlign: 'center', }} text={item?.banner_text} />
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </Swiper>
                            </View>}

                            {pageBlocksData?.row_fourteen_image_one?.product_list?.length > 0 &&
                                <View style={{ paddingTop: 20, backgroundColor: Colors.Fantasy, marginTop: 28 }}>
                                    <RowColumn
                                        onPress={() => gotoScreen(pageBlocksData?.row_fourteen_image_one)}
                                        viewStyle={{ justifyContent: 'space-between', paddingHorizontal: '1.5%', }}
                                        title1={pageBlocksData?.row_fourteen_image_one?.banner_text}
                                        labelStyle1={{ fontSize: 18, fontFamily: Typography.RobotoMedium }}
                                        button
                                    />
                                    <Spacer style={{ marginTop: 15 }} />
                                    <SliderData
                                        imageUrl={homePageData?.product_image_path}
                                        data={pageBlocksData?.row_fourteen_image_one?.product_list}
                                        paginationStyle={{ paddingVertical: Size.l }}
                                        numberOfLines={1}
                                    />
                                </View>
                            }

                            {pageBlocksData?.row_fifteen_image_one?.product_list?.length > 0 &&
                                <View style={{ marginTop: 40 }}>
                                    <RowColumn
                                        onPress={() => gotoScreen(pageBlocksData?.row_fifteen_image_one)}
                                        viewStyle={{ justifyContent: 'space-between', paddingHorizontal: '1.5%', }}
                                        title1={pageBlocksData?.row_fifteen_image_one?.banner_text}
                                        labelStyle1={{ fontSize: 20, fontFamily: Typography.RobotoMedium }}
                                        button
                                    />
                                    <Spacer style={{ marginTop: 15 }} />
                                    <SliderData
                                        imageUrl={homePageData?.product_image_path}
                                        data={pageBlocksData?.row_fifteen_image_one?.product_list}
                                        paginationStyle={{ paddingVertical: Size.l }}
                                        numberOfLines={1}
                                    />
                                </View>
                            }

                            {pageBlocksData?.row_sixteen_image_one?.product_list?.length > 0 &&
                                <View style={{ paddingTop: 20, backgroundColor: Colors.Fantasy, marginTop: 28 }}>
                                    <RowColumn
                                        onPress={() => gotoScreen(pageBlocksData?.row_sixteen_image_one)}
                                        viewStyle={{ justifyContent: 'space-between', paddingHorizontal: '1.5%', }}
                                        title1={pageBlocksData?.row_sixteen_image_one?.banner_text}
                                        labelStyle1={{ fontSize: 18, fontFamily: Typography.RobotoMedium }}
                                        button
                                    />
                                    <Spacer style={{ marginTop: 15 }} />
                                    <SliderData
                                        imageUrl={homePageData?.product_image_path}
                                        data={pageBlocksData?.row_sixteen_image_one?.product_list}
                                        paginationStyle={{ paddingVertical: Size.l }}
                                        numberOfLines={1}
                                    />
                                </View>
                            }

                            {pageBlocksData?.row_seventeen_image_one?.product_list?.length > 0 &&
                                <View style={{ marginTop: 20, }}>
                                    <RowColumn
                                        onPress={() => gotoScreen(pageBlocksData?.row_seventeen_image_one)}
                                        viewStyle={{ justifyContent: 'space-between', paddingHorizontal: '1.5%', }}
                                        title1={pageBlocksData?.row_seventeen_image_one?.banner_text}

                                        labelStyle1={{ fontSize: 18, fontFamily: Typography.RobotoMedium }}
                                        button
                                    />
                                    <Spacer style={{ marginTop: 15 }} />
                                    <SliderData
                                        imageUrl={homePageData?.product_image_path}
                                        data={pageBlocksData?.row_seventeen_image_one?.product_list}
                                        paginationStyle={{ paddingVertical: Size.l }}
                                        numberOfLines={1}
                                    />
                                </View>
                            }
                            {pageData?.row_nineteen_image_one?.mobile_image && <View>
                                <Spacer style={{ marginTop: 18 }} />
                                <Baner
                                    onPress={() => gotoScreen(pageData?.row_nineteen_image_one)}
                                    isLoading={isLoading}
                                    image={homePageData && { uri: homePageData?.image_path + pageData?.row_nineteen_image_one?.mobile_image }}
                                    imageStyle={styles.plantBaner}
                                    bottonTitleStyleView={{ position: 'absolute' }}
                                />
                            </View>}
                            {pageData?.row_eighteen_image_one?.mobile_image && <Baner
                                onPress={() => gotoScreen(pageData?.row_four_image_one)}
                                isLoading={isLoading}
                                style={{ marginTop: 18, marginLeft: '1.3%' }}
                                imageStyle={{ height: 154, }}
                                image={homePageData && { uri: homePageData?.image_path + pageData?.row_eighteen_image_one?.mobile_image }}
                            />}
                            {(pageData?.row_eighteen_image_two || pageData?.row_eighteen_image_three) &&
                                <FlatList
                                    style={{ marginTop: 22 }}
                                    scrollEnabled={false}
                                    data={[pageData?.row_eighteen_image_two, pageData?.row_eighteen_image_three]}
                                    numColumns={2}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View key={item?._id}>
                                                <ProductList
                                                    onClickProduct={() => gotoScreen(item)}
                                                    style={styles.teddyBearslistView}
                                                    productNameView={{ width: '96%', paddingVertical: 10 }}
                                                    productNameStyle={{ color: Colors.Black, borderTopLeftRadius: 11, borderBottomRightRadius: 11 }}
                                                    productImageStyle={styles.teddyBearsImage}
                                                    productImage={homePageData && { uri: homePageData?.image_path + item?.mobile_image }}
                                                />
                                            </View>
                                        )
                                    }}
                                />}

                            {pageBlocksData?.row_twenty_image_one?.mobile_image &&
                                <Baner
                                    onPress={() => gotoScreen(pageBlocksData?.row_twenty_image_one)}
                                    isLoading={isLoading}
                                    style={{ marginTop: 16, marginLeft: '0%', }}
                                    imageStyle={styles.flowerBaner}
                                    image={homePageData && { uri: homePageData?.image_path + pageBlocksData?.row_twenty_image_one?.mobile_image }}
                                />}

                            {pageBlocksData?.row_twenty_image_one?.product_list?.length > 0 &&
                                < View >
                                    <Spacer style={{ marginTop: 26 }} />
                                    {pageBlocksData &&
                                        <SliderData
                                            imageUrl={homePageData?.product_image_path}
                                            data={pageBlocksData?.row_twenty_image_one?.product_list}
                                            paginationStyle={{ paddingVertical: Size.l }}
                                            numberOfLines={1}
                                        />}
                                </View>}
                            {pageBlocksData?.row_twenty_image_two?.mobile_image && <Baner
                                onPress={() => gotoScreen(pageBlocksData?.row_twenty_image_two)}
                                isLoading={isLoading}
                                style={{ marginLeft: '0%', }}
                                imageStyle={styles.flowerBaner}
                                image={homePageData && { uri: homePageData?.image_path + pageBlocksData?.row_twenty_image_two?.mobile_image }}
                            />}

                            {pageBlocksData?.row_twenty_image_two?.product_list && <View>
                                <Spacer style={{ marginTop: 26 }} />
                                {pageBlocksData &&
                                    <SliderData
                                        imageUrl={homePageData?.product_image_path}
                                        data={pageBlocksData?.row_twenty_image_two?.product_list}
                                        paginationStyle={{ paddingVertical: Size.l }}
                                        numberOfLines={1}
                                    />}
                            </View>}

                            {pageData?.row_four_title_one?.title && <Label text={pageData?.row_four_title_one?.title} style={styles.banerName} />}
                            {pageData?.row_four_image_one?.mobile_image &&
                                <Baner
                                    onPress={() => gotoScreen(pageData?.row_four_image_one)}
                                    isLoading={isLoading}
                                    style={styles.descreptionBanerView}
                                    imageStyle={styles.descreptionBaner}
                                    image={homePageData && { uri: homePageData?.image_path + pageData?.row_four_image_one?.mobile_image }}
                                />}
                            {rowFourData?.length > 0 &&
                                <View style={styles.swiperBanerView}>
                                    <Swiper style={{ padding: 6 }}
                                        loop={true}
                                        showsButtons={true}
                                        showsPagination={false}
                                        scrollEnabled={false}
                                        nextButton={
                                            <View style={[styles.sliderButtonStyle, { left: 10, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }]}>
                                                <Image style={styles.popularCitiesSliderIcon} source={ImagePath.Other.rightarrows} />
                                            </View>
                                        }
                                        prevButton={
                                            <View style={[styles.sliderButtonStyle, { right: 10, borderBottomRightRadius: 3, borderTopRightRadius: 3 }]}>
                                                <Image style={styles.popularCitiesSliderIcon} source={ImagePath.Other.leftarrow} />
                                            </View>
                                        }
                                    >
                                        {rowFourData?.map((item, index) => {
                                            return (
                                                <TouchableOpacity onPress={() => gotoScreen(item)} key={index} activeOpacity={0.7}>
                                                    <Image source={item?.mobile_image && { uri: homePageData?.image_path + item?.mobile_image }} style={styles.swiperBaner} resizeMode="cover" />
                                                    <View style={{ marginHorizontal: 7, paddingVertical: 5 }}>
                                                        <Label style={{ fontSize: 18, fontFamily: Typography.LatoBold, lineHeight: 36 }} text={item?.image_alt} />
                                                        <Label style={{ fontSize: 14, fontFamily: Typography.LatoRegular }} text={item?.description} />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </Swiper>
                                </View>}

                            {homePageData?.result?.same_day_delivery?.length > 0 ?
                                <FlatList style={{ marginTop: 18, marginHorizontal: 5 }}
                                    data={homePageData?.result?.same_day_delivery}
                                    scrollEnabled={false}
                                    numColumns={3}
                                    ListHeaderComponent={
                                        <View style={{ marginLeft: '1.1%' }}>
                                            <Label style={{ fontSize: 18, fontFamily: Typography.RobotoMedium }} text='Same Day Delivery.. Order Now' />
                                        </View>
                                    }
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={{ alignItems: 'center', flex: 1 }}>
                                                <TouchableOpacity onPress={() => setLocation(item)} style={styles.sameDayDelivery} activeOpacity={0.7}>
                                                    <Image style={styles.sameDayDeliveryIcon} source={homePageData && { uri: homePageData?.country_data?.image_url + item?.country_mobile_image }} resizeMode="contain" />
                                                    <View style={{ paddingVertical: 5 }}>
                                                        <Label style={{ color: Colors.Dune, fontSize: 12, fontFamily: Typography.LatoRegular }} text={item?.country_name} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                /> : ''}
                            <ReviewRating
                                sliderManView={{ alignItems: 'center' }}
                                sliderView={{ marginTop: 15 }}
                                ratingButtonContainer={styles.ratingButtonView}
                            />
                        </>}
                    </View>
                }
                renderItem={({ item, index }) => {
                    return (
                        <Baner
                            onPress={() => gotoScreen(item)}
                            isLoading={false}
                            style={[styles.banerView, { marginTop: item?.mobile_image ? 12 : 0, }]}
                            imageStyle={styles.banerImg}
                            image={item?.mobile_image && { uri: homePageData?.image_path + item?.mobile_image }}
                            titleStyle={{ fontSize: 12, fontFamily: Typography.LatoMedium }}
                            title={item?.banner_text}
                            border={item?.mobile_image ? true : false}
                        />
                    )
                }}
            />
        </SafeAreaView >
    )
};