import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Keyboard, } from 'react-native';
import { Size, Colors, Typography, Icon, MediumLabel, BoldLabel, OpenSansRegularLabel, RegularLabel, ImagePath } from "../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const InputText = React.forwardRef((props, ref) => {

    const { placeholder, reglarlabel, iconStyle, verifiedIcon, iconSource, mainContainerStyle,
        boldStyle, borderWidth, boldlabel, title, mediumStyle, mediumlabel, keyboardType,
        containerStyle, style, placeholderTextColor, regularStyle, borderStyle, iconPress, name,
        errors, onChangeText, onBlur, value, touched, errorStyle, errorContainStyle, secureIcon,
        multiline, asteriskSignOpenSans, asteriskSignMedium, asteriskSignBold, asteriskStyle,
        asteriskSignRegular, editable, regularTlabel, regularTStyle, textAlignVertical, maxLength, onFocus,
        returnKeyType, onSubmitEditing, enablesReturnKeyAutomatically, disabled
    } = props;

    const [openPassword, setOpenPassword] = useState(secureIcon ? true : false)

    return (
        <View style={mainContainerStyle}>
            {mediumlabel ? <MediumLabel title={title} mediumStyle={mediumStyle} /> : null}
            {boldlabel ? <BoldLabel title={title} boldStyle={boldStyle} /> : null}
            {regularTlabel ? <RegularLabel title={title} regularStyle={[regularTStyle, { fontSize: 14 }]} /> : null}
            {reglarlabel ? <OpenSansRegularLabel title={title} openSansRegularStyle={regularStyle} /> : null}
            {asteriskSignOpenSans &&
                <View style={{ flexDirection: "row" }}>
                    <OpenSansRegularLabel title={title} openSansRegularStyle={regularStyle} />
                    <RegularLabel title={"*"} regularStyle={[asteriskStyle, { color: Colors.FerrariRed, lineHeight: null }]} />
                </View>
            }
            {asteriskSignMedium &&
                <View style={{ flexDirection: "row" }}>
                    <MediumLabel title={title} mediumStyle={regularStyle} />
                    <RegularLabel title={"*"} regularStyle={[asteriskStyle, { color: Colors.FerrariRed, lineHeight: null }]} />
                </View>
            }
            {asteriskSignBold &&
                <View style={{ flexDirection: "row", }}>
                    <BoldLabel title={title} boldStyle={boldStyle} />
                    <RegularLabel title={"*"} regularStyle={[asteriskStyle, { color: Colors.FerrariRed, lineHeight: null }]} />
                </View>
            }
            {asteriskSignRegular &&
                <View style={{ flexDirection: "row" }}>
                    <RegularLabel title={title} regularStyle={[regularStyle, { fontSize: 14 }]} />
                    <RegularLabel title={"*"} regularStyle={[asteriskStyle, { color: Colors.FerrariRed, lineHeight: null }]} />
                </View>
            }
            <View style={[secureIcon ? styles.inputContainerPassword : styles.inputContainer, containerStyle]}>
                <TextInput
                    ref={ref}
                    onSubmitEditing={onSubmitEditing}
                    enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
                    name={name}
                    value={value}
                    editable={editable}
                    style={[secureIcon ? styles.secureIcon : styles.inputStyle, style,]}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    keyboardType={secureIcon ? 'default' : keyboardType}
                    onBlur={onBlur}
                    onChangeText={onChangeText}
                    secureTextEntry={openPassword}
                    multiline={multiline}
                    textAlignVertical={textAlignVertical}
                    maxLength={maxLength}
                    onFocus={onFocus}
                    returnKeyType={returnKeyType}
                />

                {verifiedIcon ? <TouchableOpacity style={{}}
                    activeOpacity={0.6} onPress={iconPress} disabled={disabled}>
                    <Icon source={iconSource} style={iconStyle} />
                </TouchableOpacity> : null}

                {secureIcon ? <TouchableOpacity onPress={() => setOpenPassword(openPassword ? false : true)}
                    activeOpacity={0.6} style={{ alignItems: 'center', flex: 0.1 }}>
                    <Icon source={openPassword ? ImagePath.Auth.hidePassword : ImagePath.Auth.openPassword} style={iconStyle} />
                </TouchableOpacity> : null}
            </View>
            {borderWidth ? <View style={[{ height: Size.xs, backgroundColor: Colors.Silver, marginHorizontal: Size.xl }, borderStyle]} /> : null}

            {errors && touched &&
                <View style={[{ marginHorizontal: Size.l, paddingVertical: Size.xs1 }, errorContainStyle]}>
                    <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 13 }, errorStyle]} title={errors} />
                </View>
            }

            {/* <View style={[errorContainStyle, { height: 18 }]}>
                {errors && touched && (
                    <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 13 }, errorStyle]} title={errors} />
                )}
            </View> */}

        </View>
    )
})

export const InputTextHome = (props) => {


    const { Image, placeholder, value, onChangeText,
        keyboardType, maxLength, style, searchIconStyle,
        IconStyle, errorStyle, errorContainStyle, onPress,
        name, returnKeyType, onSubmitEditing, blurOnSubmit, editable, searchError } = props;


    return (
        <View style={{}}>
            <View style={[styles.searchContainer, style]}>
                <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={{ paddingHorizontal: Size.xs1, marginLeft: Image ? Size.xm : IconStyle }}>
                    {Image ? <Icon style={[styles.searchIcon, searchIconStyle]} source={Image} /> : null}
                </TouchableOpacity>

                <TextInput style={{ flex: 1, height: hp('10%'), color: Colors.Black }}
                    placeholderTextColor={Colors.Black}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    value={value}
                    name={name ? name : "searchText"}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    editable={editable}
                    blurOnSubmit={blurOnSubmit}
                    returnKeyType={returnKeyType ? returnKeyType : "search"}
                    onSubmitEditing={onSubmitEditing}
                />
            </View>

            {searchError &&
                <View style={[{ marginHorizontal: Size.l, paddingVertical: Size.xs1 }, errorContainStyle]}>
                    <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 14 }, errorStyle]} title={searchError} />
                </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    inputContainer: {
        marginHorizontal: Size.xl,
        borderWidth: .8,
        borderColor: Colors.FrenchGrey,
    },
    inputContainerPassword: {
        marginHorizontal: Size.xl,
        borderWidth: .8,
        borderColor: Colors.FrenchGrey,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    inputPassContainer: {
        marginHorizontal: Size.xl,
        borderWidth: .8,
        borderColor: Colors.FrenchGrey,
        borderBottomRightRadius: Size.m1,
        borderBottomLeftRadius: Size.m1,
    },
    inputStyle: {
        fontSize: 14,
        fontFamily: Typography.LatoRegular,
        padding: Size.m1,
        flex: 1,
        color: Colors.Black
    },
    secureIcon: {
        flex: 0.9,
        fontSize: 14,
        fontFamily: Typography.LatoRegular,
        color: Colors.Black
    },
    mainStyleInput: {
        marginHorizontal: Size.xl,
        borderWidth: 0.8,
        borderColor: Colors.FrenchGrey,
        borderRadius: Size.xs1
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        height: hp('6'),
        borderColor: Colors.Camel,
        borderRadius: Size.xm,
        marginHorizontal: Size.m,
    },
    searchIcon: {
        width: Size.m0,
        height: Size.m0
    },
})




