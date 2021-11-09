// 모듈
import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, ActivityIndicator, Text, BackHandler, Alert, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';

// 스크린 컴포넌트
import WorkHomeScreen from './src/screen/WorkHome';
import WorkDetailScreen from './src/screen/WorkDetail';
import WorkerAssignScreen from './src/screen/WorkerAssign';
import WorkerAssignByLocScreen from './src/screen/WorkerAssignByLocation';
import WorkerDetailScreen from './src/screen/WorkerDetail';
import AlarmScreen from './src/screen/Alarm';
import AlarmDetailScreen from './src/screen/AlarmDetail';

// 컴포넌트
import Header from './src/component/Header';
import SideMenu from './src/component/SideMenu';
import FilterMenu from './src/component/FilterMenu';

// 데이터
import config from './com.config.json';
import GlobalContext from './src/GlobalContext';
import WorkRequestScreen from './src/screen/WorkRequest';
import ChangeWorkerScreen from './src/screen/ChangeWorker';
import CancleWorkRequestScreen from './src/screen/CancleWorkRequest';

const Stack = createNativeStackNavigator();

export default function App() {
	const context = useContext(GlobalContext);
	const [onMenu, setOnMenu] = useState(false);
	const [onFilter, setOnFilter] = useState(false);
	const [onLoading, setOnLoading] = useState(false); // 로딩중인지 여부, true면 로딩 화면을 띄움
	const [status, setStatus] = useState(context.status);
	const [userData, setUserData] = useState({ userSn: 1 });
	const [workList, setWorkList] = useState([]);
	const workListPageNum = useRef(1);
	const [workerList, setWorkerList] = useState([]);
	const [filter, setFilter] = useState({
		workState: null,
		workDueDate: null,
		workCompleteDate: null
	});
	const [alarmList, setAlarmList] = useState([]); // 알람 목록

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
			setWorkList([]);
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
		let resWorkerList = await getWorkerList();
		setWorkerList(resWorkerList);
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
		let resAlarmList = await getAlarmList();
		setAlarmList(resAlarmList);
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
		setWorkList(list => [...list, ...resWorkList]);
	};
	return onLoading ? (
		<SafeAreaView
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<StatusBar
				translucent={true}
				barStyle="dark-content"
				backgroundColor="#fff"
			/>
			<ActivityIndicator size="large" />
			<Text style={{ fontWeight: '900', fontSize: 18 }}>로딩 중입니다...</Text>
		</SafeAreaView>
	) : (
		<GlobalContext.Provider
			value={{
				userData, workList, alarmList, workerList, loadAlarmList, loadMoreWorkList, status, setStatus, filter, setFilter
			}}>
			<SafeAreaView style={styles.container}>
				<StatusBar
					translucent
					barStyle="dark-content"
					backgroundColor="#fff"
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
									animation: 'slide_from_bottom',
								}}
							/>
							<Stack.Screen
								name="WorkerAssignByLocation"
								component={WorkerAssignByLocScreen}
								options={{
									title: '거리로 작업자 배정',
									animation: 'slide_from_bottom',
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
									animation: 'slide_from_bottom'
								}}
							/>
							<Stack.Screen
								name="CancleWorkRequest"
								component={CancleWorkRequestScreen}
								options={{
									title: '작업 취소',
									animation: 'slide_from_bottom'
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
									animation: 'slide_from_bottom',
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
		</GlobalContext.Provider>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		backgroundColor: '#fff'
	},
});