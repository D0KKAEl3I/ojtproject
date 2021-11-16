import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';

import GS from '../../GlobalStyles';
import GlobalContext from '../../GlobalContext';
import TitleText from '../../component/TitleText';
import ContentView from '../../component/ContentView';

export default function ChangeWorker({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [onRequest, setOnRequest] = useState(false);
	const [{ workData, workerData }, setWorkRequestData] = useState({ workData: {}, workerData: {} });

	useEffect(() => {
		setWorkRequestData({ ...route.params });
	}, []);

	const submit = () => {
		Alert.alert("작업자 변경", "작업자 변경을 요청하시겠습니까?", [
			{
				text: '취소',
				onPress: () => null,
				style: 'cancel'
			}, {
				text: '요청',
				onPress: changeWorkerRequest,
				style: 'default'
			}
		])
	}

	const changeWorkerRequest = async () => {
		context.setOnLoading(true)
		let response
		try {
			response = await fetch(context.config.APISERVER.URL + '/api/v1/workerChange', {
				method: "POST",
				body: {
					requesterSn: context.userData.userSn,
					workSn: workData.workSn,
					workerSn: workerData.workerSn
				}
			})
			if (response.ok) {
				Alert.alert('작업자 변경 완료', '작업자가 변경되었습니다.', [
					{
						text: "확인 및 뒤로가기",
						onPress: navigation.goBack,
						style: "default"
					}
				])
				context.setOnLoading(false)
			} else {
				Alert.alert('작업자 변경 실패', '작업자가 변경되지 않았습니다.', [
					{
						text: "확인",
						style: "default"
					}
				])
				context.setOnLoading(false)
			}
		} catch (e) {
			console.error(e);
			return e;
		}

	}

	return (
		<View style={styles.content}>
			<TitleText>
				{workData.workName} 작업자 변경
			</TitleText>
			<ScrollView>
				<ContentView>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 지점</Text>
						<Text style={styles.infoText}>{workData.workName}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 주소</Text>
						<Text style={styles.infoText}>{workData.workLocation}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 예정일</Text>
						<Text style={styles.infoText}>{workData.workDueDate}</Text>
					</View>
				</ContentView>
				<ContentView label="작업자 변경 정보">
					<View style={styles.info}>
						<Text style={styles.infoName}>기존 작업자</Text>
						<Text style={styles.infoText}>{workData.userName}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>변경 작업자</Text>
						<Text style={styles.infoText}>{workerData.workerName}</Text>
					</View>

				</ContentView>
			</ScrollView>
			<View style={styles.bottomTab}>
				{onRequest ? (
					<Pressable onPress={() => { }} style={[styles.button]}>
						<ActivityIndicator color={'#ffffff'} size="large" />
					</Pressable>
				) : (
					<>
						<Pressable onPress={submit} style={[styles.button, styles.leftSide]}>
							<Text style={{ color: '#ffffff', fontFamily: GS.font_family, fontWeight: GS.font_weight.bold, fontSize: 20 }}>
								변경 요청하기
							</Text>
						</Pressable>
						<Pressable onPress={navigation.goBack} style={[styles.button, styles.rightSide]}>
							<Text style={{ color: '#ffffff', fontFamily: GS.font_family, fontWeight: GS.font_weight.bold, fontSize: 20 }}>
								돌아가기
							</Text>
						</Pressable>
					</>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		maxWidth: 512,
	},
	title: {
		margin: GS.margin,
		paddingTop: GS.padding,
		paddingHorizontal: GS.padding_horizontal,
		fontSize: 24,
		fontFamily: GS.font_family,
		fontWeight: GS.font_weight.bold,
		color: GS.text_color,
	},
	info: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: GS.padding
	},
	infoName: {
		color: GS.text_color,
		fontFamily: GS.font_family,
		fontSize: 18,
		fontWeight: GS.font_weight.regular,
	},
	infoText: {
		color: GS.text_color,
		fontFamily: GS.font_family,
		fontSize: 24,
		fontWeight: GS.font_weight.regular,
	},
	bottomTab: {
		height: 48,
		flexDirection: 'row'
	},
	button: {
		flex: 1,
		backgroundColor: GS.active_color,
		borderBottomLeftRadius: GS.border_radius,
		borderBottomRightRadius: GS.border_radius,
		paddingVertical: GS.padding,
		alignItems: 'center',
		justifyContent: 'center',
	},
	// 버튼 위치 방향에 따라
	leftSide: {
		borderRightWidth: 1,
		borderColor: GS.background_color,
		borderBottomRightRadius: 0
	},
	rightSide: {
		borderLeftWidth: 1,
		borderColor: GS.background_color,
		borderBottomLeftRadius: 0
	}
});