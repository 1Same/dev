import React, { memo, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors, Icon, Size, Typography, Label, BoldLabel } from "../../constants";




export default QuantityButton = memo((props) => {

    const { } = props;
    const [count, setCount] = useState(1);

    const increment = () => {
        setCount(count + 1)
    }
    const decrement = () => {
        setCount(count - 1)
    }


    return (

        <View style={styles.buttonContaine}>
            <TouchableOpacity onPress={() => decrement()} activeOpacity={0.6} hitSlop={styles.hitSlop}>
                <Label style={styles.incrementButton} text='-' />
            </TouchableOpacity>
            <View style={{ marginHorizontal: 10 }}>
                <Label style={[styles.incrementButton, { fontSize: 15 }]} text={count} />
            </View>
            <TouchableOpacity onPress={() => increment()} activeOpacity={0.6}>
                <Label style={styles.incrementButton} text='+' />
            </TouchableOpacity>
        </View>
    )
})

const styles = StyleSheet.create({
    buttonContaine: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: Colors.White,
        width: 75,
        borderRadius: 4,
        height: 30,
        justifyContent: "space-evenly",
        alignItem: "center",
        marginBottom: Size.xs3,
        borderWidth: 1,
        borderColor: Colors.QuillGrey,

    },
    incrementButton: {
        fontSize: Size.l,
        color: Colors.Black,
        fontFamily: Typography.LatoBold
    },
    hitSlop: {
        top: Size.xm,
        bottom: Size.xm,
        left: Size.xm,
        right: Size.xm
    },
})