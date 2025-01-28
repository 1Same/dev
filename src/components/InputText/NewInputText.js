import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, } from 'react-native';
import { Size, Colors, Typography, RegularLabel, Label, } from "../../constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const NewInputText = React.forwardRef((props, ref) => {

    const { placeholder, inputName, requiredFeld = true, inputNameStyle, dialCode, onClick,
        mainContainerStyle, keyboardType, containerStyle, style, placeholderTextColor, name, textAlignVertical,
        errors, onChangeText, onBlur, value, touched, errorStyle, errorContainStyle,
        multiline, editable, maxLength, onFocus, secureIcon, iconStyle,
        returnKeyType, onSubmitEditing, enablesReturnKeyAutomatically
    } = props;

    const [openPassword, setOpenPassword] = useState(secureIcon ? true : false)


    return (
        <View style={[styles.mainContainer, mainContainerStyle]}>

            {inputName &&
                <View style={{ flexDirection: "row", marginTop: errors && touched ? 10 : 14 }}>
                    <Label text={inputName} style={[inputNameStyle, { fontSize: 13.5, fontFamily: Typography.poppinsMedium, color: Colors.WoodCharcoal }]} />
                    {requiredFeld == true && < Label text={"*"} style={{ color: Colors.FerrariRed }} />}
                </View>
            }

            <View style={[styles.inputContainer, containerStyle]}>

                {dialCode &&
                    <TouchableOpacity onPress={onClick} style={styles.dialCodeView} activeOpacity={0.7}>
                        <Label style={{ fontSize: 14.5, color: Colors.WoodCharcoal }} text={dialCode} />
                    </TouchableOpacity>
                }

                <TextInput
                    ref={ref}
                    style={[secureIcon ? styles.secureIcon : styles.inputStyle, style,]}
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    onBlur={onBlur}
                    placeholderTextColor={placeholderTextColor ? placeholderTextColor : Colors.PlaceholderColor}
                    onChangeText={onChangeText}
                    editable={editable}
                    secureTextEntry={openPassword}
                    maxLength={maxLength}
                    textAlignVertical={textAlignVertical}
                    onSubmitEditing={onSubmitEditing}
                    enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
                    keyboardType={secureIcon ? 'default' : keyboardType}
                    multiline={multiline}
                    onFocus={onFocus}
                    returnKeyType={returnKeyType}
                />
                {secureIcon ? <TouchableOpacity onPress={() => setOpenPassword(openPassword ? false : true)}
                    activeOpacity={0.6} style={{ alignItems: 'center', flex: 0.1 }}>
                    <Icon source={openPassword ? ImagePath.Auth.hidePassword : ImagePath.Auth.openPassword} style={iconStyle} />
                </TouchableOpacity> : null}
            </View>

            {
                errors && touched &&
                <View style={[{}, errorContainStyle]}>
                    <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 13 }, errorStyle]} title={errors} />
                </View>
            }
            {/* <View style={[errorContainStyle, { height: 5 }]}>
                {errors && touched && (
                    <RegularLabel regularStyle={[{ color: Colors.FerrariRed, fontSize: 13 }, errorStyle]} title={errors} />
                )}
            </View> */}

        </View >
    )
})

const styles = StyleSheet.create({
    mainContainer: {
        marginHorizontal: 19
    },
    inputContainer: {
        borderWidth: .5,
        borderColor: Colors.BorderColor,
        marginTop: 1,
        borderRadius: 3,
        backgroundColor: Colors.White,
        alignItems: 'center',
        flexDirection: 'row',
        height: 46.5
    },
    inputStyle: {
        fontSize: 14.5,
        flex: 1,
        color: Colors.WoodCharcoal,
        paddingVertical: 9,
        paddingLeft: 13,
        paddingRight: 13,
        fontFamily: Typography.OpenSansRegular,
    },
    dialCodeView: {
        borderRightWidth: 0.5,
        borderColor: Colors.BorderColor,
        justifyContent: 'center',
        alignItems: 'center',
        height: 42,
        width: 60,
    },
    inputContainerPassword: {
        marginHorizontal: Size.xl,
        borderWidth: .8,
        borderColor: Colors.FrenchGrey,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    secureIcon: {
        flex: 0.9,
        fontSize: 14,
        fontFamily: Typography.LatoRegular,
        color: Colors.Black
    },
})




