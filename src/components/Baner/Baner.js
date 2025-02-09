import React, { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, Label, Typography } from "../../constants";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProgressiveImage from "../ProgressiveImage/ProgressiveImage";



export default Baner = memo((props) => {

    const {
        image,
        style,
        imageStyle,
        border,
        title,
        titleBottom,
        titleStyle,
        bottonTitleStyleView,
        isLoading = false,
        onPress,
        banerStyle = false,
        disabled = false
    } = props;

    return (
        <View>
            {isLoading == true ?
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                        height={imageStyle?.height ? imageStyle?.height : 82}
                        width={style?.width ? style?.width : imageStyle?.width ? imageStyle?.width : wp('97.1%')}
                        borderTopRightRadius={8}
                        borderBottomLeftRadius={8}
                        marginTop={style?.marginTop ? style?.marginTop : 7}
                        marginHorizontal={wp('3%')} />
                </SkeletonPlaceholder>
                :
                <View style={banerStyle ? { width: wp('94.5%'), marginLeft: wp('2.5%') } : {}}>
                    <TouchableOpacity onPress={onPress} style={[styles.banerContainer, style, {
                        borderWidth: border ? 0.7 : 0,
                        borderColor: border ? '#B98D5B' : Colors.White,
                        flexDirection: title ? 'row' : 'column',
                        alignItems: 'center',
                    }]} disabled={disabled} activeOpacity={0.8}>

                        {image &&
                            <ProgressiveImage
                                style={[styles.bestSellersBaner, imageStyle]}
                                source={image}
                            />
                        }

                        {title &&
                            <View style={{ marginLeft: 15, flex: 1 }}>
                                <Label style={[styles.banerTitle, titleStyle]} text={title} />
                            </View>}
                    </TouchableOpacity>

                    {titleBottom &&
                        <View style={[{ alignItems: 'center', marginTop: 4, }, bottonTitleStyleView]}>
                            <Label style={styles.bottomTitle} text={titleBottom} />
                        </View>}
                </View>
            }
        </View>
    )
});

const styles = StyleSheet.create({
    banerContainer: {
        // marginHorizontal: wp('3%'),
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: Colors.White
    },
    bestSellersBaner: {
        width: wp('94%'),
        height: 82,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        resizeMode: "cover"
    },
    bottomTitle: {
        fontSize: 14,
        fontFamily: Typography.LatoBold,
    },
    banerTitle: {
        fontSize: 12,
        fontFamily: Typography.LatoBold
    }
});