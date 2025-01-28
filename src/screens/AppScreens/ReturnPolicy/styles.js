import { StyleSheet, Dimensions } from "react-native"
import { Colors, Typography, Size } from "../../../constants"

const { width } = Dimensions.get("window")

export default styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    renderContainer: {
        marginHorizontal: Size.m011,
        marginBottom: Size.xm1,
        borderColor: Colors.FrenchGrey,
        borderWidth: 1,
        borderRadius: 5,
        
    },
    containContainer: {
        width: Size.x63,
        height: Size.x63,
        justifyContent: 'center',
        alignItems: 'center'
    },
    expendContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: Size.xm1,
        marginBottom: Size.xm1
    }
})