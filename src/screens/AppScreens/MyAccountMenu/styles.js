import { Dimensions, StyleSheet } from 'react-native';
import { Size, Colors, Typography } from "../../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { height } = Dimensions.get('window');

export default Styles = StyleSheet.create({

    RowColumnItemlabel: {
        marginLeft: Size.l - 1,
        fontFamily: Typography.LatoMedium,
        fontSize: Size.m11
    },
    RowColumnItem: {
        marginVertical: Size.l,
        marginLeft: Size.x4l + 2,
    },
    RowColumnIcon: {
        height: 30,
        width: 30
    },
    profileBottomContainer: {
        backgroundColor: '#F7F7F7',
        borderTopLeftRadius: Size.x6l,
        borderTopRightRadius: Size.x6l,
        marginTop: -hp('15.5%'),
        flex: 1,
        paddingTop: 20
    },
    editButtonContainer: {
        backgroundColor: null,
        height: Size.x6l - 1,
        width: Size.x105 + 2,
    },
    editButton: {
        height: Size.x6l - 1,
        width: Size.x105 + 2
    },
    profileRightContainer: {
        marginLeft: Size.xl,
        marginTop: '3%',
        flex: 1
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileimageicon: {
        height: hp('13%'),
        width: hp('13%'),
        borderRadius: Size.x100,
    },
    profileimage: {
        borderWidth: Size.xxs,
        borderRadius: Size.x100,
        borderColor: Colors.Primary.DarkCamel,
        marginLeft: '4%',
    },
    goback: {
        alignContent: "flex-end",
        alignItems: "flex-end",
        marginTop: Size.m011,
        marginRight: Size.m0,
    },
    backicon: {
        height: Size.m011,
        width: Size.m011,
    },
    topContainer: {
        flexDirection: 'row',
    },
    hitSlop: {
        top: Size.xm,
        bottom: Size.xm,
        left: Size.xm,
        right: Size.xm
    },
    userName: {
        fontFamily: Typography.LatoBold,
        color: Colors.White
    },
    loginSignupButton: {
        width: Size.x66 + 5,
        height: Size.x5l,
        backgroundColor: null,
        borderWidth: 1,
        borderColor: Colors.Primary.Camel,
    },
    loginSignupButtonLable: {
        color: Colors.Primary.Camel,
        fontFamily: Typography.LatoMedium,
    },
    boderView: {
        borderWidth: .5,
        borderColor: Colors.GreyGoose,
        marginHorizontal: Size.m1,
        marginTop: 0
    },
    deleteAccountMainView: {
        backgroundColor: 'rgba(0,0,0,0.01)',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    deleteAccountContain: {
        backgroundColor: Colors.White,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 19,
    },
    inputView: {
        height: 42,
        borderColor: Colors.Camel,
        width: '100%',
        marginTop: 12,
    }
})