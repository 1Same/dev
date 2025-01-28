import { Dimensions, StyleSheet } from "react-native"
import { Colors, Size, Typography } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window')

export default styles = StyleSheet.create({


    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },

    headerContainer: {
        paddingHorizontal: Size.xm1,
        // paddingVertical: 5
    },
    orderHistoryContainer: {
        backgroundColor: Colors.White,
        borderWidth: 1,
        borderColor: Colors.GreyGoose,
        marginHorizontal: Size.m1,
        borderRadius: Size.xm,
        marginTop: Size.m11,
        bottom: Size.m11

    },
    titleStyle: {
        fontFamily: Typography.LatoBold,
        fontSize: Size.m011,
        color: Colors.Dawn
    },
    gfId: {
        fontFamily: Typography.LatoMedium,
        fontSize: Size.m011,
    },

    spacer: {
        marginTop: Size.xs2
    },
    titleStyle2: {
        fontFamily: Typography.LatoBold,
        fontSize: Size.m1,
    },
    productIdDeliveredCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    deliveredSuccessIcon: {
        width: Size.m1,
        height: Size.m1,
    },
    totalAmountContainer: {
        marginTop: Size.xm,
        backgroundColor: Colors.FantasyNew,
        height: Size.x67 + 10,
        paddingHorizontal: Size.xm1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomLeftRadius: Size.xm,
        borderBottomRightRadius: Size.xm
    },
    button: {
        backgroundColor: Colors.BoringGreen,
        width: Size.x78 - 5,
        height: Size.x64,
        borderRadius: Size.l
    },
    amount: {
        fontSize: Size.m11,
        fontFamily: Typography.LatoBold,
        lineHeight: Size.xxl
    },
    amountTitle: {
        fontSize: Size.m011 - 1,
        color: Colors.Dawn,
        fontFamily: Typography.LatoMedium,
        lineHeight: Size.xxl

    },

    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '93%',
        borderWidth: 1,
        borderColor: Colors.Secondary.Black,
        borderRadius: 10,
        marginHorizontal: '3.5%',
    },
    filterButton: {
        backgroundColor: Colors.Secondary.Black,
        borderRadius: 0,
        width: wp('14%'),
        flex: 1,
        height: 45,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    InputTextCon: {
        // backgroundColor: "blue",
        width: '85%',
        marginHorizontal: 0,
        borderWidth: 0,
        paddingLeft: 10
    },
    deliveredContainer: {
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderRadius: Size.xm2,
        marginHorizontal: '3.5%',
        paddingTop: Size.xm1,
        marginTop: Size.m1,
        paddingBottom: '2%'
    },
    delivered: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    deliveryData: {
        flexDirection: "row",
        alignItems: 'center'
    },
    deliveredTitle: {
        fontFamily: Typography.LatoBold,
        fontSize: 15
    },
    orderId: {
        fontSize: 12
    },
    orderIdData: {
        fontSize: 12,
        fontFamily: Typography.LatoBold
    },
    historyRowContainer: {
        justifyContent: 'space-between',
    },
    recivedName: {
        fontSize: 12,
        lineHeight: 18,
    },
    recivedData: {
        fontSize: 12,
        fontFamily: Typography.LatoBold,
        lineHeight: 18
    },
    oderIcon: {
        width: 79,
        height: 79,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    rowColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Size.xs
    },
    flowerBoxTitle: {
        fontSize: 14,
        fontFamily: Typography.LatoBold,
        color: Colors.DoveGrayNew
    },
    flowerBoxMainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '2%',
        paddingHorizontal: '2%',
    },
    flowerBoxContainer: {
        flex: 1,
        paddingLeft: '3%'
    },
    listContainer: {
        borderTopWidth: 1,
        borderColor: Colors.Camel,
        borderBottomWidth: 1,
        marginTop: Size.xs2,
        borderBottomLeftRadius: Size.xm2,
        backgroundColor: Colors.Fantasy,
        paddingVertical: 5,
        borderBottomRightRadius: Size.xm2
    },
    boder: {
        height: 1,
        backgroundColor: Colors.Silver,
        width: '95%',
        marginTop: 0,
        marginLeft: '2.5%'
    },
    buttonTitle: {
        fontSize: Size.m0,
        fontFamily: Typography.LatoRegular
    },
    searchIcon: {
        width: Size.l,
        height: Size.m11,
    },
    amountContainer: {
        marginVertical: 15,
        marginLeft: wp('3.1%')
    }

})