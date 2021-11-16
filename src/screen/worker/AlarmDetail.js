import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, Linking, ScrollView } from 'react-native';

import GlobalContext from '../../GlobalContext';
import GS from '../../GlobalStyles';
import ContentView from '../../component/ContentView';
import TitleText from '../../component/TitleText';
import BottomButton from '../../component/BottomButton';

export default function AlarmDetail({ navigation, route, ...props }) {
	const [onLoading, setOnLoading] = useState(false);
	const [alarmDetailInfo, setAlarmDetailInfo] = useState({});

	const context = useContext(GlobalContext);

	useEffect(() => {
		(async () => {
			setOnLoading(true);
			let response;
			try {
				response = await fetch(context.config.APISERVER.URL + '/api/v1/messageDetail', {
					method: 'GET',
					params: {
						userSn: context.userData.userSn,
						messageSn: route.params.workData.workSn,
					},
				});
				response = await response.json();
				setAlarmDetailInfo({ ...route.params.workData, ...response });
			} catch (e) {
				console.log(e);
			} finally {
				setOnLoading(false);
			}
		})();
	}, []);

	return onLoading ? (
		<ActivityIndicator size="large" style={{ flex: 1 }} />
	) : (
		<View style={styles.content}>
			{console.log(alarmDetailInfo)}
			<TitleText>
				{`${alarmDetailInfo.workState} 알림`}
			</TitleText>
			<ScrollView>
				<ContentView  >
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 지점</Text>
						<Text style={styles.infoText}>{alarmDetailInfo.workName || "없음"}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>알림 사항</Text>
						<Text style={styles.infoText}>{alarmDetailInfo.messageMemo || "없음"}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>알림 사유</Text>
						<Text style={styles.infoText}>{alarmDetailInfo.messageReason || "없음"}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 주소</Text>
						<Text style={styles.infoText}>{alarmDetailInfo.workLocation || '없음'}</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>{alarmDetailInfo.messageMemo === '작업완료' ? "작업완료일" : "작업예정일"}</Text>
						<Text style={styles.infoText}>
							{alarmDetailInfo.messageMemo === '작업완료' ?
								alarmDetailInfo.workCompleteDate || '없음'
								:
								alarmDetailInfo.workDueDate || '없음'}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업자 연락처</Text>
						<Text style={{ ...styles.infoText, ...GS.linked_text }}>{alarmDetailInfo.userPhoneNumber || '없음'}</Text>
					</View>
				</ContentView>
			</ScrollView>
			<BottomButton
				data={[
					{
						value: alarmDetailInfo.messageMemo === '작업거절' ||
							alarmDetailInfo.messageMemo === '수락취소'
							? '작업자 재배정'
							: '작업내용 확인'
					},
					{ value: "돌아가기", onPress: navigation.goBack }
				]}
			/>
		</View>
	)

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
});