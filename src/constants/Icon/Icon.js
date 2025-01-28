import React from "react";
import { Image, StyleSheet } from 'react-native';

export default Icon = (props) => {

    const { source, style, resizeMode } = props;

    return (
        (source && <Image style={[styles.icon, style]} source={source}
            resizeMode={resizeMode ? resizeMode : 'contain'} />
        )
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
    }
})