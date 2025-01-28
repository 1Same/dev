import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Dimensions, Platform, LayoutAnimation, UIManager, FlatList } from 'react-native';
import styles from "./styles";
import { Size, Colors, Strings, Icon, ImagePath, BoldLabel, Label, } from "../../../constants";
import { AlertError, BackButtonHeader, Loader, ToastError, } from "../../../components";
import { instance } from "../../../utils";
import RenderHtml from 'react-native-render-html';


export default FAQ = ({ navigation }) => {

    const [isLoading, setLoading] = useState(false);
    const { width } = Dimensions.get('window');

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    };

    const toggleExpand = (categoryId, quesId, isFalse) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const updatedData = getFaqData.map(category => {
            if (category._id === categoryId) {
                const updatedItems = category.items.map(item =>
                    item._id === quesId ? { ...item, isExpand: !item.isExpand } : item
                );
                return { ...category, items: updatedItems };
            }
            return category;
        });
        setFaqData(updatedData);
    };

    const renderList = ({ item, index }) => {
        return (
            <View style={{}}>
                {item?.category_name && (
                    <View style={{ marginLeft: Size.xm2 }}>
                        <BoldLabel
                            title={item.category_name}
                            boldStyle={{ fontSize: Size.l, textDecorationLine: 'underline' }}
                        />
                    </View>
                )}
                <View>
                    {item.items.map((faqItem) => (
                        <TouchableOpacity
                            key={faqItem._id}
                            activeOpacity={0.6}
                            onPress={() => {
                                toggleExpand(item._id, faqItem._id, false);
                            }}
                            style={[styles.renderContainer, { backgroundColor: faqItem.isExpand ? Colors.White : Colors.Fantasy }]}
                        >
                            <View style={[styles.subContainer, { marginVertical: faqItem.isExpand ? Size.l : Size.xm }]} >
                                <View style={styles.expendContainer}>
                                    <View style={{}} >
                                        <BoldLabel title={faqItem.question.replace(/â/g, "-")} boldStyle={{}} />
                                    </View>
                                    {faqItem.isExpand && (
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{ html: faqItem.answer }}
                                        />
                                    )}
                                </View>
                                <View style={[styles.containContainer, { paddingLeft: Size.x4l }]} >
                                    {faqItem.isExpand ? (
                                        <Icon
                                            source={ImagePath.Other.downFaq}
                                            style={styles.icon}
                                        />
                                    ) : (
                                        <Icon source={ImagePath.Home.shape} style={styles.icon} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    useEffect(() => {
        getFaq()
    }, [getFaqData])

    const [getFaqData, setFaqData] = useState([])

    const getFaq = () => {
        const requestData = {
            "type": "faq",
        };
        setLoading(true);

        instance.post('/get_faq', {
            req: { "data": requestData }
        }).then(async (response) => {
            const userData = JSON.parse(response.data);
            if (userData.status === 'success') {
                const dataFaq = userData?.result?.map((resultItem) => ({
                    ...resultItem,
                }));

                const flatData = dataFaq.flatMap(item => item?.data);

                const categoryMap = new Map();
                flatData?.forEach(item => {
                    if (!categoryMap.has(item.category_name)) {
                        categoryMap.set(item.category_name, [item]);
                    } else {
                        categoryMap.get(item.category_name).push(item);
                    }
                });

                const showData = [];
                categoryMap.forEach((items, category_name) => {
                    showData.push({
                        category_name,
                        items
                    });
                });

                showData.sort((a, b) => {
                    if (a.category_name < b.category_name) {
                        return -1;
                    }
                    if (a.category_name > b.category_name) {
                        return 1;
                    }
                    return 0;
                });
                setFaqData(showData);
                setLoading(false)
            } else {
                setLoading(false)
                ToastError(userData?.message)
            }
        }).catch(error => {
            console.log('getFaq=======catch====', error);
            navigation.navigate('CatchError')
            AlertError(Strings.Other.catchError);
            setLoading(false);
        });
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {isLoading ?

                <Loader />
                :
                <View style={{ flex: 1 }}>
                    <BackButtonHeader
                        title={Strings.Other.faq}
                        containerStyle={{ marginHorizontal: Size.xm1 }}
                    />

                    {getFaqData.length > 0 ?
                        <FlatList
                            style={{ marginTop: 10 }}
                            data={getFaqData}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderList}
                        /> :
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Label text={Strings.Other?.notRecord} />
                        </View>
                    }
                </View>}
        </SafeAreaView>
    )
};