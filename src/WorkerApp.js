import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, ActivityIndicator, Text, BackHandler, Alert, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';

// 스크린 컴포넌트
import WorkHomeScreen from './screen/worker/WorkHome';
import WorkReqDetailScreen from './screen/worker/WorkReqDetail';
import AlarmScreen from './screen/worker/Alarm';
import AlarmDetailScreen from './screen/worker/AlarmDetail';

// 컴포넌트
import Header from './component/Header';
import SideMenu from './component/SideMenu';
import FilterMenu from './component/FilterMenu';

// 데이터
import GlobalContext from './GlobalContext';
import GS from './GlobalStyles';
import AcceptWorkRequestScreen from './screen/worker/AcceptWorkRequest';
import CancleAcceptedWorkRequestScreen from './screen/worker/CancleAcceptedWorkRequest';

const Stack = createNativeStackNavigator();

export default function RequesterApp() {
    const [{ userData, workReqList, alarmList, filter, status, config, ...context }, updateContext] = useState(useContext(GlobalContext));
    const [onMenu, setOnMenu] = useState(false);
    const [onFilter, setOnFilter] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(false); // 시작 시 앱이 로딩중인지 여부, true면 로딩 화면을 띄움
    const [onLoading, setOnLoading] = useState(false);
    const loadingDelayTimeout = useRef()
    const workReqListPageNum = useRef(1);

    const setContext = useCallback(data => updateContext(context => ({ ...context, ...data })))

    useEffect(() => {
        if (onLoading) {
            loadingDelayTimeout.current = setTimeout(() => {
                onLoading && Alert.alert("경고", "서버와의 연결이 원활하지 않습니다. 인터넷 연결을 확인해주세요. 지속적으로 이런 문제가 발생한다면 고객센터로 연락해 주십시오. 010-7777-7777", [
                    { text: "확인", style: 'default' }
                ])
                setOnLoading(false)
            }, 3000)
        } else {
            clearTimeout(loadingDelayTimeout.current)
        }
    }, [onLoading])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert("종료", "앱을 종료하시겠습니까?", [
                {
                    text: "아니오",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "종료",
                    onPress: () => BackHandler.exitApp(),
                    style: 'default'
                }
            ]);
            return true
        });
    }, [])

    useEffect(() => {
        (async () => {
            workReqListPageNum.current = 1;
            setContext({ workReqList: [] });
            setIsAppLoading(true);
            await loadMoreWorkReqList();
            await loadAlarmList();
            setIsAppLoading(false);
        })();
    }, []); // 앱 렌더링시 리스트 로딩

    const getAlarmList = useCallback(async function () {
        // 알람 목록 조회
        try {
            let response = await fetch(config.APISERVER.URL + '/api/v1/workerMessageList');
            response = await response.json();
            return response;
        } catch (e) {
            console.log(e);
            return e;
        }
    });
    const loadAlarmList = async function () {
        let alarmList = await getAlarmList();
        setContext({ alarmList });
    };
    const getWorkReqList = useCallback(async function (pageNum, params) {
        // 작업 목록 조회
        try {
            let response = await fetch(config.APISERVER.URL + '/api/v1/workReqList', {
                method: 'GET',
                params: { ...params, pageNum },
            });
            response = await response.json();
            return response;
        } catch (e) {
            console.log(e);
            return e;
        }
    });
    const loadMoreWorkReqList = async function () {
        let resWorkReqList = await getWorkReqList(workReqListPageNum.current);
        if (workReqList.length % 10 === 0) {
            workReqListPageNum.current++;
        } else {
            resWorkReqList = resWorkReqList.slice(workReqList.length % 10);
        }
        setContext({ workReqList: [...workReqList, ...resWorkReqList] });
    };
    return isAppLoading ? (
        <SafeAreaView
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar
                translucent={true}
                barStyle="dark-content"
                backgroundColor={GS.background_color}
            />
            <ActivityIndicator size="large" />
            <Text style={{ fontWeight: GS.font_weight.bold, fontSize: 18 }}>로딩 중입니다...</Text>
        </SafeAreaView>
    ) : (
        <GlobalContext.Provider
            value={{
                userData,
                workReqList,
                alarmList,
                loadAlarmList,
                loadMoreWorkReqList,
                status,
                filter,
                config,
                setContext,
                setOnLoading
            }}>
            {onLoading && (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" style={{ width: 80, height: 80 }} />
                </View>
            )}
            <SafeAreaView style={styles.container}>
                <StatusBar
                    translucent
                    barStyle="dark-content"
                    backgroundColor={GS.background_color}
                />
                <View style={{ flex: 1 }}>
                    {onMenu && <SideMenu setOnMenu={setOnMenu} />}
                    {onFilter && <FilterMenu setOnFilter={setOnFilter} />}
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                header: ({ navigation, route, options, back }) => {
                                    const title = getHeaderTitle(options, route.name);
                                    return (
                                        <Header
                                            title={title}
                                            navigation={navigation}
                                            options={options}
                                            back={back}
                                            route={route}
                                            alarmCount={alarmList.length}
                                            setOnFilter={setOnFilter}
                                            setOnMenu={setOnMenu}
                                        />
                                    );
                                },
                            }}>
                            <Stack.Screen
                                name="WorkHome"
                                component={WorkHomeScreen}
                                options={{
                                    title: '작업 홈',
                                }}
                            />
                            <Stack.Screen
                                name="WorkReqDetail"
                                component={WorkReqDetailScreen}
                                options={{
                                    title: '작업 상세정보',
                                    animation: 'slide_from_right',
                                }}
                            />
                            <Stack.Screen
                                name="AcceptWorkRequest"
                                component={AcceptWorkRequestScreen}
                                options={{
                                    title: '작업 수락',
                                    animation: 'slide_from_right',
                                }}
                            />
                            <Stack.Screen
                                name="CancleAcceptedWorkRequest"
                                component={CancleAcceptedWorkRequestScreen}
                                options={{
                                    title: '작업 거절',
                                    animation: 'slide_from_right',
                                }}
                            />
                            <Stack.Screen
                                name="Alarm"
                                component={AlarmScreen}
                                options={{
                                    title: '작업 알림',
                                    animation: 'slide_from_right',
                                }}
                            />
                            <Stack.Screen
                                name="AlarmDetail"
                                component={AlarmDetailScreen}
                                options={{
                                    title: '알림 상세정보',
                                    animation: 'slide_from_right',
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </SafeAreaView>
        </GlobalContext.Provider >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: GS.background_color
    },
    loading: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000a0',
        zIndex: 9999
    }
});
