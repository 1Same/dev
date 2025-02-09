import React, { memo, useEffect, useState } from "react";
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors, Label, RegularLabel, Spacer, Typography } from "../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ProgressiveImage from "../ProgressiveImage/ProgressiveImage";

const Categories = (props) => {

    const { image, title, loding, bottomWidthLoading, rowWidthLoading, onPress, index = 0 } = props;

    return (
        <>
            {loding == true ?
                <SkeletonPlaceholder >
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" >
                        <SkeletonPlaceholder.Item width={wp('19.5%')} height={wp('15.5%')} borderRadius={4} marginTop={9} marginLeft={5.9} />
                        <SkeletonPlaceholder.Item width={bottomWidthLoading} height={wp('15%')} marginTop={7} marginLeft={5} />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item width={wp('19%')} height={rowWidthLoading} marginTop={8} marginLeft={5.8} />
                </SkeletonPlaceholder>
                :
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', width: wp('23.2'), paddingTop: index > 4 ? 6 : 20, }} activeOpacity={0.7}>
                            <ProgressiveImage
                                style={{ height: 45, width: 45 }}
                                source={image}
                                resizeMode="contain"
                            />
                            <View style={{ height: 25, paddingHorizontal: 2, top: 5 }}>
                                <Label text={title} style={{ fontSize: 10, fontFamily: Typography.LatoMedium, textAlign: 'center', }} />
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.borderbottomwidth, { height: rowWidthLoading }]} />
                    </View>
                    <View style={[styles.borderleftwidth, { width: bottomWidthLoading, marginTop: index > 4 ? 5 : 10, height: wp(index > 4 ? '14%' : '16%'), }]} />
                </View>
            }
        </>
    )
}
export default memo(Categories)

const styles = StyleSheet.create({
    serviceProvide: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    borderbottomwidth: {
        width: wp('19.5%'),
        marginTop: 0,
        marginLeft: 8,
        backgroundColor: Colors.CreamBrulee
    },
    borderleftwidth: {
        width: 1,
        height: wp('14%'),
        backgroundColor: Colors.CreamBrulee,
        marginTop: 10
    }
})