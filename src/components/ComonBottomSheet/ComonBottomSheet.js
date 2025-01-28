import React, { memo } from "react";
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Icon, Label, RegularLabel, Size, Strings, Typography } from "../../constants";

const ComonBottomSheet = ({ name, value, onClick, errors, touched, requiredFeld = true, errorView, otherDownArrow, tintColor }) => {

    const downArrow = require('../../assets/Images/Other/downArrow.png');

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 12 }}>
            <View style={{ flexDirection: "row", }}>
                <Label style={{ fontFamily: Typography.poppinsMedium, fontSize: 13.5, color: Colors.WoodCharcoal }} text={name} />
                {requiredFeld == true && < Label text={"*"} style={{ color: Colors.FerrariRed }} />}
            </View>

            <TouchableOpacity onPress={onClick} style={[styles.sheetBorderView, {}]} activeOpacity={0.6}>
                <Label style={[styles.valueText, {
                    color: value == 'Select country' || value == 'Select city' || value == 'Select state' || value == 'Select Area' || value == Strings.detail.selectDate || value == 'Select occasion' || value == 'Select days' || value == 'Select gender' ? Colors.PlaceholderColor : Colors.WoodCharcoal
                }]} text={value} />
                <Icon
                    source={otherDownArrow ? otherDownArrow : downArrow}
                    style={{ height: name == 'Date' || name == Strings.EditMyprofile.dob || name == Strings.EditMyprofile.dateAnniversary ? 17 : Size.m, width: name == 'Date' || name == Strings.EditMyprofile.dob || name == Strings.EditMyprofile.dateAnniversary ? 17 : Size.m, tintColor: tintColor ? tintColor : Colors.WoodCharcoal }} />
            </TouchableOpacity>

            {errors && touched &&
                <View style={[{ height: 18 }, errorView]}>
                    <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 13, }]} title={errors} />
                </View>
            }
        </SafeAreaView>
    )
}
export default memo(ComonBottomSheet);

const styles = StyleSheet.create({
    sheetBorderView: {
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        height: 46.5,
        borderColor: Colors.BorderColor,
        borderRadius: 3,
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        marginTop: 1
    },
    valueText: {
        fontSize: 14.5,
        bottom: 2,

    }
})