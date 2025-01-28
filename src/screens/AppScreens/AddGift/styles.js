import { StyleSheet, Dimensions } from 'react-native';
import { size, Colors, Size, Typography } from '../../../constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    headerContainer: {
        paddingHorizontal: Size.xm1,
    },
    listContainer: {
        width: wp('45.4%'),
        marginLeft: wp('3%'),
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderTopRightRadius: Size.xm1,
        borderBottomLeftRadius: Size.xm1,
        backgroundColor: Colors.FantasyNew,
        marginBottom: Size.xm2,
    },
    icon: {
        height: hp('22%'),
        width: wp('44.8%'),
    },
    title: {
        fontSize: Size.m - 1.5,
        color: Colors.Black
    },
    price: {
        fontSize: Size.m - 1.5,
        fontFamily: Typography.LatoBold,
        color: Colors.Dune,
        marginVertical: 2
    },
    buttonContaine: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: Colors.White,
        width: 75,
        borderRadius: 4,
        height: 30,
        justifyContent: "space-evenly",
        alignItem: "center",
        marginBottom: Size.xs3,
        borderWidth: 1,
        borderColor: Colors.QuillGrey,

    },
    incrementButton: {
        fontSize: Size.l,
        color: Colors.Black,
        fontFamily: Typography.LatoBold
    },
    hitSlop: {
        top: Size.xm,
        bottom: Size.xm,
        left: Size.xm,
        right: Size.xm
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.Secondary.Black,
        borderRadius: 2,
        height: 48
    },
    buttonTitle: {
        fontSize: Size.m011,
        fontFamily: Typography.LatoBold
    },
    listHorizotalCon: {
        marginVertical: Size.xm
    },
    listFooter: {
        height: hp('9%')
    },

    lodingCon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lodingStyle: {
        backgroundColor: Colors.White,
        padding: 5,
        borderRadius: 100,
        elevation: 4
    },
    buttonContaine: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: Colors.White,
        width: wp('18'),
        borderRadius: 4,
        height: hp('4'),
        justifyContent: "space-evenly",
        alignItem: "center",
        marginBottom: Size.xs3,
        borderWidth: 1,
        borderColor: Colors.QuillGrey,

    },
    incrementButton: {
        fontSize: Size.l,
        color: Colors.Black,
        fontFamily: Typography.LatoBold,

    },
    hitSlop: {
        top: Size.xm,
        bottom: Size.xm,
        left: Size.xm,
        right: Size.xm
    },
    decrementView: {
        backgroundColor: Colors.Black,
        width: 9,
        height: 2.3,
        marginTop: 2
    },


})