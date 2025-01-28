import { StyleSheet } from "react-native"
import { Colors, Size } from "../../../constants";
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
    inputContainer: {
        borderWidth: null,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: Size.m1,
    },
    headerContainer: {
        marginHorizontal: Size.xm1,
    },
    containContainer: {
        marginTop: Size.m1,
        flexDirection: "row",
        alignItems: "center"
    },
    openSansLabel: {
        marginHorizontal: Size.m011,
        marginTop: Size.xm1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    cityContain: {
        flexDirection: 'row',
        height: Size.x38,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: Colors.NoneOne,
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
    rowInputView: {
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