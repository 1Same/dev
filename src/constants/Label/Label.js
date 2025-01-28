import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Colors, Typography, Size } from "..";

export const MediumLabel = (props) => {

    const { title, numberOfLines, ellipsizeMode, mediumStyle, onPress } = props;

    return (
        <Text
            style={[styles.mediumText, mediumStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    )
}

export const Label = (props) => {

    const { text, style, numberOfLines, ellipsizeMode } = props;

    return (
        <Text
            style={[styles.title, style]}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
        >
            {text}
        </Text>
    )
}

export const BoldLabel = props => {

    const { title, boldStyle, numberOfLines, ellipsizeMode, onPress } = props;

    return (
        <Text
            style={[styles.boldText, boldStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};

export const RegularLabel = (props) => {

    const { title, regularStyle, numberOfLines, ellipsizeMode, onPress, onTextLayout } = props;

    return (
        <Text
            style={[styles.regularText, regularStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            onTextLayout={onTextLayout}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};

export const HeaveyLabel = (props) => {

    const { title, heaveyStyle, numberOfLines, ellipsizeMode, onPress } = props;

    return (
        <Text
            style={[styles.heaveyText, heaveyStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};

export const NunitoBoldLabel = (props) => {

    const { title, nunitoBoldStyle, numberOfLines, ellipsizeMode, onPress } = props;

    return (
        <Text
            style={[styles.nunitoBoldText, nunitoBoldStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};
export const OpenSansBoldLabel = (props) => {

    const { title, openSansBoldStyle, numberOfLines, ellipsizeMode, onPress } = props;

    return (
        <Text
            style={[styles.openSansBoldText, openSansBoldStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};
export const RobotoBoldLabel = (props) => {

    const { title, robotoBoldStyle, numberOfLines, ellipsizeMode, onPress } = props;

    return (
        <Text
            style={[styles.robotoBoldText, robotoBoldStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};

export const RobotoMediumLabel = (props) => {

    const { title, robotoMediumStyle, numberOfLines, ellipsizeMode, onPress } = props;

    return (
        <Text
            style={[styles.robotoMediumText, robotoMediumStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};

export const RobotoRegularLabel = (props) => {

    const { title, robotoRegularStyle, numberOfLines, ellipsizeMode, onPress } = props;

    return (
        <Text
            style={[styles.robotoRegularText, robotoRegularStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};

export const OpenSansRegularLabel = (props) => {

    const { title, openSansRegularStyle, numberOfLines, ellipsizeMode, onPress } = props;

    return (
        <Text
            style={[styles.openSansRegularText, openSansRegularStyle]}
            onPress={onPress}
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}>
            {title}
        </Text>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        color: Colors.Black,
        fontFamily: Typography.LatoRegular,
    },
    boldText: {
        fontFamily: Typography.LatoBold,
        fontSize: Size.m1,
        color: Colors.Black,
    },
    mediumText: {
        fontFamily: Typography.LatoMedium,
        fontSize: Size.m1,
        color: Colors.Black,
        lineHeight: Size.xl,
    },
    regularText: {
        fontFamily: Typography.LatoRegular,
        fontSize: Size.m1,
        color: Colors.Black,
        lineHeight: Size.xl
    },
    heaveyText: {
        fontFamily: Typography.LatoHeavy,
        fontSize: Size.x5l,
        color: Colors.Black,
    },
    nunitoBoldText: {
        fontFamily: Typography.NunitoBold,
        fontSize: Size.m1,
        color: Colors.Black,
    },
    openSansBoldText: {
        fontFamily: Typography.OpenSansBold,
        fontSize: Size.m1,
        color: Colors.Black,
    },
    robotoBoldText: {
        fontFamily: Typography.RobotoBold,
        fontSize: Size.m1,
        color: Colors.Black,
    },
    robotoRegularText: {
        fontFamily: Typography.RobotoRegular,
        fontSize: Size.m1,
        color: Colors.Black,
    },
    robotoMediumText: {
        fontFamily: Typography.RobotoMedium,
        fontSize: Size.m1,
        color: Colors.Black,
    },
    openSansRegularText: {
        fontFamily: Typography.OpenSansRegular,
        fontSize: Size.m0,
        color: Colors.Black,
    }
});