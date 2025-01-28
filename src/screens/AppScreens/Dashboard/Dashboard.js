import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, View, FlatList, Modal, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import styles from "./styles";
import { Colors, Label, Spacer, Strings, Icon, Size, ImagePath, RegularLabel } from "../../../constants";
import { BackButtonHeader, Button, AlertError } from "../../../components";
import { instance } from "../../../utils";
import { useIsFocused } from "@react-navigation/native";
import { dateFormat } from "../../../lib";

export default Dashboard = ({ navigation }) => {

    const [reminderData, setReminderData] = useState([]);
    const [openReminder, setOpenReminder] = useState(false);
    const focus = useIsFocused();
    const navigationTimeoutRef = useRef(null);

    const wishList = require('../../../assets/Images/Other/heart.png')
    const backIcon = require('../../../assets/Images/Other/profile-background.png')
    const box = require('../../../assets/Images/Other/box.png')
    const user = require('../../../assets/Images/Other/user.png')
    const contact = require('../../../assets/Images/Other/contact.png')
    const reminder = require('../../../assets/Images/Other/reminder.png')
    const changePass = require('../../../assets/Images/Other/changePass.png')

    const Data = [
        { id: 11, title: 'MY ORDERS & RETURN', icon: box, goto: 'OrderHistory', "borderColor": Colors.SpunPearl, "bgColor": Colors.AthensGray },
        { id: 12, title: 'PROFILE', icon: user, goto: 'MyProfile', "borderColor": Colors.Camel, "bgColor": Colors.WhiteLinen },
        { id: 13, title: 'ADDRESS', icon: contact, goto: 'AddressBook', "borderColor": Colors.PoloBlue, "bgColor": Colors.WhiteLilac },
        { id: 14, title: 'REMINDER', icon: reminder, goto: 'Calender', "borderColor": Colors.SpunPearl, "bgColor": Colors.AthensGray },
        { id: 15, title: 'WISHLIST', icon: wishList, goto: 'Wishlist', "borderColor": Colors.Camel, "bgColor": Colors.WhiteLinen },
        { id: 16, title: 'CHANGE PASSWORD', icon: changePass, goto: 'ChangePassword', "borderColor": Colors.PoloBlue, "bgColor": Colors.WhiteLilac },
    ];

    const getUpcomingReminder = () => {
        instance.post('/next_reminder', {
            req: { "data": {} }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success' && userData.result) {
                    if (Object.keys(userData.result).length != 0) {
                        setReminderData(userData.result)
                    }
                }
            }).catch(error => {
                console.log('getUpcomingReminder======catch===', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
            });
    };

    useEffect(() => {
        if (focus == true) {
            getUpcomingReminder();
        }
    }, [focus, reminderData])

    const getReminderText = () => {
        if (reminderData && reminderData.full_name && reminderData.occassion_name) {
            return `Hey, Don't Forget ${reminderData.full_name} ${reminderData.occassion_name} is coming Soon`;
        } else {
            return 'Add New Reminder';
        }
    };

    const handleNavigate = (route) => {
        if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
        }
        navigationTimeoutRef.current = setTimeout(() => {
            navigation.navigate(route);
        }, 100);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>

            <View style={{ flex: 1 }}>
                <View style={styles.headerTopContainer}>
                    <BackButtonHeader
                        containerStyle={styles.headerContainer}
                        titleStyle={{ color: Colors.White }}
                        title={Strings.Dashboard.dashboard}
                        arrowStyle={{ tintColor: Colors.White }}
                    />

                    <View style={[styles.titleContainer, { marginTop: 10 }]}>
                        <Label style={styles.titleStyle} text={getReminderText()} />
                        <Spacer />
                    </View>
                    {Object.keys(reminderData).length === 0 || !reminderData.full_name || !reminderData.occassion_name ?
                        <View style={{
                            width: '79%', marginLeft: '10.5%',
                            bottom: '2.4%', marginTop: 10,
                        }}>
                            <Button
                                onPress={() => handleNavigate('AddNewReminder')}
                                style={styles.buttonContainerNewReminder}
                                labelStyle={styles.labelStyleNewReminder}
                                primaryButton
                                title='Add New Reminder'
                            />
                        </View>
                        :
                        <View style={[styles.buttonMainContainer, {
                            width: '79%', justifyContent: 'space-between', marginLeft: '10.5%',
                            bottom: '2.4%', marginTop: 10
                        }]}>
                            <Button
                                onPress={() => setOpenReminder(true)}
                                style={styles.buttonContainer}
                                labelStyle={styles.labelStyle}
                                primaryButton
                                title='View Reminder'
                            />
                            {openReminder == true &&
                                <Modal
                                    animationType="none"
                                    transparent={true}
                                    visible={openReminder}
                                    onRequestClose={() => {
                                        setOpenReminder(false);
                                    }}>
                                    <View style={styles.mainViewModal}>
                                        <View style={{ backgroundColor: '#fff', width: '80%', borderRadius: 10 }}>
                                            <View style={styles.subTitleView}>
                                                <RegularLabel title={`${'Reminder Details'}`} regularStyle={{ color: Colors.White }} />
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => setOpenReminder(!openReminder)} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
                                                    <Icon source={ImagePath.Home.crossPink} style={{ height: Size.m, width: Size.m, tintColor: Colors.White }} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ marginTop: 10, paddingHorizontal: 10, paddingVertical: 15 }}>
                                                <View style={styles.mainNameView}>
                                                    <View style={{ width: "30%" }}>
                                                        <RegularLabel title={`${'Name : '}`} regularStyle={{ color: Colors.Black, }} />
                                                    </View>
                                                    <View style={{ width: "50%", }}>
                                                        <RegularLabel title={`${reminderData.full_name}`} regularStyle={{ color: Colors.Black }} />
                                                    </View>
                                                </View>
                                                <View style={[styles.mainNameView, { marginTop: 10, }]}>
                                                    <View style={{ width: "30%" }}>
                                                        <RegularLabel title={`${'Ocassion : '}`} regularStyle={{ color: Colors.Black }} />
                                                    </View>
                                                    <View style={{ width: "50%" }}>
                                                        <RegularLabel title={`${reminderData.occassion_name}`} regularStyle={{ color: Colors.Black }} />
                                                    </View>
                                                </View>
                                                <View style={styles.mainDateView}>
                                                    <View style={{ width: "30%" }}>
                                                        <RegularLabel title={`${'Date : '}`} regularStyle={{ color: Colors.Black }} />
                                                    </View>
                                                    <View style={{ width: "50%" }}>
                                                        <RegularLabel title={`${dateFormat(reminderData.created, 'MMM D, YYYY')}`} regularStyle={{ color: Colors.Black }} />
                                                    </View>
                                                </View>
                                                <View style={styles.mainDateView}>
                                                    <View style={{ width: "30%" }}>
                                                        <RegularLabel title={`${'Country : '}`} regularStyle={{ color: Colors.Black }} />
                                                    </View>
                                                    <View style={{ width: "50%" }}>
                                                        <RegularLabel title={`${reminderData.country_name}`} regularStyle={{ color: Colors.Black }} />
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 10, marginHorizontal: 15 }}>
                                                    <View style={{ width: "30%" }}>
                                                        <RegularLabel title={`${'Notes : '}`} regularStyle={{ color: Colors.Black }} />
                                                    </View>
                                                </View>
                                                <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                                                    <RegularLabel title={reminderData.notes} regularStyle={{ color: Colors.Black }} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>}
                            <Button
                                onPress={() => navigation.navigate('AddNewReminder')}
                                style={styles.buttonContainerNewReminder}
                                labelStyle={styles.labelStyleNewReminder}
                                primaryButton
                                title='Add New Reminder'
                            />
                        </View>}
                    <Spacer style={{ marginTop: Size.m0 }} />
                </View>

                <FlatList
                    data={Data}
                    numColumns={2}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<Spacer style={{ marginTop: 0, height: 12, width: '100%' }} />}
                    ListHeaderComponent={<Spacer style={{ marginTop: 0, height: 12, width: '100%' }} />}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity activeOpacity={0.6}
                                onPress={() => item?.goto == 'MyProfile' ? handleNavigate('AccountStack', { screen: item?.goto, params: { 'flow': 'Dashboard' } }) : handleNavigate(item?.goto)}
                                // onPress={() => item?.goto == 'MyProfile' ? navigation.navigate('AccountStack', { screen: item?.goto, params: { 'flow': 'Dashboard' } }) : navigation.navigate(item?.goto)}
                                style={[styles.DashboardList, {
                                    borderColor: item.borderColor,
                                    backgroundColor: item.bgColor
                                }]}>
                                <ImageBackground style={styles.backgroungIcon} source={backIcon} resizeMode="stretch">
                                    <View style={{ paddingTop: Size.m011, paddingLeft: Size.xm2, flex: 1, }}>
                                        <Icon source={item.icon} style={styles.icon} />
                                        <View style={{ marginTop: Size.xs3, width: '65%' }}>
                                            <Label style={styles.dashboard} text={item.title} />
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>

        </SafeAreaView >
    )
}