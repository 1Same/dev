import React from "react";
import { View, SafeAreaView, BackHandler } from 'react-native';
import styles from "./styles";
import { Button } from "../../../components";
import { Colors, Icon, ImagePath, Strings, Size, BoldLabel, RegularLabel } from "../../../constants";


export default CartEmpty = ({ navigation }) => {

    BackHandler.addEventListener(
        'hardwareBackPress', () => {
            navigation.navigate('Home')
        }
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ marginTop: Size.x230, }}>
                    <Icon source={ImagePath.Other.cartIcon} style={styles.arrow} />
                </View>
                <View style={{ marginTop: Size.xxxl, }}>
                    <BoldLabel title={Strings.CartEmpty.nothingHere} boldStyle={{ fontSize: Size.l }} />
                </View>
                <View style={{ marginTop: Size.xs2, }}>
                    <RegularLabel title={Strings.CartEmpty.discoverMore} regularStyle={{ textAlign: "center", color: Colors.SmokeyGrey }} />
                </View>
                <View style={{ width: "75%" }}>
                    <RegularLabel title={Strings.CartEmpty.toYou} regularStyle={{ textAlign: "center", color: Colors.SmokeyGrey }} />
                </View>
            </View>
            <Button
                title={Strings.CartEmpty.backToHome}
                labelStyle={{}}
                onPress={() => navigation.navigate('Home')}
                style={{ marginTop: Size.x64, marginHorizontal: Size.xxxl }}
            />
        </SafeAreaView>
    )
}
