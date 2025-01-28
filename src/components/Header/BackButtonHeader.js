import React, { memo, useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, BackHandler } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { Size, Icon, Strings, ImagePath, BoldLabel, Spacer, RegularLabel } from '../../constants'
import { InputTextHome } from '../../components'

const BackButtonHeader = (props) => {

    const navigation = useNavigation();
    const [selected, setSelected] = useState(false)
    const routes = navigation.getState()?.routes;


    const likeFun = () => {
        setSelected(!selected)
    };

    useEffect(() => {
        navigation?.addListener('focus', () => {
            setSelected(false);
        })
    });


    const { containerStyle,
        exploreIcon,
        optionContainer,
        likeSource,
        title,
        optionTag,
        likeContainer,
        searchContainer,
        source,
        iconStyle,
        searchStyle,
        likeStyle,
        labelStyle,
        label,
        optionOnPress,
        goto,
        titleStyle,
        arrowStyle,
        mainTitleStyle,
        onChangeText,
        value,
        onPress,
        errors,
        ClearOnPress,
        clearStyle,
        Clabel,
        ClabelStyle,
        onSubmitEditing,
        returnKeyType,
        searchError
    } = props;


    return (

        <View style={{}}>
            <View style={[containerStyle, styles.mainCon, { flexDirection: "row", alignItems: 'center' }]}>
                <TouchableOpacity activeOpacity={0.6}
                    onPress={() => navigation?.goBack()}
                    style={{ flexDirection: "row", }} hitSlop={styles.hitSlop}>
                    <Icon source={ImagePath.Auth.backArrow} style={[styles.arrow, arrowStyle]} />
                </TouchableOpacity>
                <View style={mainTitleStyle}>
                    {/* <BoldLabel title={title} boldStyle={[titleStyle, { fontSize: Size.xl, marginLeft: Size.xm }]}
                        numberOfLines={1}
                    /> */}
                    <View style={{ marginLeft: 8, }}>
                        <Icon source={ImagePath.Intro.splashLogoUpdated} style={{ height: 38, width: 145 }} />
                    </View>
                </View>

                {
                    exploreIcon ?
                        <View style={{ flexDirection: "row", }}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => likeFun()} style={searchContainer} hitSlop={styles.hitSlop}>
                                <Icon source={selected == true ? ImagePath.Home.crossPink : ImagePath.Other.searchIcon}
                                    style={[searchStyle, selected == true ? styles.crossPinkIcon : styles.searchIcon]} />
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Wishlist')} style={likeContainer} hitSlop={styles.hitSlop}>
                                <Icon source={likeSource} style={likeStyle} />
                            </TouchableOpacity>
                        </View>
                        : null
                }

                {
                    optionTag ?
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity activeOpacity={0.6} onPress={optionOnPress} style={optionContainer} hitSlop={styles.hitSlop}>
                                <Icon source={source} style={iconStyle} />
                                <BoldLabel title={label} boldStyle={labelStyle} />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.6} onPress={ClearOnPress} style={clearStyle}>
                                <BoldLabel title={Clabel} boldStyle={ClabelStyle} />
                            </TouchableOpacity>
                        </View>
                        : null
                }
            </View>
            {/* <Spacer style={styles.spacer} /> */}
            {
                selected == true ?
                    <View style={{}}>
                        <InputTextHome
                            style={{ fontSize: Size.xm2 }}
                            placeholderColor='#000'
                            Image={ImagePath.Home.searchIcon}
                            placeholder={Strings.Home.search}
                            onChangeText={onChangeText}
                            value={value}
                            onPress={onPress}
                            searchError={searchError}
                            onSubmitEditing={onSubmitEditing}
                        />
                        <Spacer style={styles.spacer} />
                        {errors &&
                            <View style={[{ marginHorizontal: Size.l, paddingVertical: Size.xs1 },]}>
                                <RegularLabel regularStyle={[{ color: Colors.FerrariRed, },]} title={errors} />
                            </View>
                        }
                    </View>
                    : null
            }

        </View>
    )
}
export default memo(BackButtonHeader)

const styles = StyleSheet.create({
    mainCon: {
        marginTop: Size.l
    },
    mainConSelected: {
    },
    arrow: {
        height: Size.xl,
        width: Size.xl,
    },
    searchIcon: {
        width: Size.l,
        height: Size.l
    },
    crossPinkIcon: {
        width: Size.m1,
        height: Size.m1
    },
    spacer: {
        marginTop: Size.m1
    },
    hitSlop: {
        top: Size.xm,
        bottom: Size.xm,
        left: Size.xm,
        right: Size.xm
    }
})
