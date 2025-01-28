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
        addonViewStyle
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

                            {(heartIcon || loader) &&
                                < TouchableOpacity onPress={onClick} style={styles.likeContainer} activeOpacity={0.7}>
                                    {loader ? <Loader loadStyle={styles.wishlistLoader} size={'small'} /> :
                                        <Icon source={heartIcon} style={[{ width: 19, height: 17, }, heartIconStyle]} />
                                    }
                                </TouchableOpacity>}

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
    wishlistLoader: {
        backgroundColor: null,
        padding: 0,
        borderRadius: 0,
        elevation: 0
    },
});


// import React, { memo } from "react";
// import { StyleSheet, View, TouchableOpacity } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { Colors, Typography, Label, Spacer, ImagePath, Icon } from "../../constants"
// import SkeletonPlaceholder from "react-native-skeleton-placeholder";
// import ProgressiveImage from "../ProgressiveImage/ProgressiveImage";
// import Loader from "../Loader/loader";

// const ListProduct = (props) => {

//     const {
//         clickOnIncrement,
//         value = 0,
//         isLoading,
//         clictOnDecrement,
//         description,
//         oldPrice,
//         descriptionStyle,
//         onClickProduct,
//         clickOnAddonButton,
//         loader = false,
//         addonButton,
//         productImage,
//         productName,
//         heartIconStyle,
//         productPrice,
//         disabled = false,
//         productOldPricePriceStyle,
//         heartIcon,
//         onClick, style,
//         productImageStyle,
//         productNameView,
//         productPriceStyle,
//         productNameStyle,
//         numberOfLines,
//         source,
//         rupeesIconStyle,
//         rating_avg,
//         review_count,
//         delivery_frequency,
//         addonIcon,
//         addonIconStyle,
//         addonViewStyle
//     } = props;

//     return (
//         <>
//             {
//                 isLoading ?
//                     <SkeletonPlaceholder>
//                         <SkeletonPlaceholder.Item
//                             height={productImageStyle?.height ? productImageStyle?.height + wp('5%') : null}
//                             width={productImageStyle?.width ? productImageStyle?.width : null}
//                             marginTop={style?.marginTop}
//                             marginLeft={style?.marginLeft}
//                             borderBottomLeftRadius={productImageStyle?.borderBottomLeftRadius}
//                             borderTopRightRadius={productImageStyle?.borderTopRightRadius}
//                         />
//                     </SkeletonPlaceholder>
//                     :
//                     <>
//                         <TouchableOpacity
//                             style={[styles.addonContainer, style]}
//                             activeOpacity={0.8}
//                             onPress={onClickProduct}
//                             disabled={disabled}
//                         >
//                             {productImage &&
//                                 <ProgressiveImage
//                                     style={[styles.addonIcon, productImageStyle]} source={productImage} resizeMode="cover"
//                                 />
//                             }
//                             {addonIcon && <View style={[styles.addonView, addonViewStyle]}>
//                                 <Icon style={addonIconStyle} source={addonIcon} />
//                             </View>}

//                             {(productName || description) &&
//                                 <View style={[styles.productNameView, productNameView]}>
//                                     <Label style={[styles.productName, productNameStyle]} text={productName} numberOfLines={numberOfLines ? numberOfLines : 2} />

//                                     {description && <View style={{ width: wp('27.1'), alignItems: 'center' }}>
//                                         <Label style={[styles.productDescription, descriptionStyle]} text={description} numberOfLines={4} />
//                                     </View>}
//                                 </View>}

//                             <View style={[{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: oldPrice ? 8 : 0, marginTop: oldPrice ? 6 : 0 }]}>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>

//                                     {productPrice &&
//                                         <View style={{ alignItems: addonButton ? 'center' : 'flex-start', flex: addonButton ? 1 : null }}>
//                                             <View style={{ flexDirection: source ? 'row' : 'column', alignItems: 'center' }}>
//                                                 {source && <Icon style={[{ width: 12.5, height: 12.5 }, rupeesIconStyle]} source={source} />}
//                                                 {productPrice !== '' && <Label style={[styles.productPrice, productPriceStyle]} text={productPrice} />}
//                                             </View>
//                                         </View>}

//                                     {oldPrice !== undefined &&
//                                         <View style={{ justifyContent: 'flex-end', alignItems: addonButton ? 'center' : 'flex-start', marginLeft: 5, top: 0 }}>
//                                             <View style={{}}>
//                                                 <View style={{ flexDirection: source ? 'row' : 'column', alignItems: 'center' }}>
//                                                     <Label style={[styles.productPrice, { marginLeft: 1, color: Colors.BorderColor }, productOldPricePriceStyle]} text={oldPrice} />
//                                                 </View>
//                                                 <View style={[styles.disCountBoder, { backgroundColor: Colors.BorderColor, borderColor: Colors.BorderColor }]} />
//                                             </View>
//                                         </View>}
//                                 </View>

//                                 {(rating_avg || review_count || delivery_frequency) &&
//                                     <View style={styles.productRatingCon}>
//                                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                             <Label style={[styles.deliveryLabel, { color: Colors.Concord }]} text={rating_avg} />
//                                             <View style={{ marginLeft: 1 }}>
//                                                 <Icon style={styles.ratingIcon} source={ImagePath.Other.singleStar} />
//                                             </View>
//                                             <Label style={[styles.deliveryLabel, { marginLeft: 3, color: Colors.Concord }]} text={review_count} />
//                                         </View>

//                                         {delivery_frequency ?
//                                             <View style={styles.samedayDay}>
//                                                 {delivery_frequency == 'Today' && <Label style={{ fontSize: 11, }} text={delivery_frequency == 'Today' ? Strings.Other.earliestDelivery : delivery_frequency == 'Tomorrow' ? `Delivery by ${delivery_frequency}` : null} />}
//                                             </View>
//                                             : <View />
//                                         }
//                                     </View>}

//                                 {addonButton &&
//                                     <>
//                                         < TouchableOpacity onPress={clickOnAddonButton} style={[styles.addonAddButtonContainer, { justifyContent: value === 0 ? 'center' : "space-between", }]}
//                                             activeOpacity={0.8} disabled={value > 0 ? true : false}>
//                                             {value === 0 ?
//                                                 < Label style={{ fontSize: 13, color: Colors.Camel, fontFamily: Typography.poppinsMedium }} text={'ADD'} />
//                                                 :
//                                                 <>
//                                                     <TouchableOpacity onPress={clictOnDecrement}
//                                                         style={[styles.addonAddButtonView, { height: 31 }]} activeOpacity={0.7}>
//                                                         <Spacer style={styles.decrementView} />
//                                                     </TouchableOpacity>

//                                                     <View style={{ flex: 1, height: 31, justifyContent: 'center', alignItems: 'center' }}>
//                                                         <Label style={styles.productCount} text={value} />
//                                                     </View>

//                                                     <TouchableOpacity onPress={clickOnIncrement}
//                                                         style={[styles.addonAddButtonView, { paddingTop: 1 }]} activeOpacity={0.7}>
//                                                         <Label style={styles.productDecrement} text='+' />
//                                                     </TouchableOpacity>

//                                                 </>
//                                             }
//                                         </TouchableOpacity>
//                                         <Spacer style={{ marginTop: 4 }} />
//                                     </>
//                                 }

//                             </View>
//                         </TouchableOpacity >

//                         {heartIcon && < TouchableOpacity onPress={onClick} style={styles.likeContainer} activeOpacity={0.7}>
//                             {loader ? <Loader loadStyle={styles.wishlistLoader} size={'small'} /> :
//                                 <Icon source={heartIcon} style={[{ width: 19, height: 17, }, heartIconStyle]} />
//                             }
//                         </TouchableOpacity>}
//                     </>
//             }
//         </>

//     )
// }
// export default memo(ListProduct)

// const styles = StyleSheet.create({
//     addonContainer: {
//         borderWidth: 1,
//         borderColor: Colors.Silver,
//         borderRadius: 3,
//         padding: 5,
//         alignItems: 'center',
//         backgroundColor: Colors.White
//     },
//     addonIcon: {
//         width: wp('26.7%'),
//         height: wp('26.7%')
//     },
//     addonAddButtonContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: Colors.Camel,
//         borderRadius: 3,
//         height: 33,
//         width: wp('26%')
//     },
//     addonAddButtonView: {
//         width: 35,
//         justifyContent: 'center',
//         alignItems: "center",
//     },
//     productName: {
//         fontSize: 13.5,
//         color: Colors.DoveGrayNew,
//         lineHeight: 16,
//         fontFamily: Typography.LatoBold
//     },
//     productPrice: {
//         fontSize: 12,
//         color: Colors.Black,
//         fontFamily: Typography.poppinsSemiBold,
//     },
//     productDecrement: {
//         fontSize: 20,
//         fontFamily: Typography.poppinsMedium
//     },
//     productCount: {
//         fontFamily: Typography.poppinsMedium,
//         paddingTop: 2
//     },
//     productNameView: {
//         width: wp('26.7%'),
//         alignItems: "center",
//         paddingVertical: 5,
//     },
//     productDescription: {
//         color: Colors.Dune,
//         fontSize: 11,
//         fontFamily: Typography.poppinsRegular,
//         textAlign: 'center'
//     },
//     decrementView: {
//         backgroundColor: Colors.Black,
//         width: 9,
//         height: 2.3,
//         marginTop: 2
//     },
//     disCountBoder: {
//         bottom: Platform.OS == 'ios' ? 10 : 10,
//         borderWidth: .3,
//     },
//     productRatingCon: {
//         marginTop: 5,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         width: wp('40%'),
//         marginBottom: 12
//     },
//     ratingIcon: {
//         width: 13,
//         height: 13
//     },
//     deliveryLabel: {
//         fontSize: 11,
//         color: Colors.Black
//     },
//     samedayDay: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderRadius: 2,
//     },
//     likeContainer: {
//         width: 36,
//         height: 36,
//         borderRadius: 100,
//         backgroundColor: Colors.White,
//         justifyContent: 'center',
//         alignItems: 'center',
//         margin: 1,
//         elevation: 4,
//         zIndex: 2,
//         position: "absolute",
//         right: 0
//     },
//     wishlistLoader: {
//         backgroundColor: null,
//         padding: 0,
//         borderRadius: 0,
//         elevation: 0
//     },
//     addonView: {
//         position: 'absolute',
//         right: 5,
//         top: 8
//     }
// })