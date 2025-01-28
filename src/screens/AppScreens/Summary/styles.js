import { StyleSheet, Dimensions } from "react-native"
import { Size, Colors, Typography } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('screen')

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    deliveryDetailText: {
        fontSize: 15,
        color: Colors.DuneLight
    },
    headerContainer: {
        marginHorizontal: Size.m,
    },
    button: {
        borderRadius: 3,
        marginTop: null,
        justifyContent: "center",
        marginHorizontal: 13,
        height: 52,
    },
    proccessUpdateView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 6
    },
    borderView: {
        height: 8,
        marginTop: 15,
        backgroundColor: Colors.GreyGoose,
    },
    mainProductDetailView: {
        borderWidth: 1,
        marginHorizontal: 15,
        borderColor: Colors.PaleSlate,
        backgroundColor: Colors.White,
        bottom: 28
    },
    productDetailView: {
        flexDirection: "row",
        marginTop: 10,
        marginHorizontal: 12,
    },
    productSubDetail: {
        flexDirection: "row",
        marginLeft: 10,
        flex: 1,
        justifyContent: "space-between",
    },
    thinBorder: {
        height: Size.xs,
        marginTop: 10,
        marginHorizontal: 12,
        backgroundColor: Colors.GreyGo,
    },
    deliveryDetail: {
        marginTop: 12, flexDirection: "row", marginHorizontal: 12
    },
    personalizedMsgView: {
        backgroundColor: Colors.Fantasy,
        opacity: .6,
        paddingHorizontal: 12,
        paddingBottom: 18
    },
    orderSummaryView: {
        marginTop: 22,
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    chargesDetail: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        marginTop: 2
    },
    chargesTitleStyle: {
        fontSize: 15, color: Colors.DuneLight
    },
    proccessCountView: {
        marginTop: 15,
        flexDirection: "row",
        marginHorizontal: 22,
        justifyContent: "center",
        alignItems: "center"
    },
    mainProcessBarCount: {
        marginTop: 15,
        flexDirection: "row",
        marginHorizontal: 50,
        justifyContent: "space-between",
        alignItems: "center"
    },
    countView: {
        backgroundColor: Colors.ClearBlue,
        height: 25,
        width: 24,
        borderRadius: 20,
        justifyContent: "center"
    },
    borderViewStyle: {
        backgroundColor: Colors.ClearBlue,
        height: 1,
        opacity: .6,
        flex: 1
    },
    countStyle: {
        color: Colors.White,
        fontSize: 12,
        textAlign: "center",
    },
    chargesDetailMainView: {
        marginHorizontal: 10, marginTop: 15, marginBottom: "15%"
    },
    buttonView: {
        height: 48,
        justifyContent: "center",
        backgroundColor: Colors.White,
        shadowColor: 'rgba(0,0,0,10)',
        shadowOffset: {
            width: 0,
            height: -2
        },
        shadowOpacity: 5,
        shadowRadius: 2,
        elevation: 10,
    },
    cartIdContainer: {
        alignItems: "center",
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingTop: 5,
        width: 75,
        height: 58,
        marginTop: 18,
        marginLeft: 15,
        backgroundColor: Colors.White,
        borderWidth: .5,
        borderColor: Colors.MountainMist
    },
    subTotalContain: {
        alignItems: "center",
        marginTop: Size.m,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginRight: 10
    },
    dateStyle: {
        fontSize: 16.4, color: Colors.DuneLight
    },
    hitSlop:{
        top:10,left:10,right:10,bottom:10
    }
})
