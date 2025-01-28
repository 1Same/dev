import { StyleSheet, Dimensions } from "react-native"
import { Colors, Size } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window')

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
    boxContainer: {
        flex: 1,
        marginVertical: 7,
        padding: Size.xs3,
        marginHorizontal: 19,
        borderWidth: 0.5,
        borderColor: Colors.GreyGoose,
        paddingHorizontal: 16
    },
    addressRow: {
        marginTop: Size.l,
        marginLeft: 19
    },
    border: {
        height: Size.xs,
        backgroundColor: Colors.Silver,
        marginHorizontal: Size.m1,
        marginTop: Size.m0
    },
    subContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: Size.xs3
    },

    inputContainer: {
        borderWidth: null,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: Size.xm
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    edit: {
        height: Size.l,
        width: Size.l,
        tintColor: Colors.Primary.Camel
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
    backgroundContainer: {
        width: Size.l,
        height: Size.l,
        alignItems: "center",
        justifyContent: "center"
    },
    cityContain: {
        height: 40,
        borderBottomColor: Colors.NoneOne, pending: 0,
        flex: 1,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between'
    },
    addressButton: {
        bottom: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginHorizontal: 15,
    },
    addNewBtn: {
        height: hp('4%'),
        width: wp('20%'),
        backgroundColor: Colors.Secondary.Black,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 3,
    },
    mainProcessBarCount: {
        marginTop: 15,
        flexDirection: "row",
        marginHorizontal: 50,
        justifyContent: "space-between",
        alignItems: "center"
    },
    countView: {
        borderWidth: .5,
        borderColor: Colors.Camel,
        height: 23,
        width: 23,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: 'center'
    },
    countStyle: {
        color: Colors.Camel,
        fontSize: 12.5,
        textAlign: "center",
    },
    borderView: {
        backgroundColor: "#7070704F",
        height: 1,
        opacity: .6,
        flex: 1
    },
    proccessUpdateView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 25,
        marginTop: 4
    },
    thinBorderView: {
        height: 8,
        marginTop: 15,
        backgroundColor: Colors.GreyGoose,
    },
    greyBorderView: {
        height: Size.xs,
        marginTop: 5,
        marginHorizontal: 10,
        backgroundColor: Colors.PaleSlate
    },
    flagContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    flagImage: {
        width: 48,
        height: 36,
    },
    textInputStyle: {
        borderWidth: 1,
        marginTop: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: Colors.Gainsboro
    },

    loader: {
        backgroundColor: null,
        padding: 0,
        borderRadius: 0,
        elevation: 0
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
    lodeMore: {
        fontSize: 14,
        color: Colors.Camel,
        textAlign: 'center',
        fontFamily: Typography.poppinsSemiBold
    }
})