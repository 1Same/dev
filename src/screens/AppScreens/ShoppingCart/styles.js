import { StyleSheet } from "react-native"
import { Colors, Size, Typography } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    cartMainView: {
        borderWidth: 0.5,
        borderColor: Colors.BorderColor,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        margin: 10
    },
    arrow: {
        height: 20,
        width: 18,
    },
    cartIdContain: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 0,
        paddingVertical: 4,
    },
    inputCouponCodeContiner: {
        borderWidth: .8,
        borderColor: Colors.FrenchGrey,
        borderRadius: 5,
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40
    },
    cartItemContain: {
        backgroundColor: Colors.White,
        paddingTop: 5,
        paddingHorizontal: Size.xm,
    },
    deliveryDetailContain: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3
    },
    deliveryDetailStyle: {
        fontSize: 14,
    },
    subTotalContain: {
        alignItems: "center",
        marginTop: Size.m,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    personalizedMessage: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5
    },
    deliveryDetailText: {
        fontSize: 14.5,
        color: Colors.DuneLight
    },
    totalAmount: {
        backgroundColor: Colors.WhiteLinen,
        paddingHorizontal: 6,
        paddingVertical: 8,
        marginTop: 10
    },

    // coupon code style===
    applyContain: {
        height: 40,
        backgroundColor: Colors.Secondary.Black,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 25,
        borderRadius: 3,
        marginTop: 0,
        marginHorizontal: 0
    },
    borderContain: {
        marginTop: Size.xm2,
        height: .5,
        backgroundColor: Colors.MountainMist,
    },

    codeInput: {
        paddingLeft: wp('2%'),
        fontSize: 14,
        fontFamily: Typography.LatoRegular,
        paddingVertical: hp('.8%'),
        color: Colors.Black,
        flex: 1,
    },
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
    buttonContainer: {
        borderRadius: 3,
        width: wp('45%'),
        marginLeft: 14,
        height: hp('5%'),
        marginTop: 13
    },
    couponCodeContainer: {
        paddingHorizontal: wp('3%'),
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.WhiteLinen
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
    orderSummaryView: {
        marginHorizontal: Size.xm2,
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: Size.xm2,
        marginTop: 25
    },
    summaryBorder: {
        borderWidth: 1.4, width: 90,
        alignSelf: 'center', marginTop: 10,
        borderColor: Colors.BorderColor,
        backgroundColor: Colors.BorderColor
    },
    //quantityButton 
    buttonContaine: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-evenly",
        borderWidth: 0.5,
        borderColor: Colors.Black,
        borderRadius: 9,
    },
    incrementButton: {
        fontSize: 18,
        color: Colors.Black,
        fontFamily: Typography.LatoBold
    },
    hitSlop: {
        top: Size.xm,
        bottom: Size.xm,
        left: Size.xm,
        right: Size.xm
    },
    butonContainView: {
        backgroundColor: Colors.WhiteLinen,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 25
    },
    decBorderRadius: {
        borderTopLeftRadius: 9,
        borderBottomLeftRadius: 9
    },
    incBordeRradius: {
        borderTopRightRadius: 9,
        borderBottomRightRadius: 9
    },
    // cartEmpty
    cartEmptyarrow: {
        height: Size.x138,
        width: Size.x138,
    },

    btnStyle: {
        marginTop: Size.x4l,
        borderRadius: Size.xxs,
        width: wp('92%'),
        marginHorizontal: wp("4%"),
        height: 48
    },
    mainEmptyCart: {
        flex: 1,
        alignItems: 'center',
        marginTop: '42%'
    },
    emptyCartDetail: {
        textAlign: "center",
        color: Colors.SmokeyGrey
    },
    borderView: {
        height: 8,
        marginTop: 15,
        backgroundColor: Colors.GreyGoose,
    },

    productFeatureContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 12,
    },
    deleteContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2
    },
    borderHeight: {
        width: .8,
        height: 30,
        backgroundColor: Colors.GreyGo,
        borderWidth: 1,
        borderRadius: 10
    },

    applyCouponContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 22,
        marginHorizontal: 10,
        justifyContent: 'space-between',
        backgroundColor: Colors.Harp,
        padding: 12,
        borderRadius: 5
    },
    proceedToCheckContainer: {
        height: 125,
        backgroundColor: Colors.White,
        shadowColor: Colors.GreyGo,
        shadowOffset: {
            width: 0,
            height: -5
        },
        shadowOpacity: 0.32,
        shadowRadius: 2,
        elevation: 15,
    },
    boldStyle: {
        fontSize: 13.5, color: Colors.RossoCorsa
    },
    error: {
        color: Colors.Red,
        fontSize: 13
    },

    // Message Cart
    inputLength: {//
        textAlign: 'right',
        marginHorizontal: 21,
        fontSize: 13,
        fontFamily: Typography.LatoMedium
    },
    messageSubmit: {//
        backgroundColor: Colors.Black,
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginHorizontal: 19,
        marginTop: 15
    }

})

//unUsage Css=============
// inputLength: {//
//     textAlign: 'right',
//     marginHorizontal: 21,
//     fontSize: 13
// },

// messageSubmit: {//
//     backgroundColor: Colors.Black,
//     paddingVertical: 10,
//     paddingHorizontal: 17,
//     borderRadius: 10,
//     alignSelf: 'flex-end',
//     marginHorizontal: 19,
//     marginTop: 15
// }
// personalizedMsgMainView: {//
//     flexDirection: "row",
//     height: 67,
//     marginTop: 8,
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderColor: Colors.GreyGo,
//     borderWidth: .5,
//     paddingHorizontal: 8
// },
// composeView: {//
//     backgroundColor: Colors.Black,
//     height: 41,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 5,
//     width: 105,
// },
// borderContainer: {//
//     marginTop: 10,
//     height: 6,
//     backgroundColor: Colors.GreyGo
// },
// titleView: {//
//     alignSelf: "center", justifyContent: "center", marginTop: 15
// },
// container: {//
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: Size.x67
// },
// loginText: {//
//     alignItems: "center",
//     justifyContent: "center",
// },
// lodingCon: {//
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
// },
// lodingStyle: {//
//     backgroundColor: Colors.White,
//     padding: 5,
//     borderRadius: 100,
//     elevation: 4
// },

// discountBtnContain: {//
//     height: hp('18%'),
//     backgroundColor: Colors.Fantasy,
//     borderRadius: 8,
//     marginTop: hp('2%'),
//     paddingTop: hp('2%'),
//     paddingHorizontal: wp('2%'),
//     borderWidth: .8,
//     borderRadius: 8,
//     borderColor: Colors.Primary.Camel
// },
// placeHolderStyle: {//
//     width: Size.x280,
//     height: Size.x62,
//     backgroundColor: Colors.White,
//     paddingTop: Size.xs2,
//     paddingHorizontal: Size.xm1,
//     borderWidth: .8,
//     borderRadius: 5,
//     borderColor: "#58585880",
// },
// productTitle: {//
//     marginTop: 5,
// },
// starIcon: {//
//     height: 14,
//     width: 15
// },
// headerContainer: {//
//     marginHorizontal: Size.xm1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between"
// },
// counterContain: {//
//     flexDirection: "row",
//     alignItems: "center",

// },
// containContainer: {//
//     marginTop: Size.m1,
//     flexDirection: "row",
//     alignItems: "center"
// },
// SubContain: {//
//     width: Size.x70,
//     height: Size.x4l,
//     flexDirection: "row",
//     borderWidth: 0.5,
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: Size.xs3,
//     borderColor: Colors.FrenchGrey,
//     borderRadius: 5
// },
// cityContain: {//
//     flexDirection: 'row',
//     height: 44,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.NoneOne
// },
// radioBtnContain: {//
//     height: Size.xl,
//     width: Size.xl,
//     borderRadius: 11,
//     borderWidth: 2,
//     justifyContent: 'center',
//     alignItems: 'center'
// },
// radioBtn: {//
//     height: Size.m,
//     width: Size.m,
//     borderRadius: 6,
// },
// counterIcon: {//
//     height: Size.xm2,
//     width: Size.xm2
// },
// occasionContain: {//
//     marginTop: Size.m011,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: width / -70,
//     height: Size.x65,
//     borderWidth: 1,
//     borderColor: "#58585880",
//     paddingHorizontal: Size.xm1,
//     borderRadius: 5,
// },
// messageInput: {//
//     height: Size.x95,
//     padding: null,
//     paddingHorizontal: Size.xm1,
//     paddingTop: Size.l,
//     color: Colors.Black
// },
// senderContain: {//
//     marginTop: Size.xm2,
//     width: Size.x340,
//     height: Size.x48,
//     borderWidth: 1,
//     borderColor: "#58585880",
//     borderRadius: 5,
//     padding: Size.m
// },
// btnContainer: {//
//     marginTop: Size.xxl,
//     marginBottom: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: 'flex-end',
// },
// checkoutBtn: {//
//     marginBottom: null,
//     justifyContent: "center",
//     marginTop: 16,
//     marginHorizontal: 10,
//     borderRadius: 5,
//     height: 48
// },
// inputContainer: {//
//     borderRadius: 4,
//     marginHorizontal: null,
//     backgroundColor: Colors.White,
// },