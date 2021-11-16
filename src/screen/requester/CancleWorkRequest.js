import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';

import GS from '../../GlobalStyles';
import GlobalContext from '../../GlobalContext';
import TitleText from '../../component/TitleText';
import ContentView from '../../component/ContentView';
import BottomButton from '../../component/BottomButton';

export default function CancleWorkRequest({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [onRequest, setOnRequest] = useState(false);
	const [{ workData, workerData }, setWorkRequestData] = useState({ workData: {}, workerData: {} });

	useEffect(() => {
		setWorkRequestData({ ...route.params });
	}, []);

	const submit = () => {
		Alert.alert("작업 배정 취소", "작업 배정 취소를 요청하시겠습니까?", [
			{
				text: '취소',
				onPress: () => null,
				style: 'cancel'
			}, {
				text: '요청',
				onPress: requestCancleWork,
				style: 'default'
			}
		])
	}

	const requestCancleWork = async () => {
		context.setOnLoading(true)
		let response;
		try {
			response = await fetch(context.config.APISERVER.URL + '/api/v1/workCancle', {
				method: "POST",
				body: {
					requesterSn: context.userData.userSn,
					workSn: workData.workSn,
					workerSn: workerData.workerSn
				}
			})
			if (response.ok) {
				Alert.alert('작업 배정 취소 완료', '작업 배정이 취소되었습니다.', [
					{
						text: "확인 및 뒤로가기",
						onPress: navigation.goBack,
						style: "default"
					}
				])
				context.setOnLoading(false)
			} else {
				Alert.alert('작업 배정 취소 실패', '작업 배정이 취소되지 않았습니다.', [
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
				{workData.workName} 작업 취소
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
						<Text style={styles.infoText}>{workerData.workerName}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업자 연락처</Text>
						<Text style={styles.infoText}>{workData.userPhoneNumber || '없음'}</Text>
					</View>
				</ContentView>
			</ScrollView>
			<BottomButton
				data={[
					{ value: "작업 취소 요청", onPress: submit },
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
