import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, FlatList, } from 'react-native';
import styles from "./styles";
import { Icon, ImagePath, Strings, Size, BoldLabel, RegularLabel, Colors } from "../../../constants";
import { BackButtonHeader, Button, Loader, ToastSuccess, ToastError, AlertError, PopUp } from "../../../components";
import { instance } from "../../../utils";
import { useIsFocused } from "@react-navigation/native";

export default AddressBook = ({ navigation }) => {

    const [select, setSelect] = useState();
    const [addressBookData, setAddressBookData] = useState([]);
    const [isLoding, setIsLoding] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(true);
    const [page, setPage] = useState(0);
    const [removeAddress, setRemoveAddress] = useState(false);
    const [itemId, setItemId] = useState();
    const isFocused = useIsFocused();

    const getAddress = (pageNo = 0, loadData = false) => {
        if ((isLoadMore && isDataFetched) || loadData) {
            let currentPage = pageNo == 1 ? 1 : page + 1
            setPage(currentPage);
            setIsDataFetched(false)
            instance.post('/customer_address_list', {
                req: { "data": { "limit": 10, "page": currentPage } }
            }).then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    if (userData.total_page <= currentPage) {
                        setIsLoadMore(false);
                    }
                    let newData = userData.result;
                    let updatedData = [...addressBookData, ...newData];
                    if (currentPage == 1) {
                        updatedData = newData
                        if (newData.length == 0) {
                            ToastError(Strings.Other.notRecord)
                        }
                    }
                    setAddressBookData(updatedData);
                }
                else {
                    setIsLoding(false);
                    ToastError(userData?.message);
                }
                setIsLoding(false);
                setIsDataFetched(true);

            }).catch(error => {
                console.log('getAddress======catch===', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setIsLoding(false);
                setIsDataFetched(true);
            });
        }
    };

    const deleteAddress = (id) => {
        setIsLoding(true)
        instance.post('/customer_delete_address', {
            req: { "data": { "address_id": id } }
        })
            .then(async (response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    getAddress(1, true);
                    ToastSuccess(userData?.message)
                }
                else {
                    ToastError(userData?.message)
                }

            }).catch(error => {
                AlertError(Strings.Other.catchError)
                console.log('deleteAddress========catch====', error);
            });
    };

    useEffect(() => {
        if (isFocused == true) {
            setPage(0);
            setIsLoding(true);
            setIsLoadMore(true);
            getAddress(1, true);
        }
    }, [isFocused]);

    useEffect(() => {
        if (addressBookData.length > 0 && !select) {
            setSelect(addressBookData[0]._id);
        }
    }, [addressBookData]);

    const listFooter = () => {
        return (
            isLoadMore == true &&
            <Loader mainContainer={{ marginBottom: Size.xl }} />
        )
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <BackButtonHeader
                title={Strings.AddressBook.title}
                containerStyle={[styles.headerContainer, {}]}
            />
            {
                isLoding == true ?
                    <Loader />
                    :
                    <View style={{ flex: 1 }}>
                        {addressBookData?.length > 0 ?
                            <FlatList
                                data={addressBookData}
                                showsVerticalScrollIndicator={false}
                                onEndReached={getAddress}
                                ListFooterComponent={listFooter}
                                onEndReachedThreshold={0.5}
                                scrollEnabled={true}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            key={item._id}
                                            activeOpacity={0.6}
                                            onPress={() => setSelect(item._id)}
                                            style={styles.touchContiner}>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                <BoldLabel title={`${item.full_name}`} boldStyle={{}} />
                                                <Icon source={select == item._id ? ImagePath.Other.radioBlack : ImagePath.Other.emptyRadio} style={{ height: Size.xl, width: Size.xl, tintColor: select == item._id ? Colors.Secondary.Black : null }} />
                                            </View>
                                            <View style={{ marginTop: Size.xm1, width: "70%" }}>
                                                <RegularLabel title={item.address} regularStyle={{ fontSize: Size.m011, }} />
                                            </View>
                                            <View style={{ marginTop: 25 }}>
                                                <RegularLabel title={`${item.city_name}${","}`} regularStyle={{ fontSize: Size.m011, }} />
                                            </View>
                                            <View style={{}}>
                                                <RegularLabel title={item.country_name} regularStyle={{ fontSize: Size.m011, }} />
                                            </View>
                                            <View style={{ marginTop: Size.xm1, flexDirection: "row" }}>
                                                <RegularLabel title={"Zipcode : "} regularStyle={{ fontSize: Size.m011, }} />
                                                <RegularLabel title={item.zipcode} regularStyle={{ fontSize: Size.m011, }} />
                                            </View>
                                            <View style={styles.iconContain}>
                                                <Icon source={ImagePath.Other.telephoneIcon} style={{ width: Size.xxll, height: Size.xxll, }} />
                                                <BoldLabel title={item.mobile_number} boldStyle={{ marginLeft: Size.xm, fontSize: Size.l }} />
                                            </View>
                                            {item.alternate_mobile_number && <View style={styles.iconContain}>
                                                <Icon source={ImagePath.Other.telephoneIcon} style={{ width: Size.xxll, height: Size.xxll, }} />
                                                <BoldLabel title={item.alternate_mobile_number} boldStyle={{ marginLeft: Size.xm, fontSize: Size.l }} />
                                            </View>}
                                            <View style={styles.iconContain}>
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('AddAddress', { title: Strings.AddAddress.editAddress, address_id: item._id, })} style={styles.iconView}>
                                                    <Icon source={ImagePath.Other.edit} style={styles.iconStyle} />
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => { setRemoveAddress(true), setItemId(item._id) }} style={[styles.iconView, { marginLeft: Size.xm1 }]}>
                                                    <Icon source={ImagePath.Other.recycleIcon} style={styles.iconStyle} />
                                                </TouchableOpacity>
                                            </View>

                                            <PopUp
                                                visible={removeAddress}
                                                onRequestClose={() => {
                                                    setRemoveAddress(false);
                                                }}
                                                title={'Are you sure?'}
                                                yesTitle={'Yes Delete it!'}
                                                cancelTitle={'Cancel'}
                                                subTitle={Strings.Calender.deleteComment}
                                                cancelOnpress={() => {
                                                    setRemoveAddress(false);
                                                }}
                                                yesOnpress={() => {
                                                    deleteAddress(itemId),
                                                        setRemoveAddress(false);
                                                }}
                                            />
                                        </TouchableOpacity>
                                    )
                                }}
                            /> :
                            <View style={{ justifyContent: "center", alignItems: "center", flex: 1, paddingHorizontal: 20 }}>
                                <BoldLabel boldStyle={{}} title={"Save your addresses now"} />
                                <View style={{ marginTop: 5 }}>
                                    <RegularLabel regularStyle={{ textAlign: 'center' }} title={"Add your home and office adresses and enjoy fastest checkout."} />
                                </View>
                            </View>
                        }
                        <View style={{ paddingVertical: 10, backgroundColor: Colors.White }}>
                            <Button
                                title={Strings.AddressBook.addNewAddress}
                                onPress={() => navigation.navigate('AddAddress')}
                                style={{ marginTop: 0 }}
                            />
                        </View>
                    </View>
            }
        </SafeAreaView>
    )
}


