import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Text, Platform, BackHandler, FlatList, Alert } from 'react-native';
import WorkBlock from '../../component/requester/WorkBlock';
import SearchInput from '../../component/SearchInput';
import GlobalContext from '../../GlobalContext';
import GS from '../../GlobalStyles';
import TitleText from '../../component/TitleText';
import Icon from '../../component/Icon';
import Button from '../../component/Button';

export default function WorkHome({ navigation, route, ...props }) {
	const context = useContext(GlobalContext);
	const [onSearch, setOnSearch] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [selectedWorkData, setSelectedWorkData] = useState(null);
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		// BackHandler.addEventListener('hardwareBackPress', () => {
		// 	Alert.alert("종료", "앱을 종료하시겠습니까?", [
		// 		{ text: "아니오", onPress: () => null, style: "cancel" },
		// 		{ text: "종료", onPress: () => BackHandler.exitApp(), style: 'default' }
		// 	]);
		// 	return true
		// });
		return navigation.addListener('focus', () => {
			context.setBottomMenuOptions(null)
			context.setContext({ status: route.name });
		});
	}, []);

	useEffect(() => {
		context.loadWorkList(searchKeyword)
	}, [searchKeyword])

	useEffect(() => {
		context.setBottomMenuOptions(selectedWorkData ?
			[
				{
					value: '검색으로\n작업 배정하기',
					onPress: () => {
						navigation.navigate('WorkerAssign', { workData: selectedWorkData })
					},
					disable: !selectedWorkData && true,
					fontStyle: { fontSize: 14 },
				},
				{
					value: '거리로\n작업 배정하기',
					onPress: () => {
						navigation.navigate('WorkerAssignByLocation', { workData: selectedWorkData })
					},
					disable: !selectedWorkData && true,
					fontStyle: { fontSize: 14 },
				},
			]
			: null)
	}, [selectedWorkData])

	const onPressFilterButton = () => {
		if (context.status === 'WorkHome') context.setOnFilter(true)
	}


	return (
		<View style={styles.container} onTouchStart={() => setSelectedWorkData(null)}>
			<View style={styles.wrapper}>
				<View style={styles.subMenu}>
					<TitleText>작업 목록</TitleText>
					<View style={styles.buttonContainer}>
						<Button style={styles.button} onPress={onPressFilterButton}>
							<Icon name="filter" style={styles.buttonIcon} />
							<Text style={styles.buttonText}>필터</Text>
						</Button>
						<Button style={styles.button} onPress={() => {
							context.setContext({ status: 'Search' });
							setOnSearch(true);
						}}>
							<Icon name="search" style={styles.buttonIcon} />
							<Text style={styles.buttonText}>검색</Text>
						</Button>
					</View>
				</View>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
					{(() => {
						const filter = context.filter
						let data = !filter.workState && !filter.workDueDate && !filter.workCompleteDate ? // 필터할 항목이 없는가?
							context.workList // 그렇다면 worklist 그대로 출력
							:
							context.workList.filter(item => { // 그렇지 않다면 작업정보의 각 항목별로 걸러지고 남은 작업정보만 출력
								const { workState, workDueDate, workCompleteDate } = item
								let isFiltered = false; // 해당 작업 정보가 걸러졌는가?
								if (filter.workState)  // 필터 항목중 작업상태 필터링 값이 있으면
									if (filter.workState !== workState) isFiltered = true; // 작업상태 필터링 값과 이 작업의 작업상태 값이 다르다면 걸러낸다.
								if (filter.workDueDate)
									if (filter.workDueDate !== workDueDate) isFiltered = true
								if (filter.workCompleteDate)
									if (filter.workCompleteDate !== workCompleteDate) isFiltered = true
								return !isFiltered
							})
						return data.length > 0 ? (
							<FlatList
								data={data}
								renderItem={({ item }) => (
									<WorkBlock
										selected={selectedWorkData && item.workSn === selectedWorkData.workSn}
										{...item}
										navigation={navigation}
										route={route}
										select={workData => setSelectedWorkData(workData)}
									/>
								)}
								keyExtractor={item => item.workSn}
								// onEndReached={ }
								refreshing={refresh}
								onRefresh={() => {
									console.log('ref');
									setRefresh(true)
								}}
								progressViewOffset={100}
							/>
						) : (
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: -1 }}>
								<Text style={{ fontFamily: GS.font_family }}>조회된 작업이 없네요 :(</Text>
								<Button title="새로고침" onPress={() => context.loadWorkList(searchKeyword)} />
							</View>
						)
					})()}
				</View>
			</View>
			{onSearch && (
				<KeyboardAvoidingView
					behavior={Platform.select({ ios: "padding", android: "height" })}
					style={styles.backgroundFilter}>
					<SearchInput
						label="작업 검색"
						defaultValue={searchKeyword}
						onClose={() => {
							context.setContext({ status: route.name });
							setOnSearch(false);
						}}
						onSubmit={data => {
							setSearchKeyword(data)
							context.setContext({ status: route.name });
							setOnSearch(false);
						}}
					/>
				</KeyboardAvoidingView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: GS.background_color,
		alignItems: 'center'
	},
	wrapper: {
		flex: 1,
		alignItems: 'center',
		maxWidth: GS.max_width,
		width: '100%',
	},
	subMenu: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingRight: GS.padding_horizontal
	},
	buttonContainer: {
		flexDirection: 'row'
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 2,
		paddingHorizontal: 4,
		marginLeft: 4
	},
	buttonIcon: {
		width: 24,
		height: 24,
		opacity: 0.7
	},
	buttonText: {
		fontFamily: GS.font_family,
		fontWeight: GS.font_weight.bold,
		marginRight: 2,
		color: GS.text_color,
		fontWeight: GS.font_weight.bold,
		fontSize: 16
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
