import { StyleSheet } from "react-native"
import { Colors, Size } from "../../../constants"

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    updateImg: {
        height: Size.m0p,
        width: Size.lp,
    },
    bell: {
        height: Size.x95,
        width: Size.x85,
    },
    closeBtn: {
        height: Size.x65,
        width: Size.x65,
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: Size.x67
    },

    loginText: {
        alignItems: "center",
        justifyContent: "center",
    },
    notificationDetail: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 135,
    },
    allowDetail: {
        fontSize: Size.m011,
        textAlign: "center",
        lineHeight: 22
    },
    allowBtn: {
        marginTop: 130,
        marginHorizontal: 32,
        borderRadius: 5
    },
    dontAllowBtn: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 13,
        marginBottom: 15,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: Colors.StormDust,
        marginHorizontal: 35,
        height: 50
    }
})