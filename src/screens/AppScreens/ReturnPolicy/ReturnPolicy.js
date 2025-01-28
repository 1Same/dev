import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Platform, LayoutAnimation, UIManager, FlatList } from 'react-native';
import styles from "./styles";
import { Size, Colors, Strings, RegularLabel } from "../../../constants";
import { BackButtonHeader } from "../../../components";

export default ReturnPolicy = ({ navigation }) => {

    const [notificationData, setNotificationData] = useState([
        { quesId: 1, question: 'Lorem ipsum is a placeholder text commonly used to demonstrate.', isExpand: false, answer: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.' },
        { quesId: 2, question: 'Lorem ipsum is a placeholder text commonly used to demonstrate.', isExpand: false, answer: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.' },
        { quesId: 3, question: 'Lorem ipsum is a placeholder text commonly used to demonstrate.', isExpand: false, answer: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.' },
        { quesId: 4, question: 'Lorem ipsum is a placeholder text commonly used to demonstrate.', isExpand: false, answer: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.' },
        { quesId: 5, question: 'Lorem ipsum is a placeholder text commonly used to demonstrate.', isExpand: false, answer: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.' },
        { quesId: 6, question: 'Lorem ipsum is a placeholder text commonly used to demonstrate.', isExpand: false, answer: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.' }
    ])

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const toggleExpand = (quesId, isFalse) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        let newArray = notificationData;
        let isExpandArr = newArray.map((item) => (
            item.quesId === quesId ? item.isExpand == isFalse ? { ...item, isExpand: true } : { ...item, isExpand: false } : item
        ));
        setNotificationData([])
        setNotificationData(isExpandArr)
    }

    const renderList = ({ item, index }) => {
        return (
            <View style={[styles.renderContainer, { backgroundColor: Colors.White }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={styles.containContainer}>
                        <RegularLabel title={`${index + 1}.`} regularStyle={{ color: Colors.Black }} />
                    </View>
                    <View style={styles.expendContainer}>
                        <TouchableOpacity onPress={() => { toggleExpand(item.quesId, false) }}>
                            <RegularLabel title={item.question} regularStyle={{ color: Colors.Black }} />
                        </TouchableOpacity>
                        {item.isExpand &&
                            <RegularLabel title={item.answer} regularStyle={{ marginTop: Size.xm }} />
                        }
                    </View>
                    <TouchableOpacity style={styles.containContainer}
                        onPress={() => { toggleExpand(item.quesId, false) }}>
                        {item.isExpand == false ?
                            <RegularLabel title={"+"} regularStyle={{ fontSize: Size.xxl }} />
                            :
                            <RegularLabel title={"-"} regularStyle={{ fontSize: Size.xxl }} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.mainContainer}>
            <BackButtonHeader
                title={Strings.Other.returnPolicy}
                containerStyle={{ marginHorizontal: Size.xm1 }}
            />

            <FlatList
                style={{ marginTop: Size.m011 }}
                data={notificationData}
                renderItem={renderList}
                keyExtractor={item => item.id}
            />
        </SafeAreaView >
    )
}
