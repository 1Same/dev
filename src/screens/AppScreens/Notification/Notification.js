import React, { useEffect, useState } from "react";
import { View, SafeAreaView, FlatList, Text } from 'react-native';
import styles from "./styles";
import { Strings, Size, RegularLabel, Colors, Spacer, Label } from "../../../constants";
import { instance } from "../../../utils";
import { BackButtonHeader, Loader, ToastError, AlertError } from "../../../components";
import { dateFormat } from "../../../lib";

export default Notification = ({ navigation }) => {


    const [isLoading, setIsLoading] = useState(false)
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [notificationData, setNotificationData] = useState([]);
    const [page, setPage] = useState(0);

    const getNotification = () => {
        let currentPage = page + 1;
        setPage(currentPage);
        if (isLoadMore) {
            instance.post('/get_notification_list', {
                req: { "data": { page: currentPage, limit: 10 } }
            }).then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    if (userData?.result?.length != 0) {
                        if (userData?.total_page <= currentPage) {
                            setIsLoadMore(false);
                        }
                        let newData = userData?.result;
                        let updatedData = currentPage != 1 ? [...notificationData, ...newData] : newData;
                        setNotificationData(updatedData);
                    } else {
                        setIsLoading(false);
                        ToastError(userData?.message);
                    }
                }
                setIsLoading(false);

            }).catch(error => {
                console.log('getNotification=====catch=====', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setIsLoadMore(false);
                setIsLoading(false);
            });
        }
    }

    useEffect(() => {
        getNotification();
        setIsLoading(true)
    }, []);

    const listingFooter = () => {
        return isLoadMore && <Loader mainContainer={{ marginVertical: '3%' }} />
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <BackButtonHeader
                containerStyle={{ marginHorizontal: Size.xm1 }}
                title={Strings.Other.notification}
            />
            {isLoading ?
                <Loader mainContainer={{ marginVertical: '4%' }} />
                :
                <View style={{ marginTop: Size.xm, flex: 1 }}>
                    {notificationData?.length > 0 ?
                        <FlatList
                            data={notificationData}
                            onEndReached={getNotification}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={listingFooter}
                            renderItem={({ item }) =>
                                <View style={{ backgroundColor: Colors.GreyGoose, borderRadius: Size.xm2, paddingHorizontal: Size.xm2, paddingVertical: Size.m011, marginHorizontal: Size.m011, marginVertical: Size.xm2, }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <RegularLabel regularStyle={{ fontSize: Size.m011 }} title={item.title} />
                                        <RegularLabel regularStyle={{ fontSize: Size.m011 }} title={dateFormat(item.created, 'MMM D, YYYY')} />
                                    </View>
                                    <Spacer style={{
                                        backgroundColor: Colors.WhiteLilac,
                                        height: 1,
                                        marginTop: 2
                                    }} />
                                    <RegularLabel regularStyle={{ fontSize: Size.m011 }} title={item.message} />
                                </View>
                            }
                        /> :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Label text={Strings.Other.notRecord} />
                        </View>}
                </View>}
        </SafeAreaView>
    )
}