import { StyleSheet, Platform } from "react-native"
import { Size, Colors } from "../../../constants"


export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    arrow: {
        height: Size.xl,
        width: Size.xl,
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    loginText: {
        alignItems: "center",
        justifyContent: "center",
    },
    otpContainer: {
        width: '15%',
        color: Colors.Black,
        height: Platform.OS == 'ios' ? 55 : 52,
        borderWidth: 1,
        fontSize: 22,
        borderColor: Colors.FrenchGrey,
        borderRadius: 12,
        paddingLeft: '6%',
    },
    hitSlop: {
        top: 8,
        bottom: 8,
        left: 8,
        right: 8
    }
})