import React, { memo } from "react";
import { View, Modal } from 'react-native';
import { Colors, Size, BoldLabel, RegularLabel } from "../../constants";
import Button from "../Button/Button";

const PopUp = (props) => {

    const { title, visible, onRequestClose, subTitle, cancelOnpress, yesOnpress, yesTitle, cancelTitle } = props;

    return (
        <View style={{}}>
            <Modal
                transparent={true}
                visible={visible}
                animationType="none"
                onRequestClose={onRequestClose}>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <View style={{ backgroundColor: Colors.White, height: '21.5%', width: '80%', paddingHorizontal: 20, justifyContent: 'center', borderRadius: Size.xs1 }}>
                        <BoldLabel boldStyle={{ fontSize: 18, textAlign: 'center' }} title={title} />
                        {subTitle && <RegularLabel regularStyle={{ fontSize: 18, textAlign: 'center' }} title={subTitle} />}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                            <Button style={{ height: 43, marginRight: 5, width: 120 }}
                                onPress={yesOnpress}
                                primaryButton
                                title={yesTitle}
                            />
                            <Button style={{ height: 43, backgroundColor: Colors.Red, marginLeft: 5, width: 80 }}
                                onPress={cancelOnpress}
                                primaryButton
                                title={cancelTitle}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default memo(PopUp)