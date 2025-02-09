import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = (props) => {

    const { mainContainer, loadStyle, size ,color} = props;

    return (
        <View style={[styles.container, mainContainer]}>
            <ActivityIndicator style={[styles.lodingStyle, loadStyle]} color={color?color:Colors.Camel} size={size ? size : 'large'} />
        </View>
    )
}
export default memo(Loader)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "center",
        justifyContent: 'center',
    },
    lodingStyle: {
        backgroundColor: Colors.White,
        padding: 5,
        borderRadius: 100,
        elevation: 4
    }
})