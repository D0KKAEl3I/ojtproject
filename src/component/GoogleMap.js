import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import GS from '../GlobalStyles';

export default function GoogleMap({ markers = [{ latitude: null, longitude: null }], initialRegion = { latitude: null, longitude: null } }) {
    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={{
                ...initialRegion,
                latitudeDelta: 0.004,
                longitudeDelta: 0.00,
            }}>
            {markers.map(({ latitude, longitude }, i) => (
                <Marker coordinate={{ latitude, longitude }} key={i} />
            ))}
            <View style={styles.text}>
                <Text style={{ color: '#fff' }}
                    onPress={() => {
                        const scheme = Platform.select({ ios: 'map:0,0?q=', android: 'geo:0,0?q=' });
                        const latLng = `${initialRegion.latitude},${initialRegion.longitude}`;
                        const url = Platform.select({
                            ios: `${scheme}@${latLng}`,
                            android: `${scheme}${latLng}`
                        });

                        Linking.openURL(url)
                    }}
                >앱에서 확인하기</Text>
            </View>
        </MapView>
    )
}

const styles = StyleSheet.create({
    text: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000000a0',
        borderTopLeftRadius: GS.border_radius,
        borderBottomRightRadius: GS.border_radius,
        padding: GS.padding
    }
})