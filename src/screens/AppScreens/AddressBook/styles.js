import { StyleSheet } from "react-native"
import { Colors, Size } from "../../../constants"

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    headerContainer: {
        marginHorizontal: Size.m,
    },
    touchContiner: {
        marginHorizontal: Size.m011,
        backgroundColor: Colors.Bianca,
        marginVertical: Size.xm1,
        borderWidth: 1,
        borderColor: Colors.GreyGoose,
        borderRadius: 10,
        paddingHorizontal: Size.m,
        paddingVertical: Size.xl,
        marginTop: 10
    },
    iconContain: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: Size.xl
    },
    iconStyle: {
        width: Size.l,
        height: Size.l,
        tintColor: Colors.Secondary.Black
    },
    iconView: {
        width: Size.x38,
        height: Size.x38,
        backgroundColor: Colors.White,
        borderWidth: 1,
        borderColor: Colors.Secondary.Black,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
})