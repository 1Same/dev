import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, View } from "react-native";
import { Colors, Icon, ImagePath, Label, Typography } from "../../../constants";

const NoInterNetConnection = () => {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.White, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ tintColor: Colors.Black, width: 50, height: 50 }} source={ImagePath.Other.wifi} />
            <View style={{ alignItems: 'center', marginTop: 25 }}>
                <Label style={{ fontFamily: Typography.LatoBold, lineHeight: 28, fontSize: 16 }} text={'No InterNet Connection'} />
                <Label text={'Please connect to the internet and try again.'} />
            </View>
        </SafeAreaView>
    );
};

export default NoInterNetConnection;
