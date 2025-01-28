import { StyleSheet, Dimensions } from "react-native"
import { Colors, Typography, Size } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width,height } = Dimensions.get("window")

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    topContainer: {
        marginTop: Size.xm2
    },
    regularStyle: {
        fontSize: Size.m1,
        color: Colors.BlackCow
    },
    bulletContainer: {
        marginTop: Size.xm2,
        flexDirection: "row",
        alignItems: "center"
    },
    iconStyle: {
        height: Size.xm,
        width: Size.xm,
    },
    regularText: {
        fontSize: Size.m1,
        color: Colors.BlackCow,
        width: wp('85%'),
        marginLeft: Size.xs3
    },
    boldStyle: {
        fontSize: Size.l,
        color: Colors.BlackCow
    },
    boldS: {
        fontSize: Size.m011,
        color: Colors.BlackCow,
    },
    regularS: {
        fontSize: Size.m011,
        color: Colors.BlackCow,
        marginLeft: Size.xs3
    },
    bulletMainContainer: {
        marginTop: Size.l,
        flexDirection: "row",
        alignItems: "center"
    },
    slideMainContainer: {
        backgroundColor: Colors.FantasyNew,
        // height: "38%",
        marginTop:hp('4%'),
        height: hp('38%'),
        // height: height * 0.38,
        paddingHorizontal: Size.x5l
    },
    spacerTop: {
        marginTop: Size.xl
    },
    title: {
        fontSize: Size.l - 2,
        fontFamily: Platform.OS == 'ios' ? null : Typography.LatoBold,
        // textAlign: 'center'
    },
    sliderContainer: {
        backgroundColor: Colors.White,
        borderTopRightRadius: Size.m,
        borderBottomLeftRadius: Size.m,
        paddingHorizontal: Size.xl,
        height: height * 0.21,
        borderWidth: 1,
        borderColor: Colors.Camel,
        justifyContent: 'center',
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
    swiperButtonNext: {
        bottom: hp('4%'), left: '80%'
    },
    swiperButtonBack: {
        bottom: hp('4%'), right: '80%'
    },
    swiperIcon:{
        width: 32, height: 32 
    }
})