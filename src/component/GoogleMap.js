import React from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function GoogleMap({ markers = [{ latitude: null, longitude: null }], coordinate = { latitude: null, longitude: null } }) {
    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            coordinate={{
                ...coordinate,
                latitudeDelta: 0.007,
                longitudeDelta: 0.00,
            }}>
            {
                markers.map((item, i) => (
                    <Marker coordinate={item.coordinate} key={i} />
                ))
            }
        </MapView>
    )
}