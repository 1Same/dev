import { StyleSheet } from "react-native"
import { Size, Colors } from "../../../constants"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
        justifyContent: "center",
        alignItems: 'center'
    },
    iconSplashLogo: {
        width: wp('55%'),
        height: hp('55%')
    },
})