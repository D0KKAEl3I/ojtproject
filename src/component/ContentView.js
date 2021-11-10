import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import GS from "../GlobalStyles";

export default function ContentView({ title, label, children, style, ...props }) {
    useEffect(() => {
        if (label == "") {
            throw new Error("라벨에 빈 문자열을 사용할 수 없습니다.")
        }
    }, [])
    return (
        <View {...props} style={styles.container}>

            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.content, style]}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    content: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginHorizontal: 8,
        paddingHorizontal: GS.padding_horizontal,
        overflow: 'hidden'
    },

    label: {
        fontFamily: GS.font_family,
        fontWeight: GS.font_weight.regular,
        color: GS.text_color,
        opacity: 0.7,
        marginTop: 0,
        margin: GS.margin,
        paddingHorizontal: GS.padding_horizontal,
    }
})