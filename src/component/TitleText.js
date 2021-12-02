import React from "react";
import { Text, StyleSheet } from "react-native";
import GS from "../GlobalStyles";

export default function TitleText({ children, style, ...props }) {
    return (
        <Text style={[styles.title, style]}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: GS.margin,
        paddingHorizontal: GS.padding_horizontal,
        fontSize: 20,
        fontFamily: GS.font_family,
        fontWeight: GS.font_weight.bold,
        color: GS.text_color,
    },
})

