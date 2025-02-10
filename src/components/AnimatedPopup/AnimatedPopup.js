import React, { useCallback, useState, useRef, useEffect } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Icon, ImagePath, Typography } from "../../constants";

const AnimatedPopup = ({ visible = false, onClose, getValue, AnimatedStyle }) => {

    const { width } = Dimensions.get("screen");
    const [sortPopup, setSortPopup] = useState(visible);
    const [isAnimating, setIsAnimating] = useState(false);
    const slideAnim = useRef(new Animated.Value(width)).current; // Start off-screen (Right)
    const backgroundAnim = useRef(new Animated.Value(0)).current;

    const sortAllData = [
        { value: 'Recommended', id: 5, sort: '', icon: ImagePath.Other.singleStar },
        { value: 'Low to High', id: 6, sort: 'low_to_high', icon: ImagePath.Other.upArrow, color: Colors.Red },
        { value: 'High to Low', id: 7, sort: 'high_to_low', icon: ImagePath.Other.downArrow, color: Colors.Green },
    ];

    const openModal = useCallback(() => {
        if (isAnimating || sortPopup) return;
        setIsAnimating(true);
        setSortPopup(true);

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0, // Move to center
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start(() => setIsAnimating(false));
    }, [isAnimating, sortPopup]);

    const closeModal = useCallback((item) => {
        if (isAnimating || !sortPopup) return;
        setIsAnimating(true);

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: width, // Move off-screen (Right)
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start(() => {
            onClose(false)
            setSortPopup(false);
            setIsAnimating(false);
        });
    }, [isAnimating, sortPopup]);

    useEffect(() => {
        if (visible == false) {
            closeModal()
        }
        else if (visible == true) {
            openModal();
        }
    }, [sortPopup, visible]);

    return (
        sortPopup && (
            <Animated.View style={[styles.overlay, {
                backgroundColor: backgroundAnim.interpolate({
                    inputRange: [0, 1], outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.01)"]
                }),
            }, AnimatedStyle]}>
                <TouchableOpacity style={styles.overlayTouchable} onPress={closeModal} disabled={isAnimating} />
                <Animated.View style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}>
                    {sortAllData?.map((item, index) => (
                        <TouchableOpacity onPress={() => { getValue(item), closeModal() }}
                            style={styles.shortContainer}
                            key={index} hitSlop={styles.hitSlop}
                        >
                            <Icon style={{ height: 15, width: 15, tintColor: item.color }} source={item?.icon} />
                            <Text style={styles.textStyle}>{item.value}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </Animated.View>
        )
    );
};

export default AnimatedPopup;

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "flex-end",
        zIndex: 10, // Make sure it's above other components
        right: 5,
        top: '15%',
    },
    overlayTouchable: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
    },
    modal: {
        position: "absolute",
        backgroundColor: Colors.White,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 20, // Ensure modal is on top
    },
    shortContainer: {
        marginVertical: 7,
        flexDirection: "row",
        alignItems: "center",
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    },
    textStyle: {
        color: Colors.Black,
        marginLeft: 5,
        fontFamily: Typography.LatoMedium,
    }
});
