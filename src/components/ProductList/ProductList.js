import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, Typography, Label, Spacer, ImagePath, Icon, Strings } from "../../constants"
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProgressiveImage from "../ProgressiveImage/ProgressiveImage";
import Loader from "../Loader/loader";

const ListProduct = (props) => {

    const {
        clickOnIncrement,
        value = 0,
        isLoading,
        clictOnDecrement,
        oldPrice,
        onClickProduct,
        clickOnAddonButton,
        loader = false,
        addonButton,
        productImage,
        productName,
        heartIconStyle,
        productPrice = '',
        disabled = false,
        productOldPricePriceStyle,
        heartIcon,
        onClick, style,
        productImageStyle,
        productNameView,
        productPriceStyle,
        productNameStyle,
        numberOfLines,
        rating_avg,
        review_count,
        delivery_frequency,
        addonIcon,
        addonIconStyle,
        addonViewStyle,
        offerIcon
    } = props;

    return (
        <>
            {
                isLoading ?
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item
                            height={productImageStyle?.height ? productImageStyle?.height + wp('5%') : null}
                            width={productImageStyle?.width ? productImageStyle?.width : null}
                            marginTop={style?.marginTop}
                            marginLeft={style?.marginLeft}
                            borderBottomLeftRadius={productImageStyle?.borderBottomLeftRadius}
                            borderTopRightRadius={productImageStyle?.borderTopRightRadius}
                        />
                    </SkeletonPlaceholder>
                    :
                    <>
                        <TouchableOpacity
                            style={[styles.addonContainer, style]}
                            activeOpacity={0.8}
                            onPress={onClickProduct}
                            disabled={disabled}
                        >
                            {productImage &&
                                <ProgressiveImage
                                    style={[styles.addonIcon, productImageStyle]} source={productImage} resizeMode="cover"
                                />
                            }

                            {addonIcon && <View style={[styles.addonView, addonViewStyle]}>
                                <Icon style={addonIconStyle} source={addonIcon} />
                            </View>}

                            {((heartIcon || loader) && productName) &&
                                < TouchableOpacity onPress={onClick} style={styles.likeContainer} activeOpacity={0.7} hitSlop={styles.hitSlop}>
                                    {loader ? <Loader loadStyle={styles.wishlistLoader} size={'small'} /> :
                                        <Icon source={heartIcon} style={[{ width: 19, height: 17, }, heartIconStyle]} />
                                    }
                                </TouchableOpacity>}

                            {(offerIcon && productName) && < View style={styles.offerIcon}>{offerIcon}</View>}

                            <View style={{ flex: 1, paddingVertical: 10, }}>
                                {(productName) &&
                                    <View style={[styles.productNameView, productNameView]}>
                                        <Label style={[styles.productName, productNameStyle]} text={productName} numberOfLines={numberOfLines ? numberOfLines : 2} />
                                    </View>}

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 7 }}>
                                    {productPrice !== '' && <Label style={[styles.productPrice, productPriceStyle]} text={productPrice} />}
                                    {(oldPrice !== false && oldPrice !== undefined) && <Label style={[styles.productPrice, { fontSize: 13, }]} text={' /'} />}
                                    {(oldPrice !== false && oldPrice !== undefined) &&
                                        <View style={{ marginLeft: 5 }}>
                                            <Label style={[styles.productPrice, productOldPricePriceStyle]} text={oldPrice} />
                                            <View style={[styles.disCountBoder, { backgroundColor: Colors.Red, borderColor: Colors.Red }]} />
                                        </View>}
                                </View>

                                {(rating_avg || review_count || delivery_frequency) &&
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Label style={[styles.deliveryLabel]} text={rating_avg} />
                                            <View style={{ marginLeft: 3 }}>
                                                <Icon style={styles.ratingIcon} source={ImagePath.Other.singleStar} />
                                            </View>
                                            <Label style={[styles.deliveryLabel, { marginLeft: 12 }]} text={review_count} />
                                        </View>

                                        {delivery_frequency &&
                                            <View style={{ marginTop: 6 }}>
                                                <Text style={styles.deliveryText}>{Strings.Home.earliestDelivery}<Text style={styles.deliveryFrequency}>{delivery_frequency}</Text></Text>
                                            </View>
                                        }
                                    </View>
                                }

                                {addonButton &&
                                    <>
                                        < TouchableOpacity onPress={clickOnAddonButton} style={[styles.addonAddButtonContainer, { justifyContent: value === 0 ? 'center' : "space-between", }]}
                                            activeOpacity={0.8} disabled={value > 0 ? true : false}>
                                            {value === 0 ?
                                                < Label style={{ fontSize: 13.5, color: Colors.Black, fontFamily: Typography.RobotoBold }} text={'Add'} />
                                                :
                                                <>
                                                    <TouchableOpacity onPress={clictOnDecrement}
                                                        style={[styles.addonAddButtonView, { height: 31 }]} activeOpacity={0.7}>
                                                        <Spacer style={styles.decrementView} />
                                                    </TouchableOpacity>

                                                    <View style={{ flex: 1, height: 31, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Label style={styles.productCount} text={value} />
                                                    </View>

                                                    <TouchableOpacity onPress={clickOnIncrement}
                                                        style={[styles.addonAddButtonView, { paddingTop: 1 }]} activeOpacity={0.7}>
                                                        <Label style={styles.productDecrement} text='+' />
                                                    </TouchableOpacity>

                                                </>
                                            }
                                        </TouchableOpacity>
                                        <Spacer style={{ marginTop: 4 }} />
                                    </>
                                }
                            </View>
                        </TouchableOpacity >
                    </>
            }
        </>

    )
}
export default memo(ListProduct)

const styles = StyleSheet.create({
    addonContainer: {
        marginTop: 35,
        borderRadius: 8,
        padding: 5,
        alignItems: 'center',
        backgroundColor: Colors.White,
        marginLeft: wp('3.5%'),
        borderWidth: 0.7,
        borderColor: '#a3916163'
    },
    addonIcon: {
        width: wp('26.7%'),
        height: wp('26.7%')
    },
    addonView: {
        position: 'absolute',
        right: 5,
        top: 8
    },
    addonAddButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.BorderColor,
        height: 33,
        margin: 5,
        backgroundColor: Colors.WhiteLinen
    },
    addonAddButtonView: {
        width: 35,
        justifyContent: 'center',
        alignItems: "center",
    },
    productNameView: {
        width: wp("40%"),
    },
    productName: {
        fontSize: 14,
        color: Colors.DoveGrayNew,
        fontFamily: Typography.LatoMedium,
        flex: 1
    },
    productPrice: {
        fontSize: 13,
        color: Colors.MineShaft,
        fontFamily: Typography.RobotoMedium,
    },
    productDecrement: {
        fontSize: 20,
        fontFamily: Typography.poppinsMedium
    },
    productCount: {
        fontFamily: Typography.poppinsMedium,
        paddingTop: 2
    },
    productDescription: {
        color: Colors.Dune,
        fontSize: 11,
        fontFamily: Typography.poppinsRegular,
        textAlign: 'center'
    },
    decrementView: {
        backgroundColor: Colors.Black,
        width: 9,
        height: 2.3,
        marginTop: 2
    },
    disCountBoder: {
        bottom: Platform.OS == 'ios' ? 8 : 9,
        borderWidth: 0.9,
    },
    productRatingCon: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('40%'),
        marginBottom: 12
    },
    ratingIcon: {
        width: 13,
        height: 13,
        tintColor: Colors.Pizazz
    },
    deliveryLabel: {
        fontSize: 13,
        color: Colors.MineShaft
    },
    samedayDay: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 2,
    },
    likeContainer: {
        position: "absolute",
        width: 36,
        height: 36,
        borderRadius: 100,
        backgroundColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center',
        top: 5,
        right: 5.8
    },
    offerIcon: {
        position: "absolute",
        marginLeft: wp("3.1%"),
        top: 0,
        width: "96%",
        flexDirection: "row",
    },
    wishlistLoader: {
        backgroundColor: null,
        padding: 0,
        borderRadius: 0,
        elevation: 0
    },
    deliveryText: {
        fontSize: 12,
        color: Colors.MineShaft,
        fontFamily: Typography.RobotoRegular
    },
    deliveryFrequency: {
        fontSize: 12,
        color: Colors.Stiletto,
        fontFamily: Typography.LatoBold
    },
    hitSlop: {
        top: 8,
        left: 8,
        right: 8,
        bottom: 8
    }
});