import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import styles from "./styles";
import { Icon, ImagePath, Strings, Size, BoldLabel, RegularLabel, Colors } from "../../../constants";
import { BackButtonHeader, Button, Loader, ToastSuccess, ToastError, AlertError, PopUp } from "../../../components";
import { useIsFocused } from "@react-navigation/native";
import { instance } from "../../../utils";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { dateFormat } from "../../../lib";

export default Calender = ({ navigation }) => {

    const isFocused = useIsFocused();
    const [reminderData, setReminderData] = useState([])
    const [isLoding, setIsLoding] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(true);
    const [page, setPage] = useState(0);
    const [removeReminder, setRemoveReminder] = useState(false);
    const [itemId, setItemId] = useState();

    const getReminder = (pageNo = 0, loadData = false) => {

        if ((isLoadMore && isDataFetched) || loadData) {
            let currentPage = pageNo == 1 ? 1 : page + 1
            setPage(currentPage);
            setIsDataFetched(false)
            instance.post('/customer_list_reminder', {
                req: { "data": { "limit": 10, "page": currentPage } }
            }).then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {

                    if (userData.total_page <= currentPage) {
                        setIsLoadMore(false);
                    }
                    let newData = userData.result;
                    let updatedData = [...reminderData, ...newData];

                    if (currentPage == 1) {
                        updatedData = newData
                        if (newData.length == 0) {
                            ToastError(Strings.Other.notRecord)
                        }
                    }
                    setReminderData(updatedData);
                }
                else {
                    setIsLoding(false);
                    ToastError(userData?.message);
                }
                setIsLoding(false);
                setIsDataFetched(true);

            }).catch(error => {
                console.log('getReminder=====catch======', error);
                navigation.navigate('CatchError');
                setIsLoding(false);
                setIsDataFetched(true);
                AlertError(Strings.Other.catchError);
            });
        }
    };

    const delReminders = (id) => {
        setIsLoding(true)
        instance.post('/customer_delete_reminder', {
            req: { "data": { reminder_id: id } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status == 'success') {
                getReminder(1, true);
                ToastSuccess(userData?.message)
            }
            else {
                ToastError(userData?.message)
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('delReminders======catch===', error);
        })
    }

    useEffect(() => {
        if (isFocused == true) {
            setPage(0);
            setIsLoadMore(true);
            setIsLoding(true);
            setIsDataFetched(true);
            getReminder(1, true);
        }
    }, [isFocused])

    const listFooter = () => {
        return (
            isLoadMore == true &&
            <Loader mainContainer={{ marginBottom: Size.xxl }} />
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>

            <BackButtonHeader
                title={Strings.Calender.reminder}
                containerStyle={[styles.headerContainer, { marginTop: 10 }]}
            />
            {isLoding == true ?
                <Loader />
                :
                <View style={{ flex: 1 }}>
                    {reminderData?.length > 0 ?
                        <FlatList
                            data={reminderData}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            onEndReached={getReminder}
                            ListFooterComponent={listFooter}
                            onEndReachedThreshold={0.5}
                            renderItem={({ item }) => {
                                const date = dateFormat(item?.date, 'DD MMMM YYYY')
                                return (
                                    <View
                                        key={item._id}
                                        style={styles.touchContiner}>
                                        <View style={[styles.container, { justifyContent: 'space-between' }]}>
                                            <View style={{ width: '50%', }}>
                                                <BoldLabel title={Strings.Calender.name} boldStyle={styles.boldStyle} />
                                                <RegularLabel title={item.full_name} regularStyle={[styles.regularstyle, { paddingTop: Size.xxs }]} />
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ marginLeft: 6 }}>
                                                    <BoldLabel title={Strings.Calender.country} boldStyle={styles.boldStyle} />
                                                    <View style={{ width: wp('30%') }}>
                                                        <RegularLabel title={item?.country_name} regularStyle={[styles.regularstyle, { paddingTop: Size.xxs }]} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={[styles.container, { marginTop: Size.l, justifyContent: 'space-between' }]}>
                                            <View style={{ width: '50%' }}>
                                                <BoldLabel title={Strings.Calender.occassion} boldStyle={styles.boldStyle} />
                                                <RegularLabel title={item?.occassion_name} regularStyle={[styles.regularstyle, { paddingTop: Size.xxs }]} />
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ flex: 1, marginLeft: 6 }}>
                                                    <BoldLabel title={Strings.Calender.date} boldStyle={styles.boldStyle} />
                                                    <RegularLabel title={date} regularStyle={[styles.regularstyle, { paddingTop: Size.xxs }]} />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.iconContain}>
                                            <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('AddNewReminder', { id: item._id })}
                                                style={styles.iconView}>
                                                <Icon source={ImagePath.Other.edit} style={styles.iconStyle} />
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.6}
                                                onPress={() => { setItemId(item._id), setRemoveReminder(true) }}
                                                style={[styles.iconView, { marginLeft: Size.xm1 }]}>
                                                <Icon source={ImagePath.Other.recycleIcon} style={styles.iconStyle} />
                                            </TouchableOpacity>
                                        </View>

                                        <PopUp
                                            visible={removeReminder}
                                            onRequestClose={() => {
                                                setRemoveReminder(false);
                                            }}
                                            title={'Are you sure?'}
                                            yesTitle={'Yes Delete it!'}
                                            cancelTitle={'Cancel'}
                                            subTitle={Strings.Calender.deleteComment}
                                            cancelOnpress={() => {
                                                setRemoveReminder(false);
                                            }}
                                            yesOnpress={() => {
                                                delReminders(itemId),
                                                    setRemoveReminder(false);
                                            }}
                                        />
                                    </View>
                                )
                            }}
                        /> :
                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                            <RegularLabel regularStyle={{ textAlign: 'center' }} title={"No data found."} />
                        </View>
                    }
                    <View style={{ paddingVertical: 10, backgroundColor: Colors.White }}>
                        <Button
                            title={Strings.Calender.addNewReminder}
                            onPress={() => navigation.navigate('AddNewReminder')}
                            style={{ marginTop: 0 }}
                        />
                    </View>
                </View>
            }
        </SafeAreaView >
    )
}