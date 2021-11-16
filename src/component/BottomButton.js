import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import GS from '../GlobalStyles';

export default function BottomButton({ data = [{ value: "", onPress() { } }] }) {
    const [onDoAnything, setOnDoAnything] = useState(false)

    return (
        <View style={styles.container}>
            {data.length === 1 ?
                <Pressable
                    onPress={() => {
                        setOnDoAnything(true)
                        if (onDoAnything) {
                            data[0].onPress()
                        }
                    }}
                    style={styles.button}>
                    <Text style={{ color: '#ffffff', fontWeight: GS.font_weight.bold, fontSize: 20 }}>
                        {data[0].value}
                    </Text>
                </Pressable>
                :
                data.map((item, i) => {
                    return (
                        <Pressable key={i} onPress={item.onPress} style={[styles.button, i === 0 && styles.leftSide, i === data.length - 1 && styles.rightSide]}>
                            <Text style={{ color: '#ffffff', fontWeight: GS.font_weight.bold, fontSize: 20 }}>
                                {item.value}
                            </Text>
                        </Pressable>
                    )
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        flexDirection: 'row'
    },
    button: {
        flex: 1,
        backgroundColor: GS.active_color,
        borderBottomLeftRadius: GS.borderRadius,
        borderBottomRightRadius: GS.borderRadius,
        paddingVertical: GS.padding,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 버튼 위치 방향에 따라
    leftSide: {
        borderRightWidth: 1,
        borderColor: GS.background_color,
        borderBottomRightRadius: 0
    },
    rightSide: {
        borderLeftWidth: 1,
        borderColor: GS.background_color,
        borderBottomLeftRadius: 0
    }
});
