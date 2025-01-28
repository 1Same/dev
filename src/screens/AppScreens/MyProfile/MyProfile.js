import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView } from 'react-native';
import styles from "./styles";
import { AlertError, Loader, NewHeader, NewInputText } from "../../../components";
import { Size, Colors, Strings, Icon, ImagePath, BoldLabel, RegularLabel, Spacer } from "../../../constants";
import { instance } from "../../../utils";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default MyProfile = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [profileData, setProfileData] = useState([])
    const [profileImage, setProfileImage] = useState('')
    const isFocused = useIsFocused();
    const authData = useSelector((state) => state.auth);

    useEffect(() => {
        if (isFocused == true) {
            getProfileData()
        }
    }, [isFocused]);

    const getProfileData = async (data) => {
        setIsLoading(true);
        instance.post('/customer_profile', {
            req: { "data": {} }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    const userProfiledata = {
                        firstName: userData?.result.first_name,
                        lastName: userData?.result.last_name,
                        email: userData?.result.email,
                        mobile: userData?.result.mobile,
                        email_alternate: userData?.result.email_alternate,
                        alternate_mobile: userData?.result.alternate_mobile,
                        address: userData?.result.address,
                        company_name: userData?.result.company_name,
                        date_of_anniversary: userData?.result?.date_of_anniversary,
                        date_of_birth: userData?.result?.date_of_birth,
                        gender: userData?.result.gender,
                        vat_number: userData?.result.vat_number,
                        state: userData?.result.state,
                        country: userData?.result.country_name,
                        city: userData?.result.city_name,
                        profileImage: userData?.result.profile_image ? userData?.image_path + userData?.result.profile_image : '',
                    }
                    // console.log('userData?.result======', userData);
                    setProfileImage(route?.params?.profileImg && userData?.result.profile_image ? userData?.image_path + userData?.result.profile_image :
                        authData.data?.profile_image ? authData.data?.profile_image : ''
                        // authData.data?.profile_image ? authData.data?.profile_image : userData?.result.profile_image ? userData?.image_path + userData?.result.profile_image : ''
                    )
                    setProfileData(userProfiledata);
                    setIsLoading(false)
                }
                else {
                    setIsLoading(false)
                }

            }).catch(error => {
                console.log('getProfileData=====catch====', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setIsLoading(false);
            });
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <NewHeader
                optionTag
                // title={Strings.MyProfile.myProfile}
                containerStyle={styles.subContainer}
                optionContainer={styles.editContainer}
                optionOnPress={() => navigation.navigate('EditMyProfile')}
                source={ImagePath.Other.edit}
                iconStyle={[styles.edit, { tintColor: Colors.Black }]}
                label={Strings.MyProfile.edit}
                labelStyle={styles.editlabel}
            />

            <ScrollView showsVerticalScrollIndicator={false} >

                {isLoading ? <Loader mainContainer={{ marginVertical: '4%' }} />
                    :
                    <>
                        <View style={styles.profileIcon}>
                            <Icon
                                // source={profileData?.profileImage ? { uri: profileData?.profileImage } : ImagePath.Other.emptyUser}
                                source={profileImage ? { uri: profileImage } : ImagePath.Other.emptyUser}
                                style={styles.decentProfile} resizeMode='cover' />
                        </View>

                        <View style={styles.profileName}>
                            <BoldLabel title={`${profileData?.firstName} ${profileData?.lastName}`} boldStyle={{ fontSize: Size.xl }} />
                        </View>
                        <NewInputText
                            inputName={Strings.AddAddress.firstName}
                            value={profileData?.firstName}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.AddAddress.lastName}
                            value={profileData?.lastName}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.MyProfile.address}
                            value={profileData?.address}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.MyProfile.country}
                            value={profileData?.country}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.MyProfile.city}
                            value={profileData?.city}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.EditMyprofile.state}
                            value={profileData?.state}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.MyProfile.mobileNumber}
                            value={profileData?.mobile}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.EditMyprofile.vatNumber}
                            value={profileData?.vat_number}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.EditMyprofile.dateAnniversary}
                            value={profileData?.date_of_anniversary}
                            editable={false}
                        />
                        <NewInputText
                            inputName={Strings.EditMyprofile.dob}
                            value={profileData?.date_of_birth}
                            editable={false}
                        />
                        <Spacer />
                    </>
                }
            </ScrollView>
        </SafeAreaView>
    )
}