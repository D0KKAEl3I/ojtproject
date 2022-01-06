import React from 'react'
import { Pressable, StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import GS from "../GlobalStyles";

export default function Button({ onPress, style, children }) {
    return (
        <Pressable onPress={onPress} style={[styles.container, style]}>
            {children}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: GS.border_radius,
    },
})