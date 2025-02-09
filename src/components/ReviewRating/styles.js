import { StyleSheet, Platform } from "react-native"
import { Colors, Size, Typography } from "../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
    slideMainContainer: {
        height: hp('38%'),
        paddingHorizontal: Size.x5l
    },
    starIcon: {
        height: 12.5,
        width: 12,
        // tintColor: Colors.Pizazz
    },
    spacerTop: {
        marginTop: Size.xl
    },
    title: {
        fontSize: Size.l - 2,
        fontFamily: Platform.OS == 'ios' ? null : Typography.LatoBold,
    },
    swiperIcon: {
        width: 32, height: 32
    },
    sliderContainer: {
        // backgroundColor: Colors.White,
        borderBottomLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: Colors.Tana,
        marginHorizontal: Size.x5l,
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
        fontFamily: Typography.LatoMedium
    },
    sliderOderOn: {
        fontSize: 14,
    },
    hitSlop: {
        top: 1, left: 1,
        bottom: 1, right: 1
    },
    dottedUnderlineContainer: {
        alignSelf: 'flex-start',
        marginTop: 3
    },
    readMoreText: {
        fontSize: 13.5,
        fontFamily: Typography.LatoMedium,
        color: Colors.BlueRibbon,
    },
    dottedUnderline: {
        height: 1,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BlueRibbon,
        borderStyle: 'dotted',
    },
    reviewContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeIconView: {
        backgroundColor: Colors.White,
        alignSelf: 'flex-end',
        padding: 7,
        borderRadius: 20,
        top: 20,
        zIndex: 999
    },
    reviewDescriptionView: {
        backgroundColor: Colors.White,
        width: '95%',
        borderRadius: 10,
        padding: 15
    },
    buttonWrapper: {
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 10,
        justifyContent: "space-between",
    },
    crouselButtonRight: {
        position: 'absolute',
        top: '55.5%',
        marginLeft: 15,
        opacity: 0.3
    },
    crouselButtonLeft: {
        position: 'absolute',
        top: '55.5%', right: 0,
        marginRight: 15,
        opacity: 0.3
    },
})