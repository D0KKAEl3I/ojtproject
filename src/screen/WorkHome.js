import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import WorkBlock from '../component/WorkBlock';
import BottomTabMenu from '../component/BottomTabMenu';
import SearchInput from '../component/SearchInput';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';


export default function WorkHome({ navigation, route, ...props }) {
	const context = useContext(GlobalContext);

	const [onSearch, setOnSearch] = useState(false);
	const [searchData, setSearchData] = useState('');
	const [selectedWorkData, setSelectedWorkData] = useState(null);

	useEffect(() => {
		return navigation.addListener('focus', () => {
			context.setStatus(route.name);
		});
	}, []);

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

								/>
							) : (
								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontFamily: GS.fontFamily }}>조회된 작업이 없네요 :(</Text>
								</View>
							)
						})()}
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
									context.setStatus(route.name);
								}}
								onSubmit={data => {
									setOnSearch(false);
									setSearchData(data)
									context.setStatus(route.name);
								}}
							/>
						</KeyboardAvoidingView>
					)}
					<BottomTabMenu
						data={[
							{
								value: '작업 검색하기',
								onPress: () => {
									context.setStatus('Search');
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
								fontStyle: { lineHeight: 18, fontSize: 14 },
							},
							{
								value: '거리로\n작업 배정하기',
								onPress: () => {
									navigation.navigate('WorkerAssignByLocation', { workData: selectedWorkData })
								},
								disable: !selectedWorkData && true,
								fontStyle: { lineHeight: 18, fontSize: 14 },
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
		justifyContent: 'center',
		backgroundColor: '#f9f9fa',
	},
	list: {
		flex: 1,
		maxWidth: 512,
		paddingTop: GS.padding / 2
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
