import React, { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import NaverMapView, { Marker, Path, Polyline } from 'react-native-nmap';
import GS from '../GlobalStyles';

export default function NaverMap({
    markers = [{ latitude: null, longitude: null }],
    center = { latitude: null, longitude: null },
    path = [{ latitude: null, longitude: null }]
}) {
    return (
        <NaverMapView
            style={{ flex: 1 }}
            scaleBar={false}
            zoomControl={false}
            center={{
                ...center,
                zoom: 15
            }}>
            {markers.map(({ latitude, longitude }, i) => (
                <Marker coordinate={{ latitude, longitude }} pinColor="#50ff50" key={i} />
            ))}
            {
                path.length > 1 && (
                    <Path coordinates={path} color="#50ff50" outlineColor="#505050" />
                )
            }
        </NaverMapView>
    )
}

export async function getTraoptimal(coordinates = [{ latitude: null, longitude: null }]) {
    const NMAPAPIURL = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving"
    let response = await fetch(NMAPAPIURL + `?start=${coordinates[0].longitude},${coordinates[0].latitude}&goal=${coordinates[1].longitude},${coordinates[1].latitude}`, {
        headers: {
            "X-NCP-APIGW-API-KEY-ID": "z7ec4m9nap",
            "X-NCP-APIGW-API-KEY": "sCbZedTIgni1D4Ylqrl4zdo3lxk9Bd8YIjhSPBTb"
        }
    })
    response = await response.json()
    return response.route.traoptimal;
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