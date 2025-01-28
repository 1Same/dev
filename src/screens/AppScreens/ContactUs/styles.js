import { StyleSheet, Dimensions } from "react-native"
import { Colors, Typography, Size } from "../../../constants"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window")

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    subContain: {
        marginTop: Size.m,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: wp('3%'),
        // marginHorizontal: 5,
    },
    regularStyle: {
        fontSize: Size.m0,
        marginLeft: Size.xs3,
        color: Colors.MirageBlue
    },
    dotView: {
        height: 1.5,
        width: 5,
        backgroundColor: Colors.Black,
        borderRadius: 10
    },
    cityContainer: {
        alignSelf: "center",
        justifyContent: "center",
        marginTop: Size.m011
    },
    branchView: {
        flexDirection: "row",
        alignItems: "center"
    },
    iconView: {
        backgroundColor: "black",
        borderRadius: 25,
        padding: Size.xm2
    },
    iconStyle: {
        height: Size.l,
        width: Size.xl,
    },
    labelStyle: {
        color: Colors.BlackCow,
        marginLeft: Size.xs3
    },
    slideMainContainer: {
        backgroundColor: Colors.FantasyNew,
        // height: "38%",
        marginTop:hp('6.7%'),
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