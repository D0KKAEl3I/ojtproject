import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import IconButton from './IconButton';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';

export default function WorkerBlock({ navigation, route, select = () => { }, ...props }) {
    return (
        <GlobalContext.Consumer>
            {state => (
                <View style={[styles.container, props.selected && styles.selected]}
                    onTouchEnd={e => {
                        !props.selected ? select(props) : select(null);
                    }}>
                    <View style={styles.profileImage}>
                        <Text style={{ fontWeight: '900', color: '#eee' }}>{props.workerNickname}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.title}>
                            <Text style={styles.titleText}>{props.workerName}</Text>
                            <IconButton
                                onPress={() =>
                                    navigation.navigate('WorkerDetail', {
                                        userData: state.userData,
                                        workerData: props,
                                    })
                                }
                                size={48}>
                                <View
                                    style={styles.openButton}
                                    onTouchEnd={e => e.stopPropagation()}>
                                    <Image
                                        style={{ width: '100%', height: '100%', opacity: 0.7 }}
                                        source={require('../../public/next_black.png')}
                                    />
                                </View>
                            </IconButton>
                        </View>
                        <Text style={styles.body}>
                            <Text style={styles.info}>
                                닉네임: {props.workerNickname}
                                {'\n'}
                            </Text>
                            <Text style={styles.info}>
                                작업가능여부: {props.workAvailability}
                                {'\n'}
                            </Text>
                            <Text style={styles.info}>
                                총 수행 작업 수: {props.workerQCW || 0}건
                                {'\n'}
                            </Text>
                            <Text style={styles.info}>
                                소재지 주소: {props.workLocation}
                                {'\n'}
                            </Text>
                            <Text style={styles.info}>
                                작업 장소까지의 거리: {props.userDistance || '미정'}
                            </Text>
                        </Text>
                    </View>
                </View>
            )}
        </GlobalContext.Consumer >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: GS.borderRadius,
        marginVertical: GS.margin / 2,
        marginHorizontal: GS.margin,
        elevation: GS.elevation,
        ...GS.shadow
    },
    profileImage: {
        width: 100,
        borderTopLeftRadius: GS.borderRadius,
        borderBottomLeftRadius: GS.borderRadius,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoContainer: {
        flex: 1,
    },
    selected: {
        backgroundColor: '#a0d9ff',
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: GS.padding * 2,
        borderBottomColor: GS.borderColor,
        borderBottomWidth: 2,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    titleText: {
        fontSize: 24,
        fontWeight: '900',
        color: GS.text_color,
        fontFamily: GS.fontFamily,
    },
    openButton: {
        width: 40,
        height: 40,
        borderRadius: 999,
    },
    body: {
        paddingVertical: 4,
        paddingHorizontal: GS.padding * 2,
    },
    info: {
        width: '100%',
        fontSize: 20,
        fontFamily: GS.fontFamily,
        color: GS.text_color,
        lineHeight: Platform.OS === "ios" ? 28 : null
    }
});
