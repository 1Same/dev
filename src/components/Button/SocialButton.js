import React, { memo } from "react";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors, Size, Typography, Icon, BoldLabel } from "../../constants";


const SocialButton = (props) => {

    const { onPress, title, style, source } = props;

    return (
        <TouchableOpacity onPress={onPress}
            activeOpacity={0.6} style={[styles.socialLoginButton, style]}>
            <View style={{ marginLeft: Size.l }}>
                <Icon source={source} style={styles.fbSign} />
            </View>
            <View style={styles.emtyView} />
            <BoldLabel boldStyle={styles.label} title={title} />
        </TouchableOpacity>
    )
}
export default memo(SocialButton);

const styles = StyleSheet.create({
    buttonContainer: {
        marginHorizontal: Size.l,
        backgroundColor: Colors.Primary.Camel,
        borderRadius: Size.xm,
        marginTop: Size.xxxl,
        height: Size.x66,
    },
    label: {
        fontSize: Size.m1,
        fontFamily: Typography.LatoBold,
        color: Colors.Black,
        alignSelf: "center",
        marginLeft: Size.m1
    },
    emtyView: {
        height: Size.x65,
        width: Size.x,
        marginLeft: Size.l,
        backgroundColor: "#70707070"
    },
    fbSign: {
        height: Size.xxl,
        width: Size.m1,
    },
    socialLoginButton: {
        marginHorizontal: Size.l,
        borderRadius: Size.xm,
        marginTop: Size.xl,
        flexDirection: "row",
        backgroundColor: Colors.White,
        borderColor: Colors.Concord,
        borderWidth: .5,
        alignItems: "center",
        height: Size.x65,
    },
    buttonView: {
        backgroundColor: Colors.Primary.Camel,
        borderRadius: Size.xs1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: Size.xm1,
    },
    icon: {
        width: Size.l,
        height: Size.l,
        margin: Size.xm
    }
})