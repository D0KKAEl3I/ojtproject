import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import BottomTabMenu from '../../component/BottomTabMenu';
import AlarmBlock from '../../component/AlarmBlock';
import SearchInput from '../../component/SearchInput';
import AcceptAlarm from '../../component/AcceptAlarm.js';

import GlobalContext from '../../GlobalContext';
import GS from '../../GlobalStyles';


export default function Alarm({ navigation, route, ...props }) {
    const context = useContext(GlobalContext);

    const [onLoading, setOnLoading] = useState(false); // 로딩중인지 여부, true면 알람 리스트 대신 로딩 화면을 띄움
    const [onSearch, setOnSearch] = useState(false); // 검색중인지 여부, true면 검색 화면 표출
    const [onAcceptAlarm, setOnAcceptAlarm] = useState(false); // 알림 수락 팝업 여부, true면 수락 팝업 표출
    const [searchData, setSearchData] = useState(''); // 검색블록 속 검색내용
    const [selectedAlarm, setSelectedAlarm] = useState(null); // 선택된 알람 블럭의 알람 정보

    useEffect(() => {
        context.setContext({ status: route.name });
        async () => {
            setOnLoading(true);
            await context.loadAlarmList();
            setOnLoading(false);
        };
    }, []);

    return (
        <GlobalContext.Consumer>
            {state => (
                <View style={styles.container}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        {onLoading ? (
                            <ActivityIndicator size="large" style={{ flex: 1 }} />
                        ) : (
                            <FlatList
                                style={styles.list}
                                data={state.alarmList}
                                renderItem={({ item, index }) => (
                                    <AlarmBlock
                                        selected={
                                            selectedAlarm &&
                                            item.messageSn === selectedAlarm.messageSn
                                        }
                                        {...item}
                                        navigation={navigation}
                                        route={route}
                                        select={alarm => setSelectedAlarm(alarm)}
                                    />
                                )}
                                keyExtractor={item => item.messageSn}
                            />
                        )}
                    </View>
                    {onSearch && (
                        <KeyboardAvoidingView
                            behavior="padding"
                            style={styles.backgroundFilter}>
                            <SearchInput
                                label="작업 검색"
                                defaultValue={searchData}
                                onClose={() => {
                                    setOnSearch(false);
                                    setSearchData('');
                                    context.setContext({ status: route.name })
                                }}
                                onSubmit={data => {
                                    setOnSearch(false);
                                    setSearchData(data)
                                    context.setContext({ status: route.name })
                                }}
                            />
                        </KeyboardAvoidingView>
                    )}
                    {onAcceptAlarm && (
                        <View style={styles.backgroundFilter}>
                            <AcceptAlarm
                                data={selectedAlarm}
                                goBack={() => setOnAcceptAlarm(false)}
                            />
                        </View>
                    )}
                    <BottomTabMenu
                        data={[
                            {
                                value: '작업 검색하기',
                                onPress: () => setOnSearch(true),
                                disable: false,
                            },
                            {
                                value: '알림 수락',
                                onPress: () => setOnAcceptAlarm(true),
                                disable: !selectedAlarm && true,
                            },
                        ]}
                    />
                </View>
            )}
        </GlobalContext.Consumer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GS.background_color,
    },
    list: {
        maxWidth: 512,
    },
    backgroundFilter: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9,
        backgroundColor: '#000a',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
