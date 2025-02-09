import { StyleSheet, Dimensions, Platform } from "react-native"
import { Colors, Size, Typography } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window')

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    sheetContainer: {
        marginTop: 8,
        borderWidth: 0.5,
        borderColor: Colors.Black,
        backgroundColor: Colors.White,
        height: 45,
        width: wp('94%'),
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5
    },
    productName: {
        fontSize: 17,
        fontFamily: Typography.RobotoBold
    },
    dateView: {
        width: wp('31%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48
    },
    deliveryTypeView: {
        borderWidth: 0.6,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cityContain: {
        flexDirection: 'row',
        height: Size.x38,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.NoneOne
    },
    backgroundContainer: {
        width: Size.l,
        height: Size.l,
        alignItems: "center",
        justifyContent: "center"
    },
    comboProductStyle: {
        backgroundColor: Colors.Fantasy,
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderTopRightRadius: 13,
        borderBottomLeftRadius: 13,
        width: wp('45.4%'),
        marginLeft: wp('.6%'),
    },
    comboProduct: {
        marginLeft: wp('3%'),
    },
    disCountBoder: {
        bottom: Platform.OS == 'ios' ? 10 : 10,
        borderWidth: .8,
    },
    citiesTopBorder: {
        borderWidth: 1,
        width: '94%',
        height: 0.2,
        marginTop: 10,
        backgroundColor: Colors.GreyGoose,
        marginLeft: '3%',
    },
    upgradeOptionView: {
        borderWidth: 1, borderColor: Colors.Tana,
        marginTop: 20, borderRadius: 10,
        flexDirection: 'row',
        marginHorizontal: 10,
        minHeight: 80
    },
    upgradeOptionContain: {
        width: '37%',
        borderRightWidth: 1,
        borderColor: Colors.Tana,
        backgroundColor: Colors.WhiteLinen,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9,
        paddingHorizontal: 10,

    },
    glassVase: {
        borderRadius: 10,
        marginLeft: 15,
        width: 36,
        height: 21,
        borderWidth: 0,
        paddingHorizontal: 3

    },
    activeGlassVase: {
        width: 14,
        height: 14,
        backgroundColor: Colors.White,
        borderRadius: 10,
    },
    commonSheet: {
        container: {
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            height: 'auto',
        },
        wrapper: {
            backgroundColor: "rgba(142, 142, 147, 0.42)"
        },
        draggableIcon: {
            backgroundColor: Colors.Black
        },
        draggableIcon: {
            backgroundColor: Colors.Black
        }
    },
    flowerIcon: {
        width: wp("44.1%"),
        height: wp("44.1%"),
        borderTopLeftRadius: 12.3,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 12.3,
    },
    productBorder: {
        padding: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 12,
        marginBottom: 1,
        borderWidth: 0.8,
        borderColor: Colors.Camel,
        elevation: 0,
        marginTop: 12,
        backgroundColor: Colors.WhiteLinen
    },
    bottmBorder: {
        height: 5,
        width: 125,
        backgroundColor: Colors.BarleyCorn,
        alignSelf: 'center'
    },
    addonIcon: {
        width: wp("39%"),
        height: wp("39%"),
        borderRadius: 0,
        // margin:7
    },
    htmlCode: {
        body: {
            whiteSpace: 'normal',
            color: 'gray'
        },
        ol: {
            paddingLeft: 24,
            paddingRight: 10,
        },
        li: {
            marginBottom: 10,
            color: 'black',
        },
        p: {
            paddingHorizontal: 10,
            marginVertical: 5,
            lineHeight: 20,
        }
    },

    // Dropdwon container ---------
    dropdown: {
        marginTop: 11,
        paddingHorizontal: 5,
        borderRadius: 5,
        height: 40,
        width: wp('94%'),
        borderWidth: 0.5,
        borderColor: Colors.Concord,
        backgroundColor: Colors.White,
    },
    placeholderStyle: {
        fontSize: 15, fontFamily: Typography.LatoRegular,
        color: Colors.Black,
        marginLeft: 5
    },
    selectedTextStyle: {
        fontSize: 15,
        color: Colors.Black,
        marginLeft: 5
    },
    iconStyle: {
        width: 25,
        height: 25,
        tintColor: Colors.Black,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 15,
    },
    dateSelectMessage: {
        marginTop: 8,
        backgroundColor: 'rgb(223,223,225)',
        borderRadius: 5,
        marginHorizontal: 17,
        justifyContent: 'center',
        padding: 13
    },
    dateSelectMessageText: {
        color: Colors.Red
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WhiteLinen,
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    inputTextContainer: {
        marginTop: 12,
        borderWidth: .8,
        borderColor: '#00000052',
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: Colors.White,
        height: 49,
        width: '100%',
    },
    inputText: {
        flex: 1,
        fontSize: Size.m1,
        fontFamily: Typography.LatoRegular,
        color: Colors.Black
    },
    error: {
        color: Colors.FerrariRed,
        fontSize: 12
    },
    wishlistLoader: {
        backgroundColor: null,
        padding: 0,
        borderRadius: 0,
        elevation: 0
    },
    wishlistIcon: {
        width: 23,
        height: 23
    },
    buttonMainCon: {
        backgroundColor: Colors.White,
        paddingHorizontal: 13,
        // paddingBottom: 25,
        height: 70,
        shadowColor: Colors.GreyGo,
        shadowOffset: {
            width: 0,
            height: -5
        },
        shadowOpacity: 0.32,
        shadowRadius: 2,
        elevation: 15,
        justifyContent: 'center'
    },
    bottonContainers: {
        backgroundColor: Colors.White,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 13,
        marginHorizontal: 0,
        height: 48,
        marginTop: 0
    },
    buttonName: {
        color: Colors.White,
        marginLeft: 3,
        fontFamily: Typography.RobotoMedium,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 19
    },
    edit: {
        height: 17,
        width: 17,
        tintColor: Colors.Black
    },
    courncyView: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.Mercury,
        width: 160,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 44,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6
    },
    dropdownName: {
        fontFamily: Typography.RobotoMedium,
        fontSize: 15
    },
    stateRowView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        flex: 1,
        paddingHorizontal: 12
    },
    ratingIcon: {
        width: 14,
        height: 14,
    },
    ratingCount: {
        color: Colors.DoveGrayNew,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        borderRadius: 2,
    },
    descriptionBorderSpacer: {
        width: '100%',
        height: 8,
        backgroundColor: Colors.Mercury,
    },
    borderSpacer: {
        width: '100%',
        height: 8,
        backgroundColor: Colors.Mercury,
        marginTop: null,
        marginVertical: 15
    },
    ratingBorderSpacer: {
        width: '100%',
        height: 8,
        backgroundColor: Colors.Mercury,
        marginTop: null,
        marginBottom: 23
    },
    upgradeOptionContainer: {
        marginLeft: wp('2%'),
        borderRadius: 5,
        width: wp('30.0.5%')
    },
    upgradeStyle: {
        color: Colors.Black,
        fontSize: 17,
        fontFamily: Typography.RobotoBold
    },
    calenderName: {
        color: Colors.Dune,
        fontSize: 12,
        fontFamily: Typography.poppinsRegular
    },
    descriptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 0.8,
        borderColor: Colors.Mercury,
        marginTop: 12
    },
    descriptionView: {
        borderBottomWidth: 2,
        paddingVertical: 7,
        paddingHorizontal: 6,
    },
    descriptionHeading: {
        fontSize: 13.5,
        color: Colors.Black,
        fontFamily: Typography.RobotoMedium
    },
    hitSlop: {
        top: 8, left: 8,
        bottom: 8, right: 8
    },
    recentlyViewProduct: {
        borderWidth: 1,
        backgroundColor: Colors.White,
        borderColor: Colors.Mischka,
        borderRadius: 16,
        alignItems: 'flex-start',
        marginLeft: wp('3.1%'),
        padding: 0
    },
    recentlyviewIcon: {
        width: wp('44.8%'),
        height: wp('43.8%'),
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    recentlyProduct: {
        alignSelf: "center",
        marginBottom: Platform.OS == 'ios' ? 15 : 15
    },
    sheetTitle: {
        fontSize: 17,
        color: Colors.Black,
        fontFamily: Typography.LatoBold
    },
    loadingMainContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: "100%",
        width: "100%",
        position: "absolute"
    },
});