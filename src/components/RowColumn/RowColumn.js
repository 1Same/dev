import React, { memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography } from "../../constants";
import { Icon, Label, Size } from "../../constants";
import Button from "../Button/Button";
import CountryFlag from "react-native-country-flag";
import { useSelector } from "react-redux";


const RowColumn = (props) => {
    const countryData = useSelector((state) => state.country);
    const {
        labelStyleOne,
        titleOne, ratingIcon1,
        ratingIconStyle1,
        title2,
        currencyIcon,
        Image,
        buttonName,
        ratingIconStyle,
        icon,
        onPress,
        ratingIcon,
        title1,
        button,
        labelStyle1,
        shapeIcon,
        labelStyleView2,
        titleStyle,
        shapeIconView,
        title,
        boder,
        style,
        labelStyle,
        onClick,
        ImageStyle,
        touchableStyle,
        viewStyle,
        viewonPress,
        label = '',
        labelStyle2,
        boderStyle,
        keyNew = Math.random(0, 1000),
        shapeIconStyle,
        disabled,
    } = props;

    return (
        <View key={keyNew} style={[styles.rowColumns, viewStyle]} onPress={viewonPress}>
            {(Image || label || shapeIcon) &&
                < TouchableOpacity onPress={onClick}
                    style={[{ alignItems: 'center', flexDirection: 'row' }, touchableStyle]}
                    activeOpacity={0.7} disabled={disabled} hitSlop={styles.hitSlop}>
                    {Image && <View style={ImageStyle} >
                        {(Image?.countryFlag == 'countryFlag' || Image?.countryCode) ?
                            < CountryFlag isoCode={Image?.countryCode ? Image?.countryCode?.toString() : countryData?.country?.country_iso_code?.toString()} size={22} />
                            : <Icon style={[styles.icon, style]} source={Image} />
                        }
                    </View>}
                    {label &&
                        <View style={[labelStyleView2, {}]}>
                            <Label text={label} style={[styles.labelStyle2, labelStyle2]} />
                        </View>
                    }
                    {shapeIcon &&
                        <View style={[styles.ShapeIconContainer, shapeIconView]}>
                            <Icon style={[styles.shapeIcon, shapeIconStyle]} source={shapeIcon} />
                        </View>
                    }
                </TouchableOpacity>}
            {icon && <Icon style={[styles.icon, style]} source={icon} />}

            {title && <View style={[{ marginLeft: 5, }, titleStyle]}>
                <Label style={[styles.uaeLabel, labelStyle]} text={title} />
            </View>}
            {ratingIcon && <Icon style={[styles.ratingIconStyle, ratingIconStyle]} source={ratingIcon} />}
            {titleOne && <Label style={[styles.uaeLabel, labelStyleOne]} text={titleOne} />}
            {title1 && <Label style={[styles.uaeLabel, labelStyle1]} text={title1} />}
            {boder && <View style={[styles.boderstyle, boderStyle]}></View>}
            {button &&
                <Button
                    style={styles.button}
                    labelStyle={styles.buttonTitle}
                    onPress={onPress}
                    title={buttonName ? buttonName : 'Explore more'}
                    primaryButton
                />}
        </View >
    )
}
export default memo(RowColumn)

const styles = StyleSheet.create({
    rowColumns: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boderstyle: {
        backgroundColor: Colors.Camel,
        width: 1.2,
        height: Size.x4l,
        marginHorizontal: Size.m
    },
    icon: {
        width: Size.xxxl,
        height: Size.xxxl
    },
    uaeLabel: {
        fontFamily: Typography.LatoRegular,

    },
    labelStyle2: {
        fontFamily: Typography.LatoRegular,
        marginLeft: 5,

    },
    ShapeIconContainer: {
        alignItems: 'flex-end',
    },
    shapeIcon: {
        width: Size.xs2,
        height: Size.xm1
    },
    ratingIconStyle: {
        width: 13, height: 13
    },
    hitSlop: {
        top: 8,
        bottom: 8,
        left: 8,
        right: 8
    },
    button: {
        backgroundColor: Colors.Secondary.Black,
        height: 32,
        width: 90
    },
    buttonTitle: {
        fontSize: 12,
        fontFamily: Typography.LatoMedium
    }
})