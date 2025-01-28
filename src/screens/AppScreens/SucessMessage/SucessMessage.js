import React, { useEffect, useState } from "react";
import { View, SafeAreaView, } from 'react-native';
import styles from "./styles";
import { Icon, Strings, Size, ImagePath, BoldLabel, RegularLabel, Label, Colors } from "../../../constants";
import { BackButtonHeader, Button, NewHeader } from "../../../components";


export default SuccessMessage = ({ navigation, route }) => {

    return (
        <SafeAreaView style={styles.mainContainer}>
            <BackButtonHeader
                containerStyle={{ marginHorizontal: Size.m11 }}
            />
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ marginTop: 135, }}>
                    <Icon source={ImagePath.Other.success} style={styles.arrow} />
                </View>
                <View style={{ marginTop: Size.x5l }}>
                    <Label text={Strings.SucessMessage.congratulations} style={{ fontSize: 27, fontFamily: Typography.PoppinsBold, }} />
                </View>
                <View style={{ marginTop: 14, }}>
                    <RegularLabel title={Strings.SucessMessage.orderDetail} regularStyle={{ fontSize: Size.m1, textAlign: "center" }} />
                    <RegularLabel title={`${Strings.SucessMessage.orderId} ${route.params?.orderId}`} regularStyle={{ fontSize: Size.m1, textAlign: "center" }} />
                </View>
            </View>

            <Button
                labelStyle={{}}
                title={Strings.SucessMessage.trackOrder}
                onPress={() => navigation.navigate('OrderHistory')}
                style={{ marginTop: Size.x64, marginHorizontal: Size.xxxl, borderRadius: 4 }}
            />

            <Button
                labelStyle={{ color: Colors.Black }}
                title={Strings.CartEmpty.backToHome}
                onPress={() => navigation?.reset({ index: 0, routes: [{ name: 'MyDrawerNav' }] })}
                style={{ marginTop: 20, marginHorizontal: Size.xxxl, borderRadius: 4, backgroundColor: Colors.White, borderWidth: 1, borderColor: Colors.Black }}
            />
        </SafeAreaView>
    )
}