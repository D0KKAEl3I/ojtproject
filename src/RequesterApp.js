import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, ActivityIndicator, Text, BackHandler, Alert, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';

// 스크린 컴포넌트
import WorkHomeScreen from './screen/requester/WorkHome';
import WorkDetailScreen from './screen/requester/WorkDetail';
import WorkerAssignScreen from './screen/requester/WorkerAssign';
import WorkerAssignByLocScreen from './screen/requester/WorkerAssignByLocation';
import WorkRequestScreen from './screen/requester/WorkRequest';
import ChangeWorkerScreen from './screen/requester/ChangeWorker';
import CancleWorkRequestScreen from './screen/requester/CancleWorkRequest';
import WorkerDetailScreen from './screen/requester/WorkerDetail';
import AlarmScreen from './screen/requester/Alarm';
import AlarmDetailScreen from './screen/requester/AlarmDetail';

// 컴포넌트
import Header from './component/Header';
import SideMenu from './component/SideMenu';
import FilterMenu from './component/FilterMenu';

// 데이터
import GlobalContext from './GlobalContext';
import GS from './GlobalStyles';

const Stack = createNativeStackNavigator();

export default function RequesterApp() {
    const [{ userData, workList, workerList, alarmList, filter, status, config, ...context }, updateContext] = useState(useContext(GlobalContext));
    const [onMenu, setOnMenu] = useState(false);
    const [onFilter, setOnFilter] = useState(false);
    const [onLoading, setOnLoading] = useState(false); // 로딩중인지 여부, true면 로딩 화면을 띄움
    const workListPageNum = useRef(1);

    const setContext = useCallback(data => updateContext(context => ({ ...context, ...data })))

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
            workListPageNum.current = 1;
            setContext({ workList: [] });
            setOnLoading(true);
            await loadMoreWorkList();
            await loadWorkerList();
            await loadAlarmList();
            setOnLoading(false);
        })();
    }, []); // 앱 렌더링시 리스트 로딩

    const getWorkerList = useCallback(async function () {
        // 작업자 목록 조회
        try {
            let response = await fetch(config.APISERVER.URL + '/api/v1/workerList');
            response = await response.json();
            return response;
        } catch (e) {
            console.log(e);
            return e;
        }
    })

    const loadWorkerList = async function () {
        let workerList = await getWorkerList();
        setContext({ workerList });
    };

    const getAlarmList = useCallback(async function () {
        // 알람 목록 조회
        try {
            let response = await fetch(config.APISERVER.URL + '/api/v1/messageList');
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
    const getWorkList = useCallback(async function (pageNum, params) {
        // 작업 목록 조회
        try {
            let response = await fetch(config.APISERVER.URL + '/api/v1/workList', {
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
    const loadMoreWorkList = async function () {
        let resWorkList = await getWorkList(workListPageNum.current);
        if (workList.length % 10 === 0) {
            workListPageNum.current++;
        } else {
            resWorkList = resWorkList.slice(workList.length % 10);
        }
        setContext({ workList: [...workList, ...resWorkList] });
    };
    return onLoading ? (
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
                workList,
                alarmList,
                workerList,
                loadAlarmList,
                loadMoreWorkList,
                status,
                filter,
                config,
                setContext
            }}>
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
                                name="WorkDetail"
                                component={WorkDetailScreen}
                                options={{
                                    title: '작업 상세정보',
                                    animation: 'slide_from_right',
                                }}
                            />
                            <Stack.Screen
                                name="WorkerAssign"
                                component={WorkerAssignScreen}
                                options={{
                                    title: '작업자 배정',
                                    animation: 'slide_from_right',
                                }}
                            />
                            <Stack.Screen
                                name="WorkerAssignByLocation"
                                component={WorkerAssignByLocScreen}
                                options={{
                                    title: '거리로 작업자 배정',
                                    animation: 'slide_from_right',
                                }}
                            />
                            <Stack.Screen
                                name="WorkerDetail"
                                component={WorkerDetailScreen}
                                options={{
                                    title: '작업자 상세정보',
                                    animation: 'slide_from_right'
                                }}
                            />
                            <Stack.Screen
                                name="WorkRequest"
                                component={WorkRequestScreen}
                                options={{
                                    title: '작업 요청',
                                    animation: 'slide_from_right'
                                }}
                            />
                            <Stack.Screen
                                name="CancleWorkRequest"
                                component={CancleWorkRequestScreen}
                                options={{
                                    title: '작업 취소',
                                    animation: 'slide_from_right'
                                }}
                            />
                            <Stack.Screen
                                name="ChangeWorker"
                                component={ChangeWorkerScreen}
                                options={{
                                    title: '작업자 변경',
                                    animation: 'slide_from_bottom'
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
});
