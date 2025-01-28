import { Dimensions, StyleSheet } from 'react-native'
import { Colors, Typography } from "../../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({

    textHeading: {
        fontSize: 18,
        fontFamily: Typography.RobotoBold,
        textAlign: "center"
    },
    ratingText: {
        fontSize: 13,
        fontFamily: Typography.LatoMedium,
        lineHeight: 22
    },
    brandBuiltRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 5,
        marginBottom: 23
    },
    exploreButton: {
        marginTop: 0,
        marginHorizontal: 0,
        paddingHorizontal: 40,
        height: 40,
        borderRadius: 6,
    },
    luxuryFlowersImages: {
        height: width * 0.480, width: width * 0.480,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
    },
    categoriesContainer: {
        borderWidth: 1,
        borderColor: Colors.CreamBrulee,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        marginLeft: wp('3%'),
        width: wp('94%'),
        marginTop: 30,
        height: 160
    },
    swiperContainer: {
        height: 300,
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
    shopByBaner: {
        marginTop: 17,
        marginHorizontal: wp('0%'),
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 9.5,
        borderBottomRightRadius: 9.5
    },
    shopByFlowerView: {
        backgroundColor: Colors.Fantasy,
        width: wp('23%'),
        paddingVertical: 8,
        alignSelf: 'center',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 2, // For Android
        zIndex: 999,
        bottom: 17,
        // iOS Shadow Properties
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.2, // Shadow opacity
        shadowRadius: 4, // Shadow blur
    },
    shopByImage: {
        width: wp('28%'),
        height: wp('28%'),
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 9,
        borderBottomRightRadius: 9
    },
    shopByRecipient: {
        marginTop: 17,
        marginHorizontal: wp('0%'),
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 11.5,
        borderBottomRightRadius: 11.5,
        backgroundColor: Colors.White,
        padding: 6,
        elevation: 2, // For Android
        zIndex: 999, shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.2, // Shadow opacity
        shadowRadius: 4, // Shadow blur
    },
    recipients: {
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 11,
        borderBottomRightRadius: 11,
    },
    recipientsImages: {
        width: wp('32%'),
        height: wp('32%'),
    },
    viewCollectionButton: {
        backgroundColor: Colors.White,
        height: 38,
        paddingHorizontal: 25,
        borderRadius: 4,
        marginTop: 0,
        alignSelf: 'center',
    },
    viewCollectionButtontTitle: {
        color: Colors.Black,
        fontSize: 15,
        fontFamily: Typography.LatoBold
    },
    flowerBackIcon: {
        width: '100%',
        height: 420
        // height: '55%'
    },
    crouselButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: hp('20.4%')
    },
    crouselButtonRight: {
        marginRight: '19%'
    },
    crouselButtonLeft: {
        marginLeft: '19%',
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
        marginTop: 25
    },
    swiperIcon: {
        width: 32, height: 32
    },
    video: {
        width: 950,
        height: 100,
    },
    fristSwiper: {
        width: width - 24,
        height: 268,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginLeft: 12
    },
    productSliderView: {
        marginTop: 0,
        marginHorizontal: 0,
        paddingHorizontal: 14,
        height: 38,
        borderRadius: 0,
        minWidth: 125,
        marginLeft: 10,
        borderWidth: 1,
    },
    productSliderMainView: {
        backgroundColor: Colors.WhiteLinen,
        marginVertical: 25,
        paddingVertical: 25,
    },
    loadingMainContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: "100%",
        width: "100%",
        position: "absolute"
    },
})