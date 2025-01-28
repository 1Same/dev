import { Platform, StyleSheet } from "react-native"
import { Colors, Size } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    arrow: {
        height: Size.xl,
        width: Size.xl,
    },
    editContainer: {
        flexDirection: "row",
        borderWidth: 1,
        padding: Size.xs3,
        borderColor: Colors.Primary.Camel,
        borderRadius: 7
    },
    inputContainer: {
        borderWidth: null,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: Size.xm,
        height: Platform.OS == 'ios' ? 43 : 41
    },
    editInput: {
        alignSelf: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: Size.xs3,
        borderColor: Colors.Primary.Camel,
        position: "relative",
        bottom: Size.m1,
        flexDirection: "row",
        backgroundColor: Colors.White,
        width: Size.x150,
        height: Size.x5l,
        padding: Size.xs3
    },
    profileContainer: {
        alignSelf: "center",
        marginTop: Size.x63,
        borderWidth: 4,
        borderColor: Colors.Primary.Camel,
        borderRadius: Size.x78
    },
    headerContainer: {
        marginHorizontal: Size.xm1,
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
    },
    cityContain: {
        flexDirection: 'row',
        height: Size.x38,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.NoneOne
    },
    radioBtnContain: {
        height: Size.xl,
        width: Size.xl,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    radioBtn: {
        height: Size.m,
        width: Size.m,
        borderRadius: 6,
    },
    openSansLabel: {
        marginHorizontal: Size.xm2,
        marginTop: Size.xm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    countryContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: "53%",
        borderBottomWidth: 1,
        borderColor: Colors.Silver,
    },
    borderStyle: {
        height: Size.xs,
        backgroundColor: Colors.Silver,
        marginHorizontal: Size.m,
        marginTop: Size.xm1
    },
    errorText: {
        color: Colors.FerrariRed,
        fontSize: 13
    },
    codeContain: {
        flexDirection: "row",
        alignItems: "center",
        height: "98%",
        borderBottomWidth: 1,
        borderColor: Colors.Silver
    },
    spacer: {
        marginTop: 15,
        height: 5,
        backgroundColor: Colors.Silver
    },
    inputPlaceholder: {
        padding: null,
        marginHorizontal: Platform.OS == 'ios' ? 6 : 2,
    },
    rowInputView: {
        // marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 19,
        justifyContent: 'space-between'
    },
    inputView: {
        width: wp('42.5%')
    },
    citiesTopBorder: {
        borderWidth: 1,
        width: '94%',
        height: 0.2,
        marginVertical: 10,
        backgroundColor: Colors.GreyGoose,
        marginLeft: '3%',
    },
})