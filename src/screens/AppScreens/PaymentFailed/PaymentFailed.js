import React from "react";
import { SafeAreaView, View } from "react-native";
import { Icon, ImagePath, Label, Spacer, Strings } from "../../../constants";
import styles from "./styles";
import { RowColumn } from "../../../components";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default PaymentFailed = ({ navigation, route }) => {

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.paymentFailedView}>

                <View style={{ bottom: wp('6%') }}>
                    <Icon style={styles.failedIcon} source={ImagePath.Other.cancel_payment} />
                </View>

                <Label style={styles.paymentTopTitle} text={Strings.Other.paymentFailed} />

                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Label style={styles.paymentDescription} text={`${Strings.Other.oderDescription} ${route.params?.orderId} ${Strings.Other.oderDetail}`} />
                </View>

                <RowColumn
                    onClick={() => navigation.navigate('Payment')}
                    touchableStyle={styles.paymentFailedLinkContainer}
                    viewStyle={{ flexDirection: 'row-reverse', marginVertical: 11 }}
                    title={Strings.Other.paymentFailedClik}
                    labelStyle2={styles.paymentLinkDes}
                    labelStyle={styles.paymentLink}
                    titleStyle={{ marginLeft: 0, marginRight: 5 }}
                    label='Click Here'
                />

                <Label style={styles.paymentDescription} text={`${Strings.Other.paymentFailedContect}`} />
                <Spacer style={styles.paymentFailedBottomSpace} />
            </View>
        </SafeAreaView>
    )
}