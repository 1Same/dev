import { Dimensions, StyleSheet, Platform } from "react-native"
import { Colors, Size, Typography } from "../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window')

export default styles = StyleSheet.create({
    slideMainContainer: {
        // backgroundColor: Colors.FantasyNew,
        marginTop: hp('4%'),
        height: hp('90%'),
        paddingHorizontal: Size.x5l
    },
    starIcon: {
        height: 14,
        width: 14,
    },
    spacerTop: {
        marginTop: Size.xl
    },
    title: {
        fontSize: Size.l - 2,
        fontFamily: Platform.OS == 'ios' ? null : Typography.LatoBold,
        // textAlign: 'center'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        width: wp('100%'),
        // backgroundColor:"red",
        top: '48%',
    },

    swiperIcon: {
        width: 32, height: 32
    },
    sliderContainer: {
        // backgroundColor: Colors.White,
        // borderRadius: 18,
        paddingHorizontal: Size.xl,
        paddingVertical: 15,
        // marginTop: 10
        // borderWidth: 1,
        // borderColor: Colors.Camel,
        // justifyContent: 'center',
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
    hitSlop: {
        top: 1, left: 1,
        bottom: 1, right: 1

    }
})