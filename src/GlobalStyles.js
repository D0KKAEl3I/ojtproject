import { Platform, StyleSheet } from "react-native"

const GS = {
    active_color: '#4099ff',
    disabled_color: '#e0e0e0',
    background_color: '#f0f0f0',
    pressed_color: '#dadada',
    text_color: '#505050',
    text_disabled_color: '#b0b0b0',
    distructive_color: '#ff0000',
    font_family: 'Noto Sans KR',
    font_weight: {
        light: '400',
        regular: '600',
        bold: '700',
        bolder: '800',
        boldest: '900'
    },
    wrapper: {
        max_width: 512
    },
    max_width: 512,
    padding: 8,
    padding_horizontal: 16,
    margin: 8,
    border_width: 2,
    border_color: '#d0d0d0',
    border_radius: 8,
    elevation: 4,
    shadow: {
        shadowColor: '#505090',
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    linked_text: {
        color: '#0000aa',
        textDecorationColor: '#0000aa',
        textDecorationLine: 'underline',
    }
}

const BlockStyle = StyleSheet.create({
    selected: {
        backgroundColor: '#a0d9ff',
    },
    title: {
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: GS.border_color,
        borderBottomWidth: 2,
    },
    titleText: {
        fontSize: 24,
        fontWeight: GS.font_weight.bold,
        color: GS.text_color,
        fontFamily: GS.font_family,
    },
    stateText: {
        fontSize: 14,
        fontFamily: GS.font_family,
        fontWeight: GS.font_weight.boldest,
        paddingHorizontal: GS.padding,
        paddingVertical: 2,
        borderRadius: GS.border_radius,
        color: '#fff',
        ...GS.shadow,
        elevation: 4,
    },
    openButton: {
        width: 28,
        height: 28,
    },
    body: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    infoContainer: {
        flex: 1
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoIcon: {
        width: 20,
        height: 20,
        marginRight: GS.margin,
        opacity: 0.7
    },
    infoText: {
        fontSize: 20,
        fontFamily: GS.font_family,
        fontWeight: GS.font_weight.regular,
        color: GS.text_color,
    }
})

export default GS
export const BS = BlockStyle