import { StyleSheet, Dimensions } from "react-native";
import { Colors, Typography, Size } from "../../../constants";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window")

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    renderContainer: {
        marginHorizontal: Size.xm1,
        borderColor: Colors.Secondary.Black,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 20,
        marginTop: Size.m
    },
    containContainer: {
        width: Size.x63,
        height: Size.x63,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: Size.m011,
        height: Size.m011
    },
    expendContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    subContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: Size.m011,
    },
    slideMainContainer: {
        backgroundColor: Colors.FantasyNew,
        marginTop: hp('4%'),
        height: hp('38%'),
        paddingHorizontal: Size.x5l
    },
    spacerTop: {
        marginTop: Size.xl
    },
    title: {
        fontSize: Size.l - 2,
        fontFamily: Platform.OS == 'ios' ? null : Typography.LatoBold,
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
    swiperIcon: {
        width: 32, height: 32
    },
    lodingCon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lodingStyle: {
        backgroundColor: Colors.White,
        padding: 5,
        borderRadius: 100,
        elevation: 4
    }
})