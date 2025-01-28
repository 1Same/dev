import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Image, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import styles from "./styles";
import { Button } from "../../../components";
import { Icon, ImagePath, Strings, Size, BoldLabel, HeaveyLabel, NunitoBoldLabel, RegularLabel, RobotoMediumLabel, RobotoRegularLabel, Colors, Label } from "../../../constants";

export default AllowNotification = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()} style={{ marginTop: Size.xm1, alignItems: "flex-end" }}>
                    <Icon source={ImagePath.Other.closeButton} style={styles.closeBtn} />
                </TouchableOpacity>
                <View style={styles.notificationDetail}>
                    <View style={{}}>
                        <Icon source={ImagePath.Other.AllowNotificationNew} style={styles.bell} />
                    </View>
                    <View style={{ marginTop: 60, width: "95%" }}>
                        <Label
                            text={Strings.AllowNotification.updateStatus}
                            style={{ fontSize: 30, textAlign: "center", fontFamily: Typography.PoppinsBold, }} />
                    </View>
                    <View style={{ marginTop: 14, width: "80%", }}>
                        <RobotoRegularLabel
                            title={Strings.AllowNotification.allowDetail}
                            robotoRegularStyle={styles.allowDetail} />
                    </View>
                </View>
                <Button labelStyle={{ paddingTop: Size.l }} title={Strings.AllowNotification.allowNotification} onPress={() => ('')} style={styles.allowBtn} />
                <TouchableOpacity activeOpacity={0.6} onPress={() => ('')} style={styles.dontAllowBtn}>
                    <BoldLabel title={"DON'T ALLOW"} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}