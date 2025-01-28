import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Icon, ImagePath, Label, Strings } from "../../../constants";
import { useNavigation } from "@react-navigation/native";


export default CatchError = () => {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.Black }}>
            <Label style={styles.catchMessage} text={Strings.Other.catchError} />

            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginTop: 20 }} activeOpacity={0.7} hitSlop={styles.hitSlop}>
                <Icon source={ImagePath.Other.reload} style={styles.retryIcon} />
                <Label style={{ color: Colors.White, marginTop: 12,right:8 }} text={'Retry'} />
            </TouchableOpacity>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    catchMessage: {
        color: Colors.White
    },
    retryIcon: {
        tintColor: Colors.White
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    }

})