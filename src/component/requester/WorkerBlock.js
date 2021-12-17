import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import IconButton from '../IconButton';
import GlobalContext from '../../GlobalContext';
import GS, { BS } from '../../GlobalStyles';
import ContentView from '../ContentView';
import Icon from '../Icon';

export default function userBlock({ navigation, route, select = () => { }, ...props }) {
    // console.log(props);
    return (
        //블록이 특수하게 생겨서 Block 컴포넌트로 감싸지 않았음.
        <GlobalContext.Consumer>
            {state => (
                <ContentView style={[{ flexDirection: 'row', paddingHorizontal: 0 }, props.selected && styles.selected]}
                    onTouchEnd={e => {
                        !props.selected ? select(props) : select(null);
                    }}>
                    <View style={styles.profileImage}>
                        <Text style={{ fontWeight: GS.font_weight.bold, color: '#eee' }}>{props.userNickName}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.title}>
                            <Text style={styles.titleText}>{props.userName ? props.userName + '작업자' : '익명 작업자'}</Text>
                        </View>
                        <View style={styles.body}>
                            <View style={styles.infoContainer}>
                                <View style={styles.info}>
                                    <Icon style={styles.infoIcon} name="nametag" />
                                    <Text>닉네임: {props.userNickName || '없음'}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Text>작업가능여부: {props.workAvailability || '없음'}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Icon style={styles.infoIcon} name="" />
                                    <Text>총 수행 작업 수: {props.userQCW || 0}건</Text>
                                </View>
                                <View style={styles.info}>
                                    <Icon style={styles.infoIcon} name="" />
                                    <Text>소재지 주소: {props.userLocation || '없음'}</Text>
                                </View>
                            </View>
                            <Pressable
                                style={{ width: 48, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    navigation.navigate('WorkerDetail', {
                                        userData: state.userData,
                                        workerData: props
                                    })
                                }}
                            >
                                <Icon style={{ width: 40, height: 40, opacity: 0.7 }} name="forward" />
                            </Pressable>
                        </View>
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
        borderTopLeftRadius: GS.border_radius,
        borderBottomLeftRadius: GS.border_radius,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoContainer: {
        flex: 1,
        paddingHorizontal: GS.padding_horizontal
    }
});
