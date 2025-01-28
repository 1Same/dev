import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Linking, View, Dimensions, FlatList } from 'react-native';
import styles from "./styles";
import { Size } from "../../../constants";
import { BackButtonHeader, ReviewRating } from "../../../components";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { setting } from "../../../utils";
import { WebView } from 'react-native-webview';
import RenderHtml from 'react-native-render-html';

export default Cms = ({ route, navigation }) => {

    const [pageTitle, setPageTitle] = useState();
    const [isLoading, setLoading] = useState(true);
    const [webViewHeightNew, setWebViewHeightNew] = useState(isLoading ? 750 : 50);
    const { width } = Dimensions.get('window');

    useEffect(() => {
        setPageTitle(route.params?.pageTitle)
    }, []);

    const handleWebViewNavigationStateChange = (newNavState) => {
        const { url } = newNavState;
        if (url != setting[setting.environment].cms_url + 'mobile/cms/' + route.params?.requestPage) {
            Linking.openURL(url);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <BackButtonHeader
                title={pageTitle}
                containerStyle={{ marginHorizontal: Size.xm1 }}
            />
            {route.params?.requestPage === 'contact-us' ?
                <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 1 }}>
                    <View >
                        <WebView
                            originWhitelist={['*']}
                            source={{ uri: setting[setting.environment].cms_url + 'mobile/cms/' + route.params?.requestPage }}
                            style={{ flex: 1, width: wp('100%'), height: webViewHeightNew, margin: 5 }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            scalesPageToFit={true}
                            automaticallyAdjustContentInsets={false}
                            onNavigationStateChange={handleWebViewNavigationStateChange}
                            injectedJavaScript='window.ReactNativeWebView.postMessage(document.body.scrollHeight)'
                            onMessage={(event) => {
                                setLoading(false);
                                setWebViewHeightNew(Number(event.nativeEvent.data) + 30);
                            }}
                        />
                        {!isLoading && <ReviewRating />}
                    </View>
                </ScrollView>
                :
                < FlatList
                    data={[{}]}
                    ListFooterComponent={<ReviewRating />}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ marginHorizontal: Size.m, flex: 1 }}>
                                <RenderHtml
                                    contentWidth={width}
                                    source={{ uri: setting[setting.environment].cms_url + 'mobile/cms/' + route.params?.requestPage }}
                                    tagsStyles={{
                                        body: {
                                            whiteSpace: 'normal',
                                            color: '#4D4B4B'
                                        },
                                    }}
                                />
                            </View>
                        )
                    }}
                />
            }
        </SafeAreaView >
    )
};