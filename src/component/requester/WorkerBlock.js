import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import IconButton from '../IconButton';
import GlobalContext from '../../GlobalContext';
import GS, { BS } from '../../GlobalStyles';
import ContentView from '../ContentView';

export default function WorkerBlock({ navigation, route, select = () => { }, ...props }) {
    return (
        //블록이 특수하게 생겨서 Block 컴포넌트로 감싸지 않았음.
        <GlobalContext.Consumer>
            {state => (
                <ContentView style={[{ flexDirection: 'row', paddingHorizontal: 0 }, props.selected && styles.selected]}
                    onTouchEnd={e => {
                        !props.selected ? select(props) : select(null);
                    }}>
                    <View style={styles.profileImage}>
                        <Text style={{ fontWeight: GS.font_weight.bold, color: '#eee' }}>{props.workerNickname}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.title}>
                            <Text style={styles.titleText}>{props.workerName} 작업자</Text>
                            <IconButton
                                onPress={() =>
                                    navigation.navigate('WorkerDetail', {
                                        userData: state.userData,
                                        workerData: props,
                                    })
                                }
                            >
                                <View
                                    style={styles.openButton}
                                    onTouchEnd={e => e.stopPropagation()}>
                                    <Image
                                        style={{ width: '100%', height: '100%', opacity: 0.7 }}
                                        source={require('../../../public/forward_black.png')}
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
                </ContentView>
            )}
        </GlobalContext.Consumer >
    );
}

const styles = StyleSheet.create({
    ...BS,
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
        paddingHorizontal: GS.padding_horizontal
    }
});
