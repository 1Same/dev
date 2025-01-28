import { StyleSheet, Dimensions } from "react-native"
import { Size, Colors, Typography } from "../../../constants"

const { width } = Dimensions.get('window')

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentFailedView: {
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderTopLeftRadius: 11,
        borderBottomRightRadius: 11,
        alignItems: 'center',
        backgroundColor: Colors.WhiteLinen,
        paddingHorizontal: 12,
        marginHorizontal: 11
    },
    paymentFailedLinkContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.JellyBean
    },
    paymentTopTitle: {
        fontSize: 19,
        fontFamily: Typography.LatoBold,
    },
    paymentFailedBottomSpace: {
        marginTop: 0,
        height: 22,
        width: '100%'
    },
    paymentDescription: {
        textAlign: 'center',
        lineHeight: 20
    },
    failedIcon: {
        width: 50,
        height: 50
    },
    paymentLink: {
        color: Colors.Red,
        fontFamily: Typography.LatoBold,
        fontSize: 16
    },
    paymentLinkDes: {
        marginLeft: 0,
        color: Colors.JellyBean,
        fontFamily: Typography.LatoBold,
        fontSize: 16
    },


})
