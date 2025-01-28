import { StyleSheet, Dimensions } from "react-native"
import { Size, Typography, Colors } from "../../../constants"

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
        fontSize: Size.x5l,
    },
    textContainer: {
        marginTop: 40,
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
        marginHorizontal: Size.xl,
        borderWidth: .8,
        borderColor: Colors.FrenchGrey,
        borderTopRightRadius: Size.m1,
        borderTopLeftRadius: Size.m1
    },
    inputPassContainer: {
        marginHorizontal: Size.xl,
        borderWidth: .8,
        borderColor: Colors.FrenchGrey,
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
        backgroundColor: Colors.Primary.Camel,
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
        borderColor: Colors.Primary.Camel,
        marginTop: Size.m1,
        height: Size.x66,
    },
    otpLabel: {
        fontSize: Size.m1,
        fontFamily: Typography.LatoBold,
        color: Colors.Primary.Camel,
        marginTop: Size.l,
        alignSelf: "center",
    },
    otherOptionContainer: {
        flexDirection: "row",
        marginTop: Size.xxxl,
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
        marginBottom: Size.xxxl
    },
    existCheckContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: Size.xl
    }
})