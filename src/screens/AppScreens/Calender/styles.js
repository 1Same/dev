import { StyleSheet } from "react-native"
import { Colors, Size } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    headerContainer: {
        marginHorizontal: Size.m,
    },
    boldStyle: {
        color: Colors.Dawn
    },
    regularstyle: {
        fontSize: Size.m011
    },
    touchContiner: {
        marginHorizontal: Size.m011,
        backgroundColor: Colors.Bianca,
        marginVertical: Size.xs2,
        borderWidth: 1,
        borderColor: Colors.GreyGoose,
        borderRadius: 10,
        paddingHorizontal: Size.m,
        paddingVertical: Size.m11,
        marginTop: 10
    },
    iconContain: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: Size.xl
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
    container: {
        flexDirection: "row",
    },
    iconStyle: {
        width: Size.l,
        height: Size.l,
        tintColor: Colors.Secondary.Black
    },
})