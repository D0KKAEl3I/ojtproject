import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';

import GS from '../../GlobalStyles';
import GlobalContext from '../../GlobalContext';
import ContentView from '../../component/ContentView';
import TitleText from '../../component/TitleText';

export default function CancleAcceptedWorkRequest({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [workReqData, setWorkReqData] = useState({});

	useEffect(() => {
		setWorkReqData(route.params.workReqData);
	}, []);

	const submit = () => {
		Alert.alert("작업 수락 취소", "작업 수락 취소를 요청하시겠습니까?", [
			{
				text: '취소',
				onPress: () => null,
				style: 'cancel'
			}, {
				text: '요청',
				onPress: AcceptWorkRequest,
				style: 'default'
			}
		])
	}

	const AcceptWorkRequest = async () => {
		context.setOnLoading(true)
		let workResponse, messageResponse;
		try {
			workResponse = await fetch(context.config.APISERVER.URL + '/api/v1/workAssign', {
				method: "POST",
				body: {
					userSn: context.userData.userSn,
					workSn: workReqData.workSn
				}
			})
		} catch (e) {
			console.error(e);
		}
		if (workResponse.ok) {
			try {
				messageResponse = await fetch(context.config.APISERVER.URL + '/api/v1/workAssignMessage', {
					method: "POST",
					body: {
						requesterSn: context.userData.userSn,
						workSn: workReqData.workSn
					}
				})
			} catch (e) {
				console.error(e)
			}
		}
		if (workResponse.ok && messageResponse.ok) {
			Alert.alert('작업 수락 취소됨', '수락한 작업이 성공적으로 취소되었습니다.', [
				{
					text: "확인 및 뒤로가기",
					onPress: navigation.goBack,
					style: "default"
				}
			])
			context.setOnLoading(false)
		} else {
			Alert.alert('작업 수락 취소 실패', '수락한 작업이 취소되지 않았습니다.', [
				{
					text: "확인",
					style: "default"
				}
			])
			context.setOnLoading(false)
		}
	}

	return (
		<View style={styles.content}>
			<TitleText>
				{workReqData.workName} 작업 정보
			</TitleText>
			<ScrollView>
				<ContentView>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 지점</Text>
						<Text style={styles.infoText}>{workReqData.workName}</Text>
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
						<Text style={styles.infoText}>{workReqData.workLocation}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 예정일</Text>
						<Text style={styles.infoText}>{workReqData.workDueDate}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업자 연락처</Text>
						<Text style={styles.infoText}>{workReqData.userPhoneNumber || '없음'}</Text>
					</View>
				</ContentView>
			</ScrollView>
			<View style={styles.bottomTab}>
				<Pressable onPress={submit} style={[styles.button, styles.leftSide]}>
					<Text style={{ color: '#ffffff', fontFamily: GS.font_family, fontWeight: GS.font_weight.bold, fontSize: 20 }}>
						작업 수락
					</Text>
				</Pressable>
				<Pressable onPress={navigation.goBack} style={[styles.button, styles.rightSide]}>
					<Text style={{ color: '#ffffff', fontFamily: GS.font_family, fontWeight: GS.font_weight.bold, fontSize: 20 }}>
						돌아가기
					</Text>
				</Pressable>
			</View>
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
	bottomTab: {
		height: 48,
		flexDirection: 'row'
	},
	button: {
		flex: 1,
		backgroundColor: GS.active_color,
		borderBottomLeftRadius: GS.borderRadius,
		borderBottomRightRadius: GS.borderRadius,
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
