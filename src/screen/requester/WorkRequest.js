import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';

import GS from '../../GlobalStyles';
import GlobalContext from '../../GlobalContext';
import ContentView from '../../component/ContentView';
import TitleText from '../../component/TitleText';
import BottomButton from '../../component/BottomButton';

export default function WorkRequest({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [onRequest, setOnRequest] = useState(false);
	const [{ workData, workerData }, setWorkRequestData] = useState({ workData: {}, workerData: {} });

	useEffect(() => {
		setWorkRequestData({ ...route.params });
	}, []);

	const submit = () => {
		Alert.alert("작업 요청", "작업자에게 작업을 요청하시겠습니까?", [
			{
				text: '취소',
				onPress: () => null,
				style: 'cancel'
			}, {
				text: '요청',
				onPress: requestWork,
				style: 'default'
			}
		])
	}

	const requestWork = async () => {
		context.setOnLoading(true)
		let workResponse, messageResponse;
		try {
			workResponse = await fetch(context.config.APISERVER.URL + '/api/v1/workRequest', {
				method: "POST",
				body: {
					requesterSn: context.userData.userSn,
					workSn: workData.workSn,
					workerSn: workerData.workerSn
				}
			})
		} catch (e) {
			console.error(e);
			return e;
		}
		if (workResponse.ok) {
			try {
				messageResponse = await fetch(context.config.APISERVER.URL + '/api/v1/workerAssignMessage', {
					method: "POST",
					body: {
						requesterSn: context.userData.userSn,
						workSn: workData.workSn,
						workerSn: workerData.workerSn
					}
				})
			} catch (e) {
				console.error(e)
				return e;
			}
		}
		if (workResponse.ok && messageResponse.ok) {
			Alert.alert('작업 요청 완료', '작업이 요청되었습니다.', [
				{
					text: "확인 및 뒤로가기",
					onPress: navigation.goBack,
					style: "cancel"
				}
			])
			context.setOnLoading(false)
		} else {
			console.log(messageResponse.status);
			Alert.alert('작업 요청 실패', '작업이 요청되지 않았습니다.', [
				{
					text: '확인',
					style: 'default'
				}
			])
			context.setOnLoading(false)
		}
	}

	return (
		<View style={styles.content}>
			<TitleText>
				{workData.workName} 요청 정보
			</TitleText>
			<ScrollView>
				<ContentView>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 지점</Text>
						<Text style={styles.infoText}>{workData.workName}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>요청 사항</Text>
						<Text style={styles.infoText}>작업 요청</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>요청 사유</Text>
						<Text style={styles.infoText}>없음</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 주소</Text>
						<Text style={styles.infoText}>{workData.workLocation}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 예정일</Text>
						<Text style={styles.infoText}>{workData.workDueDate}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>예정 작업자</Text>
						<Text style={styles.infoText}>{workerData.userName}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업자 연락처</Text>
						<Text style={styles.infoText}>{workData.userPhoneNumber || '없음'}</Text>
					</View>
				</ContentView>
			</ScrollView>
			<BottomButton
				data={[
					{ value: "작업 요청", onPress: submit },
					{ value: "돌아가기", onPress: navigation.goBack }
				]}
			/>
		</View >
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		maxWidth: 512
	},
	info: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: GS.padding,
	},
	infoName: {
		color: GS.text_color,
		fontFamily: GS.font_family,
		fontSize: 19,
		fontWeight: GS.font_weight.regular,
	},
	infoText: {
		color: GS.text_color,
		fontFamily: GS.font_family,
		fontSize: 24,
		fontWeight: GS.font_weight.regular,
	},
});
