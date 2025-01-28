import React, { memo } from "react";
import { StyleSheet, View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { Label, Colors, Size, Typography } from "../../constants";
import { Button, ProgressiveImage } from "../index";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



const SwiperCom = (props) => {
    const { width, height } = Dimensions.get('window');

    const { icon, onPress, onClick, isLoading, onText,
        resizeMode, style, borderwidth, bannerText,
        allTitleStyle, iconStyle, bannerOnClick } = props;

    return (
        <>
            {isLoading == true ?
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                        height={iconStyle?.height ? iconStyle?.height : allTitleStyle?.height ? allTitleStyle?.height : height / 3}
                        width={iconStyle?.width ? iconStyle?.width + wp('1%') : null}
                        marginTop={style?.marginTop}
                        marginLeft={style?.marginLeft}
                        borderBottomLeftRadius={12}
                        borderTopRightRadius={12}
                    />
                </SkeletonPlaceholder>
                :
                <View>
                    <TouchableOpacity onPress={onClick} disabled={onPress ? true : false} style={[{ marginHorizontal: '3.1%', }, borderwidth ? styles.boderStyle : style]} activeOpacity={0.8}>
                        <ProgressiveImage
                            style={[iconStyle, borderwidth && styles.imageRadius]}
                            source={icon}
                            resizeMode={resizeMode ? resizeMode : "contain"}
                        // AllData={
                        //     <View style={{ flexDirection: rowReverse ? "row-reverse" : "row" }}>
                        //         <View style={emptyView}></View>

                        //         <View style={[styles.timepless, allTitleStyle, {
                        //             alignItems: right ? 'flex-end' : center ? 'center' : 'flex-start',
                        //         }]}>

                        //             <View style={{}}>
                        //                 <Label style={[styles.swiperTopTitle, { color: white ? Colors.White : Colors.Black }, labelStyle]} text={templetTitle} />
                        //                 {text2 ? <View style={{ alignItems: right ? 'flex-end' : 'flex-start', }}>
                        //                     <Label style={[styles.swiperTitle, { color: white ? Colors.White : Colors.Dune, marginVertical: 1.5 }, textStyle]} text={text2} />
                        //                 </View> : null}

                        //                 {text3 && <View style={{ alignItems: right ? 'flex-end' : 'flex-start', }}>
                        //                     <Label style={[textStyle, styles.textTitle, { color: white ? Colors.White : Colors.Black }]} text={text3} />
                        //                 </View>}
                        //             </View>

                        //             {buttonTitle && <Button
                        //                 onPress={onPress}
                        //                 disabled={onClick ? true : false}
                        //                 style={[{
                        //                     backgroundColor: CamelColor ? Colors.Camel : Colors.Black,
                        //                     height: CamelColor ? Size.x4l : Size.l - 2,
                        //                     borderRadius: CamelColor ? Size.xs1 : 0
                        //                 }, buttonStyle]}
                        //                 swiperButton
                        //                 title={buttonTitle}
                        //             />}
                        //         </View>
                        //     </View>
                        // }
                        />
                    </TouchableOpacity>

                    {/* {onText &&
                        <>
                            <View style={{ position: 'absolute', width: "60%", left: 20, top: 45, }}>
                                <Label style={{ color: Colors.White, fontSize: 14, }}
                                    text={bannerText}
                                />
                            </View>
                            <TouchableOpacity onPress={bannerOnClick} activeOpacity={0.6} style={{ width: "25%", position: 'absolute', bottom: 22, right: 20, backgroundColor: Colors.Primary.Camel, borderRadius: 10, paddingVertical: 10 }}>
                                <Label
                                    style={{ color: Colors.White, textAlign: "center" }}
                                    text={"Order Now"}
                                />
                            </TouchableOpacity>
                        </>

                    } */}
                </View >
            }
        </>
    )
};

export default memo(SwiperCom);

const styles = StyleSheet.create({
    timepless: {
        width: "42%",
        justifyContent: 'center',
    },
    boderStyle: {
        borderWidth: 1,
        borderColor: Colors.Camel,
        borderTopRightRadius: 13.2,
        borderBottomLeftRadius: 13.2,

    },
    swiperTopTitle: {
        fontSize: Size.l - 2,
        fontFamily: Typography.LatoBold
    },
    swiperTitle: {
        fontSize: Size.m - 1,
        fontFamily: Typography.LatoMedium
    },
    textTitle: {
        fontSize: Size.m1,
    },
    imageRadius: {
        borderTopRightRadius: Size.m,
        borderBottomLeftRadius: Size.m,
        overflow: 'hidden'
    }
})