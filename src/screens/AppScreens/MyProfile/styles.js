import { StyleSheet } from "react-native"
import { Colors, Size } from "../../../constants"

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    arrow: {
        height: Size.xl,
        width: Size.xl,
        // backgroundColor:"red"
    },
    editlabel: {
        fontSize: Size.m011,
        marginLeft: Size.xxs,
        color: Colors.Secondary.Black
    },
    profileName: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: Size.xm,
        
    },
    profileIcon: {
        alignSelf: "center",
        marginTop: Size.xxxl,
        borderWidth: 4,
        borderColor: Colors.Secondary.Black,
        borderRadius: Size.x78,
    },
    subContainer: {
        // marginTop: Size.xl,
        marginHorizontal: Size.xm1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    editContainer: {
        flexDirection: "row",
        borderWidth: 1,
        padding: Size.xs3,
        borderColor: Colors.Secondary.Black,
        borderRadius: Size.xs2,
        marginRight: 8
    },
    edit: {
        height: Size.l,
        width: Size.l,
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
    inputContainer: {
        borderWidth: null,
        marginLeft: Size.l
    },
    regularStyle: {
        fontSize: Size.m11,
        marginLeft: Size.m1,
        color: Colors.StormDust
    },
    containContainer: {
        marginTop: Size.m1,
        flexDirection: "row",
        alignItems: "center"
    },
    subContain: {
        marginTop: Size.m,
        flexDirection: "row",
        alignItems: "center"
    },
    decentProfile: {
        height: Size.x140,
        width: Size.x140,
        borderRadius: Size.x70
    }
})