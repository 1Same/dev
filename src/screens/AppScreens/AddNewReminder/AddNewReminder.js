import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import styles from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, BackButtonHeader, Loader, ToastSuccess, ToastError, AlertError, NewInputText, ComonBottomSheet } from "../../../components";
import { Size, Colors, Strings, Icon, RegularLabel, ImagePath, Label } from "../../../constants";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import { Formik } from "formik";
import * as yup from 'yup';
import { Validation, instance } from "../../../utils";
import { dateFormat } from "../../../lib";

export default AddNewReminder = ({ navigation, route }) => {

    const [datePic, setDatePic] = useState(new Date(Date.now()));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const refRBSheet = useRef();
    const refCountryRBSheet = useRef();
    const refDayRBSheet = useRef();
    const [occasionData, setOccasionData] = useState([]);
    const [country, setCountry] = useState([]);
    const [searchShowCountry, setSearchShowCountry] = useState([]);
    const [searchShowOccassion, setSearchShowOccassion] = useState([]);
    const [occassionId, setOccassionId] = useState();
    const [countryId, setCounrtyId] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [searchCtyOrCountry, setSearchCtyOrCountry] = useState('');
    const IsEdit = route.params?.id ? true : false;

    const initialValues = {
        firstName: '',
        lastName: '',
        date: '',
        occasion: '',
        country: '',
        days: '1',
        notes: ''
    };

    const [editInitialValues, setEditInitialValues] = useState(initialValues)
    const [isDateSelect, setIsDateSelect] = useState(false)

    const [dayArr, setDayArr] = useState([
        {
            "id": "1",
            "name": "1",
        },
        {
            "id": "2",
            "name": "2"
        },
        {
            "id": "3",
            "name": "3"
        },
        {
            "id": "4",
            "name": "4",
        },
        {
            "id": "5",
            "name": "5",
        },

    ]);

    const addReminderValidationSchema = yup.object().shape({
        firstName: Validation.firstName,
        lastName: Validation.lastName,
        date: yup.date().required("Please select a date."),
        occasion: yup.string().required('Please select an occasion.'),
        country: yup.string().required('Please select a country.'),
        days: yup.string().required('Please select the number of days.'),
    });

    const addReminders = (values) => {
        setIsLoadMore(true)
        const requestData = {
            first_name: values?.firstName,
            last_name: values?.lastName,
            occassion_id: occassionId,
            country_id: countryId,
            date: values?.date,
            days_before: values?.days,
            notes: values?.notes,
        };

        instance.post('/customer_add_reminder', {
            req: { "data": requestData }
        })
            .then((response) => {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    navigation.navigate('Calender');
                    ToastSuccess(userData?.message);
                    setIsLoadMore(false);
                }
                else {
                    ToastError(userData?.message);
                    setIsLoadMore(false);
                }

            }).catch(error => {
                console.log('addReminders======catch====', error);
                navigation.navigate('CatchError');
                AlertError(Strings.Other.catchError);
                setIsLoadMore(false);
            });
    };

    const updateReminders = (values) => {
        setIsLoadMore(true)
        const requestData = {
            reminder_id: route.params?.id,
            first_name: values?.firstName,
            last_name: values?.lastName,
            occassion_id: occassionId,
            country_id: countryId,
            date: values?.date,
            days_before: values?.days,
            notes: values?.notes,
        };

        instance.post('/customer_edit_reminder', {
            req: { "data": requestData }
        })
            .then(function (response) {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    navigation.navigate('Calender')
                    ToastSuccess(userData?.message)
                    setIsLoadMore(false)
                }
                else {
                    ToastError(userData?.message)
                    setIsLoadMore(false)
                }

            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('updateReminders======catch====', error);
                setIsLoadMore(false);
            });
    };

    const getCountry = (data) => {
        instance.post('/get_country', {
            req: { "data": {} }
        })
            .then(function (response) {
                const userData = JSON.parse(response.data);
                if (userData.status === 'success') {
                    setCountry(userData?.result)
                    setSearchShowCountry(userData?.result)
                }
            }).catch(error => {
                AlertError(Strings.Other.catchError);
                console.log('getCountry======catch====', error);
            });
    };

    const getOccasion = () => {
        instance.post('/get_occassion', {
            req: { "data": {} }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                setOccasionData(userData?.result)
                setSearchShowOccassion(userData?.result)
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('getOccasion======catch====', error);
        });
    };

    const editReminders = (id) => {
        setIsLoading(true)
        instance.post('/customer_view_reminder', {
            req: { "data": { reminder_id: id } }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status == 'success') {
                const apiEditData = {
                    firstName: userData.result.first_name,
                    lastName: userData.result.last_name,
                    date: new Date(userData.result.date),
                    occasion: userData.result.occassion_name,
                    country: userData.result.country_name,
                    days: userData.result.days_before,
                    notes: userData.result.notes
                }
                setDatePic(new Date(userData.result.date))
                setOccassionId(userData.result.occassion_id)
                setCounrtyId(userData.result.country_id)
                setEditInitialValues(apiEditData)
                setIsLoading(false)
                setIsDateSelect(true)
            }
            else {
                setIsLoading(false)
            }
        }).catch(error => {
            AlertError(Strings.Other.catchError);
            console.log('editReminders======catch====', error);
            setIsLoading(false)
        })
    };

    useEffect(() => {
        getCountry();
        getOccasion();
        route.params?.id ? editReminders(route.params?.id) : ''
    }, []);

    const searchData = (searchVal = '', searchType = '') => {
        const dataToFilter = searchType === 'country' ? country || [] : occasionData || [];
        const result = dataToFilter.filter((item) => item.text?.toLowerCase().includes(searchVal.toLowerCase()));
        searchType === 'country' ? setSearchShowCountry(result) :setSearchShowOccassion(result);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {isLoading ?
                <Loader mainContainer={{ marginVertical: '4%' }} />
                :
                <>
                    <BackButtonHeader
                        title={IsEdit ? "Edit Reminder" : Strings.AddNewReminder.addNewReminder}
                        containerStyle={styles.headerContainer}
                    />

                    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} >
                        <Formik
                            validationSchema={addReminderValidationSchema}
                            initialValues={editInitialValues}
                            onSubmit={values => IsEdit ? updateReminders(values) : addReminders(values)}
                            enableReinitialize={true}
                        >
                            {({ handleChange, handleBlur, handleSubmit, touched, values, errors, setFieldValue }) => (

                                <>
                                    <NewInputText
                                        inputName={Strings.AddAddress.firstName}
                                        placeholder={Strings.AddAddress.firstName}
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')}
                                        name="firstName"
                                        value={values.firstName}
                                        touched={touched.firstName}
                                        errors={errors.firstName}
                                    />
                                    <NewInputText
                                        inputName={Strings.AddAddress.lastName}
                                        placeholder={Strings.AddAddress.lastName}
                                        onChangeText={handleChange('lastName')}
                                        onBlur={handleBlur('lastName')}
                                        name="lastName"
                                        value={values.lastName}
                                        touched={touched.lastName}
                                        errors={errors.lastName}
                                    />

                                    <View style={styles.rowInputView}>
                                        <View style={[styles.inputView]}>
                                            <ComonBottomSheet
                                                onClick={() => {
                                                    refRBSheet.current.open()
                                                    setSearchCtyOrCountry('');
                                                    searchData('', 'occasion');
                                                }}
                                                name={Strings.AddNewReminder.occasion}
                                                value={values.occasion ? values.occasion : 'Select occasion'}
                                                errors={errors.occasion}
                                                touched={touched.occasion}
                                            />
                                        </View>

                                        <View style={[styles.inputView]}>
                                            <ComonBottomSheet
                                                onClick={() => {
                                                    refCountryRBSheet.current.open()
                                                    setSearchCtyOrCountry('');
                                                    searchData('', 'country');
                                                }}
                                                name={Strings.AddNewReminder.country}
                                                value={values.country ? values.country : 'Select country'}
                                                errors={errors.country}
                                                touched={touched.country}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.rowInputView}>
                                        <View style={[styles.inputView]}>
                                            <ComonBottomSheet
                                                onClick={() => { setShowDatePicker(true), Keyboard.dismiss() }}
                                                name={Strings.AddNewReminder.date}
                                                value={values.date ? dateFormat(values?.date, 'YYYY/MM/DD') : Strings.detail.selectDate}
                                                otherDownArrow={ImagePath.Other.calendar}
                                                errors={errors.date}
                                                touched={touched.date}
                                            />
                                        </View>

                                        <View style={[styles.inputView]}>
                                            <ComonBottomSheet
                                                onClick={() => refDayRBSheet.current.open()}
                                                name={Strings.AddNewReminder.earlyReminder}
                                                value={values.days ? values.days : 'Select days'}
                                                errors={errors.days}
                                                touched={touched.days}
                                            />
                                        </View>
                                    </View>

                                    <NewInputText
                                        containerStyle={{ height: 150, alignItems: 'flex-start' }}
                                        inputName={Strings.AddNewReminder.notes}
                                        placeholder={Strings.AddNewReminder.notes}
                                        onChangeText={handleChange('notes')}
                                        onBlur={handleBlur('notes')}
                                        name="notes"
                                        value={values.notes}
                                        requiredFeld={false}
                                        multiline={true}
                                        textAlignVertical="top"
                                    />

                                    <Button
                                        primaryButton
                                        disabled={isLoadMore ? true : false}
                                        title={isLoadMore ? <Loader /> : Strings.AddNewReminder.submit}
                                        onPress={() => { Keyboard.dismiss(), handleSubmit() }}
                                        style={{ marginTop: Size.x64, marginBottom: Size.xl, height: 53, marginHorizontal: Size.m, }}
                                    />

                                    {/* { DatePicker} */}
                                    {showDatePicker && (
                                        <DateTimePickerModal
                                            isVisible={showDatePicker}
                                            mode="date"
                                            minimumDate={new Date()}
                                            onConfirm={(date) => {
                                                setShowDatePicker(false)
                                                setFieldValue("date", date);
                                            }}
                                            onCancel={() => setShowDatePicker(false)}
                                            date={values?.date == '' ? new Date() : values?.date}
                                        />
                                    )}

                                    {/* {occasion bottmsheet} */}
                                    <RBSheet
                                        ref={refRBSheet}
                                        closeOnDragDown={true}
                                        closeOnPressMask={true}
                                        customStyles={{
                                            container: {
                                                borderTopLeftRadius: 36,
                                                borderTopRightRadius: 36,
                                                height: 'auto',
                                            },
                                            wrapper: {
                                                backgroundColor: "rgba(142, 142, 147, 0.42)"
                                            },
                                            draggableIcon: {
                                                backgroundColor: Colors.Black
                                            },
                                            draggableIcon: {
                                                backgroundColor: Colors.Black
                                            }
                                        }}
                                    >
                                        <View style={{ marginLeft: 17, paddingVertical: 10 }}>
                                            <RegularLabel style={{ fontSize: Size.m011, color: Colors.Black, textAlign: 'center', }} title={'Select Occasion'} />
                                        </View>
                                        <NewInputText
                                            containerStyle={{ height: 42, borderColor: Colors.Camel, marginTop: 5 }}
                                            placeholder={'Search Occasion'}
                                            name="Search"
                                            value={searchCtyOrCountry}
                                            onChangeText={(text) => {
                                                setSearchCtyOrCountry(text);
                                                searchData(text, 'occasion');
                                            }}
                                        />
                                        <Spacer style={styles.citiesTopBorder} />

                                        <ScrollView style={{ marginHorizontal: 17, height: '42%', }} showsVerticalScrollIndicator={false}>
                                            <View style={{ bottom: '1.5%' }}>
                                                {searchShowOccassion?.map((data, index) => {
                                                    return (
                                                        <TouchableOpacity key={data.id} style={[styles.cityContain, { borderBottomWidth: data.text !== 'Select Occassion' ? 1 : 0 }]}
                                                            onPress={() => {
                                                                refRBSheet.current.close()
                                                                setOccassionId(data.id)
                                                                handleChange('occasion')(data.text)
                                                            }}>
                                                            {data?.text !== "Select Occassion" && < Label style={{ fontSize:14 }} text={data?.text} />}
                                                            {data?.text !== "Select Occassion" && <Icon source={values.occasion == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />}
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                        </ScrollView>
                                    </RBSheet>

                                    {/* {county bottmsheet} */}
                                    <RBSheet
                                        ref={refCountryRBSheet}
                                        closeOnDragDown={true}
                                        closeOnPressMask={true}
                                        customStyles={{
                                            container: {
                                                borderTopLeftRadius: 36,
                                                borderTopRightRadius: 36,
                                                height: 'auto',
                                            },
                                            wrapper: {
                                                backgroundColor: "rgba(142, 142, 147, 0.42)"
                                            },
                                            draggableIcon: {
                                                backgroundColor: Colors.Black
                                            },
                                            draggableIcon: {
                                                backgroundColor: Colors.Black
                                            }
                                        }}
                                    >
                                        <View style={{ marginLeft: 17, paddingVertical: 10 }}>
                                            <RegularLabel style={{ fontSize: Size.m011, color: Colors.Black, textAlign: 'center', }} title={"Select Country"} />
                                        </View>

                                        <NewInputText
                                            containerStyle={{ height: 42, borderColor: Colors.Camel, marginTop: 5 }}
                                            placeholder={'Search Country'}
                                            name="Search"
                                            value={searchCtyOrCountry}
                                            onChangeText={(text) => {
                                                setSearchCtyOrCountry(text);
                                                searchData(text, 'country');
                                            }}
                                        />
                                        <Spacer style={styles.citiesTopBorder} />

                                        <ScrollView style={{ marginHorizontal: 17, height: '42%', }} showsVerticalScrollIndicator={false}>
                                            <View style={{}}>
                                                {searchShowCountry?.map((data, index) =>
                                                    <TouchableOpacity key={data.id} style={[styles.cityContain, { borderBottomWidth: data.text !== 'Select Country' ? 1 : 0 }]}
                                                        onPress={() => {
                                                            refCountryRBSheet.current.close()
                                                            setCounrtyId(data.id)
                                                            handleChange('country')(data.text)
                                                        }}>
                                                        <Label style={{ fontSize:14 }} text={data?.text} />
                                                        <Icon source={values.country == data.text ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </ScrollView>
                                    </RBSheet>

                                    {/* {days bottmsheet} */}
                                    <RBSheet
                                        ref={refDayRBSheet}
                                        closeOnDragDown={true}
                                        closeOnPressMask={true}
                                        customStyles={{
                                            container: {
                                                borderTopLeftRadius: 36,
                                                borderTopRightRadius: 36,
                                                height: 'auto',
                                            },
                                            wrapper: {
                                                backgroundColor: "rgba(142, 142, 147, 0.42)"
                                            },
                                            draggableIcon: {
                                                backgroundColor: Colors.Black
                                            },
                                            draggableIcon: {
                                                backgroundColor: Colors.Black
                                            }
                                        }}
                                    >
                                        <View style={{ marginHorizontal: Size.m011 }}>
                                            <RegularLabel style={{ fontSize: Size.m011, color: Colors.Black, textAlign: 'center', }} title={"Select Day"} />
                                        </View>

                                        <ScrollView style={{ margin: Size.m011 }} showsVerticalScrollIndicator={false}>
                                            {dayArr?.map((data, index) =>
                                                <TouchableOpacity key={data.id} style={styles.cityContain}
                                                    onPress={() => {
                                                        refDayRBSheet.current.close()
                                                        handleChange('days')(data.name)
                                                    }}>
                                                    <RegularLabel style={{ fontSize: Size.m0, fontFamily: Typography.PopinsRegular, color: Colors.Black }} title={data.name} />
                                                    <Icon source={values.days == data.name ? ImagePath.Other.radioBlack : ImagePath.Other.unCheckRadioBtnWhite} style={{ height: Size.xl, width: Size.xl }} />
                                                </TouchableOpacity>
                                            )}
                                        </ScrollView>
                                    </RBSheet>
                                </>
                            )}
                        </Formik>

                    </KeyboardAwareScrollView>
                </>}
        </SafeAreaView>
    )
}