import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import KeyboardAvoidingView from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";
import GlobalContext from "../GlobalContext";

const animDuration = 200;
export default function BackgroundFilter({ show }) {
    const context = useContext(GlobalContext)
    const [showFilter, setShowFilter] = useState(false)

    const fadeAnim = useRef(new Animated.Value(0)).current
    const fadeIn = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: animDuration,
            useNativeDriver: true
        }).start()
    })
    const fadeOut = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: animDuration,
            useNativeDriver: true
        }).start()
    })

    const open = useCallback(() => {
        setShowFilter(true);
        fadeIn();
    });
    const close = useCallback(() => {
        fadeOut()
        setTimeout(() => {
            setShowFilter(false)
        }, animDuration);
    })

    useEffect(() => {
        show ? open() : close()
    }, [show])

    return (
        <Animated.View style={[styles.backgroundFilter, { opacity: fadeAnim, display: showFilter ? 'flex' : 'none' }]} />
    )
}

const styles = StyleSheet.create({
    backgroundFilter: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000a',
        zIndex: 9
    }
})