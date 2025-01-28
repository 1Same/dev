import { Dimensions, Platform, StyleSheet } from 'react-native'
import { Size, Colors, Typography } from "../../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({

    categoriesContainer: {
        borderWidth: 1,
        borderColor: Colors.CreamBrulee,
        borderRadius: 12,
        marginLeft: wp('3%'),
        width: wp('94%'),
        marginTop: 14,
        height: 175
    },
    swiperContainer: {
        marginTop: 19,
        height: 228,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderWidth: 1,
        borderColor: Colors.White,
        elevation: 5,
    },
    dotStyle: {
        width: 8,
        height: 8,
        elevation: 5,
    },
    banerView: {
        width: wp('47.650%'),
        backgroundColor: Colors.Fantasy,
        paddingHorizontal: 7,
        marginLeft: wp('1.5%'),
        marginHorizontal: wp('0%')
    },
    banerImg: {
        height: 77,
        width: 54,
        resizeMode: 'contain'
    },
    shopByBaner: {
        marginTop: 6,
        marginLeft: wp('1.5%'),
        marginHorizontal: wp('0%')
    },
    shopByImage: {
        width: wp('47.350%'),
        height: 125,
    },
    bigBanerIcon: {
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
        width: wp('96.70%'),
        height: 198
    },
    smolBaner: {
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: 'hidden',
        width: wp('96.70%'),
        height: 158
    },
    addIconContainer: {
        flexDirection: 'row',
        marginTop: 17,
    },
    emptyViewSwiper: {
        width: "54%",
        height: height / 3 - 10,
    },
    emptyViewBaner: {
        width: wp("50%"),
        height: 205,
    },
    emptyView: {
        width: wp("10%"),
        height: wp("50%"),
    },
    longBanerIcon: {
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
        width: wp('47.120%'),
    },
    banerContainer: {
        marginLeft: '1.5%',
        marginHorizontal: '0%',
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    viewCollectionButton: {
        backgroundColor: Colors.Camel,
        height: 28,
        width: 107,
        borderRadius: 3,
        marginTop: 11
    },
    viewCollectionButtontTitle: {
        color: Colors.White,
        fontSize: 11,
        fontFamily: Typography.LatoRegular
    },
    arrivalsProduct: {
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        alignItems: 'center',
        padding: 0,
        marginLeft: wp('1.5%'),
        marginTop: 15
    },
    arrivalsIcon: {
        width: wp('47.120%'),
        height: wp('47.120%'),
        borderTopRightRadius: 11,
        borderBottomLeftRadius: 11,
    },
    flowerBaner: {
        height: 57,
        width: wp('96.5%'),
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        resizeMode: "cover"
    },
    teddyBearsImage: {
        width: wp('47%'),
        height: wp('47%'),
    },
    teddyBearslistView: {
        borderWidth: null,
        padding: 0,
        marginLeft: wp('2%'),
        borderColor: null
    },
    banerName: {
        fontSize: 18,
        fontFamily: Typography.LatoBold,
        textAlign: 'center'
    },
    descreptionBanerView: {
        marginLeft: wp('1.5%'),
        marginRight: wp('1.5%'),
        marginTop: 17,
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    descreptionBaner: {
        height: 122,
        width: wp('96%'),
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 8,
        resizeMode: 'cover'
    },
    swiperBanerView: {
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
        margin: 5,
        backgroundColor: Colors.Fantasy,
        height: height / 2.1,
        marginTop: 10,
    },
    swiperBaner: {
        height: wp('60%'),
        width: wp('94%'),
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    sameDayDelivery: {
        borderRadius: 5,
        backgroundColor: Colors.CatskillWhite,
        marginTop: 7,
        margin: 8,
        paddingTop: 8,
        alignItems: 'center',
    },
    sameDayDeliveryIcon: {
        width: wp('30%'),
        height: wp('17.5')
    },
    bestSellerProductView: {
        width: wp('48%'),
        marginLeft: wp('1.5%'),
    },
    bestSellerProduct: {
        height: wp('47%'),
        width: wp('47%'),
    },
    plantBaner: {
        height: 76,
        borderRadius: 8,
        resizeMode: 'cover'
    },
    popularCitiesSliderMainCon: {
        height: height / 3.3,
        marginTop: 16,
    },
    popularCitiesSlider: {
        marginLeft: wp('3%'),
    },
    popularCitiesImage: {
        height: wp('45%'),
        width: wp('94%'),
    },
    popularCitiesActiveDot: {
        width: 7,
        height: 7,
        backgroundColor: Colors.Camel,
    },
    popularCitiesDotStyle: {
        width: 7,
        height: 7,
    },
    swiperButtonContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        height: 0,
    },
    popularCitiesSliderButton: {
        bottom: hp('18%'),
        backgroundColor: Colors.White,
        elevation: 5,
        shadowColor: '#00000029',
        width: 35,
        height: 28,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    popularCitiesSliderBack: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3
    },
    popularCitiesSliderIcon: {
        width: 20,
        height: 20,
        tintColor: Colors.Camel
    },
    flowerSlider: {
        bottom: hp('22.5%'),
    },
    ratingUserImages: {
        width: wp('31.2%'),
        height: wp('31.2%'),
        resizeMode: "cover"
    },
    ratingButtonView: {
        top: hp('15.8%')
    },
    containergradient: {
        flex: 1,
        width: '80%',
        height: '50%',
        borderRadius: 20,
        marginVertical: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    rowColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.FantasyNew,
        height: Size.x63,
        paddingLeft: Size.m0,
        paddingRight: Size.xm2,
        flex: 1
    },
    shapeIcon: {
        width: Size.xs2,
        height: Size.xm1
    },
    ShapeIconContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    title: {
        fontSize: Size.l - 2,
        fontFamily: Typography.LatoBold,
        textAlign: 'center'
    },
    spacer: {
        marginTop: Size.m0
    },
    uaeIcon: {
        height: 170,
        width: 169
    },
    flatlistDot: {
        width: Size.xs2 + 1,
        height: Size.xs2 + 1,
        borderRadius: Size.xs2 + 1,
        marginLeft: Size.xs3,
    },
    swiperArrivals: {
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderRadius: Size.m,
        marginHorizontal: 8
    },
    videoContainer: {
        margin: ('1.5%'),
        marginTop: 13,
        height: height * 0.270,
    },
    videos: {
        width: wp('90%'),
        height: '100%',
        borderRadius: 8,
        overflow: 'hidden',
    },
    backgroundAddIcon: {
        width: Size.x69,
        height: Size.x69,
        justifyContent: 'center',
        alignItems: "center",
    },
    addContainer: {
        paddingTop: Size.xs2
    },
    addIcon: {
        width: '100%',
        height: 91,
        borderTopLeftRadius: Size.m,
        borderBottomRightRadius: Size.m,
        overflow: 'hidden',
    },
    spacerTop: {
        marginTop: Size.xl
    },
    spaceMedium: {
        marginTop: Size.m1
    },
    allTitleStyle: {
        width: '100%',
        paddingHorizontal: Size.xm1,
        justifyContent: 'flex-start',
        top: Size.m1,
    },
    swiperArrivals2: {
        height: height * 0.2 + 45,
        width: width / 2 - 23,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    iconList: {
        backgroundColor: Colors.FantasyNew,
        width: wp('20%'),
        height: width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Size.x78
    },
    locationIcon: {
        width: Size.m,
        height: Size.l - 1
    },
    horizontalListIcon: {
        height: height * 0.2 - 15,
        width: Platform.OS == 'ios' ? width * 0.4 + 17 : width * 0.4 + 15
    },
    bestAddContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: Size.x67 + 10,
        paddingHorizontal: Size.xm1
    },
    addButton: {
        width: Size.x67,
        marginRight: Size.xs2
    },
    deals: {
        fontSize: Size.xm1,
        color: Colors.White,
    },
    dealsButtonContainer: {
        marginLeft: Size.m0 + 1,
        position: 'absolute',
        backgroundColor: Colors.FerrariRed,
        height: Size.m1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Size.xxs,
        marginTop: Size.xm1
    },
    deliveryTitle: {
        textAlign: 'center',
        fontSize: 11,
        color: '#000',
        marginTop: 5,
    },
    priceTitle: {
        fontSize: Size.m,
        fontFamily: Typography.LatoBold
    },
    listTitle: {
        textAlign: 'center',
        fontSize: Size.m - 1,
        color: Colors.Dune,
    },
    icon: {
        width: Size.screenWidth / 2,
    },
    labelTitle: {
        fontSize: Size.m - 1.5,
        color: Colors.Black
    },
    flawersIcon: {
        width: wp('10%'),
        height: hp('7%')
    },
    listHorizotalCon: {
        marginVertical: Size.xm
    },
    bottomSheetCon: {
        paddingHorizontal: 15
    },
    croseIcon: {
        width: Size.m1,
        height: Size.m1
    },
    buttonLabel: {
        fontSize: Size.xm2 + 1
    },
    uaeIconStyle: {
        height: Size.xxxl,
        width: Size.xxxl
    },
    flowerBackIcon: {
        width: wp('100%'),
        height: width * 1.535
    },
    crouselButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: hp('20.4%')
    },
    crouselButtonRight: {
        marginRight: '25%'
    },
    crouselButtonLeft: {
        marginLeft: '25%',
    },
    slideMainContainer: {
        backgroundColor: Colors.FantasyNew,
        height: height * 0.37,
        paddingHorizontal: Size.x5l,
    },
    sliderContainer: {
        backgroundColor: Colors.White,
        borderTopRightRadius: Size.m,
        borderBottomLeftRadius: Size.m,
        paddingHorizontal: Size.xl,
        height: height * 0.21,
        borderWidth: 1,
        borderColor: Colors.Camel,
        justifyContent: 'center'
    },
    sliderTopTitle: {
        fontFamily: Typography.LatoBold,
        fontSize: Size.m011
    },
    sliderRatingIcon: {
        width: 74, height: 12
    },
    sliderBuyerName: {
        fontSize: Size.m,
        fontFamily: Typography.LatoBold
    },
    sliderOderOn: {
        fontSize: Size.m,
    },
    wrapperButton: {
        justifyContent: 'space-between',
        height: height * 0.20,
        width: '111%',
        left: '-5.5%',
    },
    onlineFDelivery: {
        height: hp('22.3%'),
    },
    sliderIcon: {
        height: height * 0.290,
        width: width * 0.604
    },
    sliderActiveDot: {
        width: Size.xm - 1,
        height: Size.xm - 1,
        top: '14%'
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    },
    luxuryFlowersContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('12%'),
        marginTop: 20
    },
    countryListCon: {
        marginLeft: wp('3%'),
    },
    countryIcon: {
        width: wp('13%'),
        height: hp('13%')
    },
    countryTitle: {
        textAlign: 'center',
        fontSize: 11,
        color: Colors.Black,
        marginTop: Size.xs3
    },
    teddyBearCon: {
        marginLeft: wp('3%'),
        width: width * 0.217
    },
    teddyBearIcon: {
        width: wp('10.5%'),
        height: hp('10.5%')
    },
    ListFooterStyle: {
        marginRight: wp('3%')
    },
    serviceProvide: {
        flexDirection: 'row',
    },
    serviceProvideIconList: {
        flexDirection: 'row',
        width: '100%'
    },
    deliveryIcon: {
        width: wp('10.5%'),
        height: hp('10.5%')
    },
    swiperButtonNext: {
        bottom: hp('4%'), left: '80%'
    },
    swiperButtonBack: {
        bottom: hp('4%'), right: '80%'
    },
    swiperIcon: {
        width: 32, height: 32
    },
    exploreButtonContainer: {
        alignItems: 'center',
    },
    exploreButton: {
        width: wp('34%'),
        backgroundColor: Colors.White,
        borderWidth: 1,
        borderColor: Colors.Camel,
        height: 40
    },
    exploreButtonTile: {
        color: Colors.Camel,
        fontSize: 14,
        fontFamily: Typography.LatoRegular
    },
    bottomListMainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('86%'),
        paddingHorizontal: '3.1%',
        marginTop: 10
    },
    bottomIconList: {
        backgroundColor: Colors.Camel,
        width: 57,
        height: 57,
        borderRadius: Size.x100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomListIcon: {
        width: 36,
        height: 36,
        tintColor: Colors.White
    },
    bottomListTitle: {
        flex: 1,
        paddingLeft: '4%'
    },
    oueStoryMonths: {
        fontSize: 14,
        color: Colors.Black,
        fontFamily: Typography.LatoBold
    },
    oruStoryDiscraption: {
        fontFamily: Typography.LatoRegular
    },
    prmiumFlowersBaner: {
        width: '93.8%',
        marginTop: Size.xm2,
        borderWidth: 1,
        borderColor: Colors.Camel,
        marginLeft: wp('3.1%'),
        borderTopLeftRadius: Size.m,
        borderBottomRightRadius: Size.m
    },
    prmiumFlowersBanerEmpty: {
        width: '93.8%',
        height: 92,
        marginTop: Size.xm2,
        marginLeft: ('3.1%'),
        borderTopLeftRadius: Size.m,
        borderBottomRightRadius: Size.m
    },
    bestSellersBaner: {
        width: '100%',
        height: 99,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15
    },
    plantsMakeFeelBetter: {
        fontSize: 15, fontFamily: Typography.LatoRegular
    },
    subscribeContainer: {
        backgroundColor: Colors.Fantasy,
        alignItems: 'center',
        marginHorizontal: '3.1%',
        paddingTop: 13,
        paddingBottom: 17,
        paddingHorizontal: 19
    },
    subscribe: {
        fontSize: 18,
        fontFamily: Typography.LatoBold,
    },
    signUptoget: {
        fontSize: 12,
    },
    videoControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumGiftIcon: {
        width: 60,
        height: 75
    },
    sliderButtonStyle: {
        backgroundColor: Colors.White,
        elevation: 5,
        shadowColor: '#00000029',
        justifyContent: 'center',
        alignItems: 'center',
        height: 26,
        width: 35,
    }
})