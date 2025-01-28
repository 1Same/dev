import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
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

                            <View style={{ flex: 1, paddingHorizontal: 7 }}>
                                {(productName) &&
                                    <View style={[styles.productNameView, productNameView]}>
                                        <Label style={[styles.productName, productNameStyle]} text={productName} numberOfLines={numberOfLines ? numberOfLines : 2} />
                                    </View>}

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {productPrice !== '' && <Label style={[styles.productPrice, productPriceStyle]} text={productPrice} />}

                                    {oldPrice !== undefined &&
                                        <View style={{ marginLeft: 5 }}>
                                            <Label style={[styles.productPrice, productOldPricePriceStyle]} text={oldPrice} />
                                            <View style={[styles.disCountBoder, { backgroundColor: Colors.Red, borderColor: Colors.Red }]} />
                                        </View>}
                                </View>

                                {(rating_avg || review_count || delivery_frequency) &&
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Label style={[styles.deliveryLabel, { color: Colors.Concord }]} text={rating_avg} />
                                            <View style={{ marginLeft: 3 }}>
                                                <Icon style={styles.ratingIcon} source={ImagePath.Other.singleStar} />
                                            </View>
                                            <Label style={[styles.deliveryLabel, { marginLeft: 10, color: Colors.Concord }]} text={review_count} />
                                        </View>

                                        {delivery_frequency &&
                                            <View style={{ marginVertical: 5 }}>
                                                <Text style={{ fontSize: 12, color: Colors.Black, fontFamily: Typography.LatoMedium }}>{Strings.Home.earliestDelivery}<Text style={{ fontSize: 12, color: Colors.Red, fontFamily: Typography.LatoBold }}>{delivery_frequency}</Text></Text>
                                            </View>
                                        }
                                    </View>
                                }

                                {addonButton &&
                                    <>
                                        < TouchableOpacity onPress={clickOnAddonButton} style={[styles.addonAddButtonContainer, { justifyContent: value === 0 ? 'center' : "space-between", }]}
                                            activeOpacity={0.8} disabled={value > 0 ? true : false}>
                                            {value === 0 ?
                                                < Label style={{ fontSize: 13, color: Colors.Camel, fontFamily: Typography.poppinsMedium }} text={'ADD'} />
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
        marginTop: 30,
        borderRadius: 8,
        padding: 5,
        alignItems: 'center',
        backgroundColor: Colors.White,
        marginLeft: wp('3.5%'),
        elevation: 2, // For Android
        zIndex: 999, shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.2, // Shadow opacity
        shadowRadius: 4, // Shadow blur
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
        borderColor: Colors.Camel,
        borderRadius: 3,
        height: 33,
        width: wp('26%')
    },
    addonAddButtonView: {
        width: 35,
        justifyContent: 'center',
        alignItems: "center",
    },
    productNameView: {
        width: wp("38%"),
        paddingVertical: 8,
        marginTop: 2
    },
    productName: {
        fontSize: 13.5,
        color: Colors.DoveGrayNew,
        lineHeight: 16,
        fontFamily: Typography.LatoBold,
    },
    productPrice: {
        fontSize: 13,
        color: Colors.Black,
        fontFamily: Typography.poppinsSemiBold,
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
        bottom: Platform.OS == 'ios' ? 10 : 13,
        borderWidth: .8,
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
        height: 13
    },
    deliveryLabel: {
        fontSize: 13,
        color: Colors.Black
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
    hitSlop: {
        top: 8,
        left: 8,
        right: 8,
        bottom: 8
    }
});