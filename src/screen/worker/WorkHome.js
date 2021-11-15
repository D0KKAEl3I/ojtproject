import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Text, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import WorkReqBlock from '../../component/worker/WorkReqBlock';
import BottomTabMenu from '../../component/BottomTabMenu';
import SearchInput from '../../component/SearchInput';
import GlobalContext from '../../GlobalContext';
import GS from '../../GlobalStyles';

export default function WorkHome({ navigation, route, ...props }) {
	const context = useContext(GlobalContext);
	const [onSearch, setOnSearch] = useState(false);
	const [searchData, setSearchData] = useState('');
	const [selectedWorkReqData, setSelectedWorkReqData] = useState(null);

	const onPressDenyButton = () => {
		Alert.alert('작업 요청 거절', '작업 요청을 거절하시겠습니까?', [
			{
				text: '취소',
				onPress: () => null,
				style: 'cancel'
			}, {
				text: '거절',
				onPress: denyWorkRequest,
				style: 'default'
			}
		])
	}

	const denyWorkRequest = async () => {
		context.setOnLoading(true)
		let response;
		try {
			response = await fetch(context.config.APISERVER.URL + '/api/v1/workAssign', {
				method: 'POST',
				body: {
					userSn: context.userData.userSn,
					workSn: selectedWorkReqData.workSn
				}
			})
			if (response.ok) {
				Alert.alert('작업 요청 거절됨', '작업 요청이 거절되었습니다.', [
					{
						text: '확인',
						style: 'default'
					}
				])
				context.setOnLoading(false)
			} else {
				Alert.alert('작업 요청 거절 실패', '작업 요청이 거절되지 않았습니다.', [
					{
						text: '확인',
						style: 'default'
					}
				])
				context.setOnLoading(false)
			}
		} catch (e) {
			console.error(e);
		}

	}

	useEffect(() => {
		return navigation.addListener('focus', () => {
			context.setContext({ status: route.name });
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
								state.workReqList // 그렇다면 workReqlist 그대로 넣기
								:
								state.workReqList.filter(item => { // 그렇지 않다면 작업정보의 각 항목별로 걸러지고 남은 작업정보만 넣기

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
											<WorkReqBlock
												selected={
													selectedWorkReqData && item.workSn === selectedWorkReqData.workSn
												}
												{...item}
												navigation={navigation}
												route={route}
												select={workReqData => setSelectedWorkReqData(workReqData)}
											/>
										)
									}}
									keyExtractor={item => item.workSn}
								// onEndReached={ }
								/>
							) : (
								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontFamily: GS.font_family }}>조회된 작업이 없네요 :(</Text>
								</View>
							)
						})()}
					</View>
					{onSearch && (
						<KeyboardAvoidingView
							behavior='padding'
							style={styles.backgroundFilter}>
							<SearchInput
								label='작업 검색'
								defaultValue={searchData}
								onClose={() => {
									setOnSearch(false);
									setSearchData('');
									context.setContext({ status: route.name });
								}}
								onSubmit={data => {
									setOnSearch(false);
									setSearchData(data)
									context.setContext({ status: route.name });
								}}
							/>
						</KeyboardAvoidingView>
					)}
					<BottomTabMenu
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
								value: '작업 수락',
								onPress: () => {
									navigation.navigate('AcceptWorkRequest', { workReqData: selectedWorkReqData })
								},
								disable: !selectedWorkReqData && true,
							},
							{
								value: '작업 거절',
								onPress: onPressDenyButton,
								disable: !selectedWorkReqData && true,
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
