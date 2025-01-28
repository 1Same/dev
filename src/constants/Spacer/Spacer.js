import React from "react";
import { StyleSheet, View } from 'react-native';
import Size from "../Size/Size";

export default Spacer = (props) => {

    const { style } = props;

    return (
        <View style={[styles.spacer, style]}></View>
    )
};

const styles = StyleSheet.create({
    spacer: {
        marginTop: Size.m
    }
})