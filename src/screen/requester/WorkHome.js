import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Text, Button, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import WorkBlock from '../../component/requester/WorkBlock';
import BottomMenu from '../../component/BottomMenu';
import SearchInput from '../../component/SearchInput';
import GlobalContext from '../../GlobalContext';
import GS from '../../GlobalStyles';

export default function WorkHome({ navigation, route, ...props }) {
	const context = useContext(GlobalContext);
	const [onSearch, setOnSearch] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [selectedWorkData, setSelectedWorkData] = useState(null);

	useEffect(() => {
		return navigation.addListener('focus', () => {
			context.setContext({ status: route.name });
		});
	}, []);

	useEffect(() => {
		context.loadWorkList(searchKeyword)
	}, [searchKeyword])


	return (
		<GlobalContext.Consumer>
			{state => (
				<View style={styles.container}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
						{(() => {
							const filter = state.filter
							let data = !filter.workState && !filter.workDueDate && !filter.workCompleteDate ? // 필터할 항목이 없는가?
								state.workList // 그렇다면 worklist 그대로 넣기
								:
								state.workList.filter(item => { // 그렇지 않다면 작업정보의 각 항목별로 걸러지고 남은 작업정보만 넣기

									const { workState, workDueDate, workCompleteDate } = item
									let isFiltered = false; // 해당 작업 정보가 걸러졌는가?

									if (filter.workState) { // 필터 항목중 작업상태 필터링 값이 있으면
										if (filter.workState !== workState) isFiltered = true; // 작업상태 필터링 값과 이 작업의 작업상태 값이 다르다면 걸러낸다.
									} // 아래 조건문도 같은 방식
									if (filter.workDueDate) {
										if (filter.workDueDate !== workDueDate) isFiltered = true
									}
									if (filter.workCompleteDate) {
										if (filter.workCompleteDate !== workCompleteDate) isFiltered = true
									}
									return !isFiltered

								})
							return data.length > 0 ? (
								<FlatList
									style={styles.list}
									data={data}
									renderItem={({ item }) => {
										return (
											<WorkBlock
												selected={
													selectedWorkData && item.workSn === selectedWorkData.workSn
												}
												{...item}
												navigation={navigation}
												route={route}
												select={workData => setSelectedWorkData(workData)}
											/>
										)
									}}
									keyExtractor={item => item.workSn}
								// onEndReached={ }
								/>
							) : (
								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: -1 }}>
									<Text style={{ fontFamily: GS.font_family }}>조회된 작업이 없네요 :(</Text>
									<Button title="새로고침" onPress={() => context.loadWorkList(searchKeyword)} />
								</View>
							)
						})()}
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
					<BottomMenu
						data={[
							{
								value: '작업 검색하기',
								onPress: () => {
									context.setContext({ status: 'Search' });
									setOnSearch(true);
								},
								disable: false,
							},
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
						]}
					/>
				</View>
			)
			}
		</GlobalContext.Consumer >
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: GS.background_color,
	},
	list: {
		maxWidth: 512
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
