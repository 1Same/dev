import { StyleSheet, Dimensions } from "react-native";
import { Size, Colors, Typography } from "../../../constants";


export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    headerContainer: {
        marginHorizontal: Size.m,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    border: {
        height: Size.xs,
        backgroundColor: Colors.Silver,
        marginTop: Size.m,
        marginHorizontal: Size.xm2
    },
    listContainer: {
        flexDirection: "row",
        marginTop: Size.m,
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: Size.xxll
    },
    boldStyle: {
        color: Colors.DuneLight,
        fontSize: 14
    },
    subContain: {
        marginTop: 15,
        marginHorizontal: Size.xm2,
        flexDirection: "row",
        paddingHorizontal: Size.m011,
        justifyContent: "space-between",
    },
    orderDetail: {
        flexDirection: "row",
        paddingHorizontal: Size.m011,
        paddingVertical: Size.l,
        justifyContent: "space-between",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0,
        height: 48
    },
    paypalButton: {
        backgroundColor: '#0f4fa3',
        alignItems: "center",
        justifyContent: "center",
    },
    progressBar: {
        backgroundColor: '#ddd',
        height: 20,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
    },
    progressIndicator: {
        backgroundColor: 'blue',
        height: '100%',
        position: 'absolute',
        borderRadius: 10,
    },
    progressText: {
        marginTop: 10,
    },
    borderView: {
        height: 8,
        marginTop: 15,
        backgroundColor: Colors.GreyGoose,
    },
    orderDetailView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 6
    },
    progressUpdateView: {
        marginTop: 15,
        flexDirection: "row",
        marginHorizontal: 50,
        justifyContent: "space-between",
        alignItems: "center"
    },
    countView: {
        backgroundColor: Colors.ClearBlue,
        height: 25,
        width: 24,
        borderRadius: 20,
        justifyContent: "center"
    },
    proccessBorder: {
        backgroundColor: Colors.ClearBlue,
        height: 1,
        opacity: .6,
        flex: 1
    },
    borderStyle: {
        backgroundColor: "#7070704F", height: 2, width: 125,
    },
    countStyle: {
        color: Colors.White, fontSize: 12, textAlign: "center",
    },
    tabBarContainer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#b43757'
    },
    buttonModal: {
        color: 'white',
        fontSize: 24
    },
    payuButton: {
        backgroundColor: Colors.Green,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginBottom: 20,
        marginHorizontal: 30
    },
    hitSlop: {
        top: 10, left: 10, right: 10, bottom: 10
    }

})
