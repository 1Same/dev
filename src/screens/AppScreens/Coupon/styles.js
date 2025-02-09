import { StyleSheet, Dimensions } from "react-native"
import { Colors, Size } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window')

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    // applyContain: {
    //     // height: hp('5.5%'),
    //     height: height * 0.050,
    //     // height: Size.x38,
    //     backgroundColor: Colors.Primary.Camel,
    //     marginTop: hp('1.2%'),
    //     alignItems: "center",
    //     justifyContent: "center",
    //     paddingHorizontal: wp('4%'),
    //     borderRadius: 8,

    // },
    applyContain: {
        height: hp('5%'),
        // height: height * 0.050,
        // height: "85%",
        // paddingVertical: "2.4%",
        // height: 20,
        backgroundColor: Colors.Secondary.Black,
        // marginTop: hp('1.2%'),
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: wp('4%'),
        // paddingVertical: wp('2%'),
        borderRadius: 3,

    },
    borderContain: {
        marginTop: Size.xm2,
        height: .5,
        backgroundColor: Colors.MountainMist,
        // marginTop: Size.xm,
        marginHorizontal: Size.m011
    },
    inputContainer: {
        borderRadius: 4,
        marginHorizontal: null,
        backgroundColor: Colors.White,
    },
    codeInput: {
        paddingLeft: wp('2%'),
        fontSize: Size.m1,
        fontFamily: Typography.LatoRegular,
        paddingVertical: hp('.8%'),
        color: Colors.Black
    },

    // InputContiner: {
    //     marginTop: hp('1.5%'),
    //     borderWidth: .8,
    //     borderColor: Colors.FrenchGrey,
    //     flex: 0.990,
    //     height:hp('5%'),
    //     borderRadius: 5,
    //     backgroundColor: Colors.White,
    //     shadowColor: "#000",
    //     shadowOffset: {
    //         width: 0,
    //         height: 4,
    //     },
    //     shadowOpacity: 0.32,
    //     shadowRadius: 5.46,

    //     elevation: 9
    // },
    InputContiner: {
        borderWidth: .8,
        borderColor: Colors.FrenchGrey,
        flex: 0.990,
        height: hp('5%'),
        borderRadius: 5,
        backgroundColor: Colors.White,
    },
    renderContainer: {
        marginVertical: hp('1%'),
        backgroundColor: Colors.White,
        borderWidth: 1,
        borderColor: Colors.GreyGoose,
        paddingVertical: 18
    },
    couponContainer: {
        height: hp('6.5%'),
        width: wp('81%'),
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#00000080",
        backgroundColor: Colors.White,
        marginLeft: wp('3.5%'),
        borderRadius: 8,
        justifyContent: 'center'
    },
    // couponContainer: {
    //     height: hp('6%'),
    //     width: wp('36%'),
    //     borderWidth: 1,
    //     borderStyle: "dashed",
    //     borderColor: "#00000080",
    //     marginTop: Size.l,
    //     backgroundColor: Colors.White,
    //     marginHorizontal: Size.m011,
    //     flexDirection: "row",
    //     borderRadius: 8
    // },
    buttonContainer: {
        borderRadius: 3,
        width: wp('50%'),
        marginLeft: 14,
        // marginHorizontal: wp('4%'),
        height: hp('6%'),
        marginTop: 13
    },
    couponCodeContainer: {
        marginTop: hp('2%'),
        marginHorizontal: wp('2.3%'),
        // marginTop: Size.m011,
        // marginHorizontal: Size.xm2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    inputMainContainer: {
        marginTop: hp('3%'),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: wp('5.5%')
    },
    codeContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 12,
        alignItems: "center",
    },
    iconContainer: {
        position: "absolute",
        top: hp('.8%'),
        right: wp('-4.3%')
    },
    lodingCon: {
        flex: 1,
        // height:'100%',
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