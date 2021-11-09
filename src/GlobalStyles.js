import { Platform } from "react-native"

const GS = {
    active_color: '#4099ff',
    ghost: {
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#4099ff',
    },
    fontFamily: Platform.OS === "ios" ? "ArialMT" : "sansserif",
    disabled_color: '#e0e0e0',
    text_color: '#505050',
    text_disabled_color: '#b0b0b0',
    red: '#ff0000',
    padding: 8,
    margin: 8,
    borderWidth: 2,
    borderColor: '#a0a0a0',
    borderRadius: 8,
    elevation: 4,
    shadow: {
        shadowColor: '#505090',
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2
    }
}
export default GS