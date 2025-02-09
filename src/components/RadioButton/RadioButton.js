import React, { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View, } from "react-native";
import { ImagePath, RegularLabel } from "../../constants";



const RadioButton = ({ onClick, style, selected, iconStyle, radioDescription, radioDescriptionStyle, disabled = false, otherActiveIcon = false, radioActiveView }) => {
    return (
        <TouchableOpacity onPress={onClick} activeOpacity={0.7} hitSlop={styles.hitSlop} style={styles.rowView} disabled={disabled}>
            <View style={[styles.radioView, style]}>
                {selected ? (
                    otherActiveIcon ?
                        <View style={[styles.radioView, styles.radioActiveView, radioActiveView]} />
                        :
                        <Image style={[styles.radioIcon, iconStyle]} source={ImagePath.Other.rightIcon} />
                ) : (
                    <View style={[styles.radioIcon, iconStyle]} /> // Empty box when not selected
                )}
            </View>
            {radioDescription && (
                <RegularLabel regularStyle={[{ fontSize: 14, marginLeft: 5 }, radioDescriptionStyle]} title={radioDescription} />
            )}
        </TouchableOpacity>
    );
};
export default memo(RadioButton);
const styles = StyleSheet.create({
    hitSlop: {
        top: 7,
        left: 7,
        bottom: 7,
        right: 7,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedRadio: {
        width: 14,
        height: 14,
        borderRadius: 100,
    },
    radioIcon: {
        width: 11,
        height: 9,
        // tintColor: Colors.Black,
        resizeMode: 'contain',
    },
    radioView: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: Colors.SuperBlack,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.White,
        marginLeft: 1,
    },
    radioActiveView: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: Colors.WaterBlue,
        borderWidth: 0,
        marginLeft: 0,
    }
})