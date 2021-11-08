import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import config from '../../com.config.json';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';

export default function AlarmDetail({ navigation, route, ...props }) {
	const [onLoading, setOnLoading] = useState(false);
	const [workDetailInfo, setWorkDetailInfo] = useState({});

	const context = useContext(GlobalContext);

	useEffect(() => {
		(async () => {
			setOnLoading(true);
			let response;
			try {
				response = await fetch(config.APISERVER.URL + '/api/v1/messageDetail', {
					method: 'GET',
					params: {
						userSn: context.userData.userSn,
						messageSn: route.params.workData.workSn,
					},
				});
				response = await response.json();
				setWorkDetailInfo({ ...response, ...route.params.workData });
			} catch (e) {
				console.log(e);
			} finally {
				setOnLoading(false);
			}
		})();
	}, []);

	return (
		<View style={styles.container}>
			{onLoading ? (
				<ActivityIndicator size="large" style={{ flex: 1 }} />
			) : (
				<View style={styles.content}>
					<View style={styles.title}>
						<Text style={styles.titleText}>{workDetailInfo.messageMemo}</Text>
					</View>
					<Text style={styles.body}>
						<Text style={styles.info}>
							작업지점: {'지점명'}
							{'\n'}
						</Text>
						<Text style={styles.info}>
							알림사항: {workDetailInfo.messageMemo}
							{'\n'}
						</Text>
						<Text style={styles.info}>
							알림사유: {workDetailInfo.messageReason}
							{'\n'}
						</Text>
						<Text style={styles.info}>
							작업주소: {workDetailInfo.workLocation}
							{'\n'}
						</Text>
						<Text style={styles.info}>
							{workDetailInfo.workState === '작업완료'
								? `작업완료일: ${workDetailInfo.workCompleteDate ?? '미정'}\n`
								: `작업예정일: ${workDetailInfo.workDueDate ?? '미정'}\n`}
						</Text>
						<Text style={styles.info}>
							{workDetailInfo.workState === '작업완료'
								? `완료작업자: ${workDetailInfo.userName ?? '미정'}\n`
								: `예정작업자: ${workDetailInfo.userName ?? '미정'}\n`}
						</Text>
						<Text style={styles.info}>
							작업자 전화번호:{' '}
							{
								<Text
									style={{
										fontSize: 24,
										color: workDetailInfo.userPhoneNumber ? '#0000aa' : '#000',
										textDecorationColor: '#0000aa',
										textDecorationLine: workDetailInfo.userPhoneNumber
											? 'underline'
											: 'none',
									}}
								/* onPress={ workDetailInfo.userPhoneNumber && () => Linking.openURL(`tel:${workDetailInfo.userPhoneNumber}`)}*/
								>
									{workDetailInfo.userPhoneNumber ?? '정보 없음'}
								</Text>
							}
						</Text>
					</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-around',
							width: 300,
						}}>
						<Pressable style={styles.button}>
							<Text
								style={{ color: '#ffffff', fontWeight: '900', fontSize: 20 }}>
								{workDetailInfo.messageMemo === '작업거절' ||
									workDetailInfo.messageMemo === '수락취소'
									? '작업자 재배정'
									: '작업내용 확인'}
							</Text>
						</Pressable>
						<Pressable onPress={navigation.goBack} style={styles.button}>
							<Text
								style={{ color: '#ffffff', fontWeight: '900', fontSize: 20 }}>
								돌아가기
							</Text>
						</Pressable>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: GS.padding,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		width: '100%',
		maxWidth: 512,
		backgroundColor: '#ffffff',
		...GS.shadow,
		borderRadius: GS.borderRadius,
		alignItems: 'center',
	},
	title: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		paddingVertical: 8,
		borderBottomWidth: 2,
		borderBottomColor: GS.borderColor,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	titleText: {
		width: '100%',
		textAlign: 'center',
		fontSize: 28,
		fontFamily: GS.fontFamily,
		fontWeight: '900',
		color: GS.text_color,
	},
	body: {
		width: '100%',
		paddingVertical: 4,
		paddingHorizontal: 12,
	},
	info: {
		width: '100%',
		fontSize: 24,
		color: GS.text_color,
		lineHeight: Platform.OS === "ios" ? 28 : null
	},
	button: {
		backgroundColor: '#4099ff',
		borderRadius: GS.borderRadius,
		paddingVertical: 16,
		paddingHorizontal: 16,
		marginVertical: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
