import React, { memo, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Colors, Icon, Size, Typography, Label, Spacer } from "../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default AddToCartQuantity = memo((props) => {

    const [count, setCount] = useState(1);

    const increment = async () => {
        setCount(count + 1);
    }
    const decrement = async () => {
        setCount(count - 1)
    }

    return (

        <View style={styles.buttonContaine}>
            <TouchableOpacity onPress={() => decrement()} activeOpacity={0.6} hitSlop={styles.hitSlop}>
                <Spacer style={styles.decrementView} />
            </TouchableOpacity>
            <View style={{ marginHorizontal: Size.xm2 }}>
                <Label style={[styles.incrementButton, { fontSize: Size.m1 }]} text={count} />
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
        width: wp('18'),
        borderRadius: 4,
        height: hp('4'),
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
    decrementView: {
        backgroundColor: Colors.Black,
        width: 9,
        height: 2.3,
        marginTop: 2
    }

})