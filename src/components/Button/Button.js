import React, { memo, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors, Icon, Size, Typography, Label, BoldLabel } from "../../constants";



const Button = (props) => {

    const { onPress, title, style, cartIconStyle, buttomIconStyle, labelStyle, icon, swiperButton, primaryButton, Images, ImagesStyle, primaryIcon, disabled } = props;

    return (
        <View>
            {swiperButton ? <TouchableOpacity onPress={onPress} style={[styles.buttonContainerH, style]} activeOpacity={0.6} disabled={disabled}>
                {title && <Label style={[styles.title, labelStyle]} text={title} />}
                {Images && <Icon source={Images} style={ImagesStyle} />}
            </TouchableOpacity> : null}

            {primaryButton ?
                <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.primaryButton, style]} activeOpacity={0.6}>
                    {title && <Label style={[styles.primaryTitle, labelStyle]} text={title} />}
                    {primaryIcon && <Icon source={primaryIcon} style={[buttomIconStyle, { width: 25, height: 25 }]} />}
                </TouchableOpacity> : null
            }
            {!primaryButton && !swiperButton &&
                <TouchableOpacity onPress={onPress}
                    activeOpacity={0.6} style={[styles.buttonContainer, style]} disabled={disabled}>
                    {icon ? <Icon source={icon ? icon : ImagePath.Other.cart} style={[styles.cartIcon, cartIconStyle]} /> : null}
                    <BoldLabel boldStyle={[styles.label, labelStyle]} title={title} />
                </TouchableOpacity>
            }
        </View>
    )
}

export default memo(Button)

const styles = StyleSheet.create({
    buttonContainer: {
        marginHorizontal: Size.l,
        backgroundColor: Colors.Secondary.Black,
        borderRadius: Size.xm,
        marginTop: Size.xxxl,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 13.7,
        fontFamily: Typography.LatoBold,
        color: Colors.White,
        alignSelf: "center",
    },
    buttonContainerH: {
        backgroundColor: Colors.Black,
        height: Size.l - 2,
        justifyContent: 'center', alignItems: 'center',
        width: Size.x67 - 7,
        marginTop: Size.xxs
    },
    title: {
        color: '#fff',
        fontSize: Size.xm1
    },
    primaryButton: {
        backgroundColor: Colors.Secondary.Black,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Size.xs2,
    },
    primaryTitle: {
        color: '#fff',
        fontSize: Size.m0,
        fontFamily: Typography.LatoBold
    },
})

