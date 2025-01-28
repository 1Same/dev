import { StyleSheet } from "react-native"
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
        borderColor: Colors.Secondary.Black,
        borderRadius: 7,
        alignItems: 'center',
        marginRight: 10
    },
    inputContainer: {
        borderWidth: null,
        marginLeft: Size.l,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    editInput: {
        alignSelf: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: Size.xs3,
        borderColor: Colors.Secondary.Black,
        position: "relative",
        bottom: '4%',
        flexDirection: "row",
        backgroundColor: Colors.White,
        width: Size.x150,
        height: Size.x5l,
        padding: Size.xs3,

    },
    profileContainer: {
        alignSelf: "center",
        marginTop: Size.xxxl,
        borderWidth: 4,
        borderColor: Colors.Secondary.Black,
        borderRadius: Size.x78,
        justifyContent: 'center',
        alignItems: 'center'

    },
    headerContainer: {
        marginTop: Size.xl,
        // marginHorizontal: Size.xm1,
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between"
    },
    edit: {
        height: Size.l,
        width: Size.l,
        tintColor: Colors.Secondary.Black
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
        borderRadius: Size.x70,

    },
    sheetContainer: {
        borderBottomWidth: 0.5,
        borderColor: "#00000052",
        marginHorizontal: Size.xxl,
        backgroundColor: Colors.White,
        height: hp('6.8'),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cityContain: {
        flexDirection: 'row',
        height: Size.x38,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.NoneOne
    },
    openSansLabel: {
        marginHorizontal: Size.l,
        marginTop: Size.m011,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    borderStyle: {
        height: Size.xs,
        backgroundColor: Colors.Silver,
        marginHorizontal: Size.xl,
        marginTop: Size.xm1
    },
    wishlistLoader: {
        backgroundColor: null,
        padding: 0,
        borderRadius: 0,
        elevation: 0,
        // position: 'absolute',
    },
    rowInputView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 19
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