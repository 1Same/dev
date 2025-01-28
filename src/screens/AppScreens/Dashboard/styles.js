import { StyleSheet, Dimensions } from "react-native"
import { Colors, Typography, Size } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get("window")

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    headerTopContainer: {
        backgroundColor: Colors.Secondary.Black,
    },
    headerContainer: {
        paddingHorizontal: Size.xm1,
        paddingVertical: Size.xm1
    },
    titleContainer: {
        width: '80%',
        marginLeft: '10%',
        marginBottom: '2.4%',
    },
    titleStyle: {
        fontSize: 18,
        fontFamily: Typography.LatoBold,
        color: Colors.White,
        textAlign: 'center'
    },
    someGitingIdea: {
        fontSize: Size.m,
        color: Colors.White,
        textAlign: 'center'
    },
    iconList: {
        marginLeft: '8.2%',
    },
    countryIcon: {
        width: width * 0.3,
        height: 115
    },
    buttonContainer: {
        backgroundColor: Colors.White,
        width: wp('35%'),
        height: 48
    },
    labelStyle: {
        color: Colors.Black,
        fontFamily: Typography.LatoMedium
    },
    labelStyleNewReminder: {
        fontSize: Size.m,
        fontFamily: Typography.LatoMedium
    },
    buttonMainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainerNewReminder: {
        width: wp('42%'),
        alignSelf: "center",
        height: 48,
        borderWidth: 1,
        borderColor: Colors.White,
    },
    icon: {
        width: 37,
        height: 37
    },
    dashboard: {
        color: Colors.Black,
        fontFamily: Typography.LatoBold,
        fontSize: 14
    },
    backgroungIcon: {
        height: 160
    },
    DashboardList: {
        borderWidth: 1,
        width: '44%',
        marginLeft: '3.9%',
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginTop: 15
    },
    mainViewModal: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subTitleView: {
        backgroundColor: Colors.Secondary.Black,
        flexDirection: "row",
        height: 45,
        justifyContent: "space-between",
        padding: 10,
        alignItems: "center",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    mainNameView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    mainDateView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 10
    }
})