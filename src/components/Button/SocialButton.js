import React, { memo } from "react";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors, Size, Typography, Icon, BoldLabel, Strings, ImagePath } from "../../constants";


const SocialButton = (props) => {

    const { onPress } = props;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={onPress}
                activeOpacity={0.6} style={[styles.socialLoginButton, { backgroundColor: Colors.ForestGreen }]}>
                <BoldLabel boldStyle={styles.label} title={Strings.Home.google} />
                <Icon source={ImagePath.Auth.googleSign} style={styles.fbSign} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onPress}
                activeOpacity={0.6} style={[styles.socialLoginButton, { backgroundColor: Colors.Minsk }]}>
                <BoldLabel boldStyle={styles.label} title={Strings.Home.facebook} />
                <Icon source={ImagePath.Auth.facebook_background} style={styles.fbSign} />
            </TouchableOpacity>
        </View>
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
        fontSize: 16,
        fontFamily: Typography.LatoMedium,
        color: Colors.White,
        alignSelf: "center",
    },
    emtyView: {
        width: Size.x,
        marginLeft: Size.l,
        backgroundColor: "#70707070"
    },
    fbSign: {
        height: 17,
        width: 17,
        marginLeft: 6,
        tintColor: Colors.White
    },
    socialLoginButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        paddingVertical: 8,
        width: '43.8%'
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