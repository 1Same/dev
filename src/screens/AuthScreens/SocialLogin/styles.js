import { StyleSheet, Dimensions } from "react-native"
import { Colors, Typography, Size } from "../../../constants"

const { width } = Dimensions.get("window")

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    logo: {
        height: Size.x66,
        width: Size.m1p,
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: Size.x67
    },
    heaveyLabel: {
        fontSize: 36,
    },
    textContainer: {
        marginTop: Size.x65,
        alignItems: "center",
        justifyContent: "center",
    },
    loginText: {
        alignItems: "center",
        justifyContent: "center",
    },
    regularLabel: {
        fontSize: Size.xxl,
    },
    inputContainer: {
        marginTop: Size.x62,
        borderTopRightRadius: Size.m1,
        borderTopLeftRadius: Size.m1
    },
    inputPassContainer: {
        borderBottomRightRadius: Size.m1,
        borderBottomLeftRadius: Size.m1,
    },
    inputStyle: {
        fontSize: Size.m1,
        fontFamily: Typography.LatoRegular,
        padding: Size.m1,
        height: Size.x67
    },
    forgotLabel: {
        fontSize: Size.m0,
    },
    optionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: Size.xl,
        marginTop: Size.xm1
    },
    buttonContainer: {
        marginHorizontal: Size.l,
        backgroundColor: Colors.Secondary.Black,
        borderRadius: Size.xm,
        marginTop: Size.xxxl,
        height: Size.x66,
    },
    loginLabel: {
        fontSize: Size.m1,
        fontFamily: Typography.LatoBold,
        color: Colors.White,
        marginTop: Size.l,
        alignSelf: "center",
    },
    otpBtnContainer: {
        marginHorizontal: Size.l,
        backgroundColor: Colors.White,
        borderRadius: Size.xm,
        borderWidth: 1,
        borderColor: Colors.Secondary.Black,
        marginTop: Size.m1,
        height: Size.x66,
    },
    otpLabel: {
        fontSize: Size.m1,
        fontFamily: Typography.LatoBold,
        color: Colors.Secondary.Black,
        paddingTop: Size.l,
        alignSelf: "center",
    },
    otherOptionContainer: {
        flexDirection: "row",
        marginTop: Size.m1,
        marginHorizontal: Size.l,
        alignItems: "center",
    },
    emtyView: {
        height: Size.xs,
        width: "44%",
        backgroundColor: Colors.SmokeyGrey
    },
    socialBtn: {
        marginTop: Size.m1,
        marginBottom: Size.m1
    },
    lodingCon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lodingStyle: {
        marginBottom: 15,
        backgroundColor: Colors.White,
        padding: 5,
        borderRadius: 100,
        elevation: 4
    }
})