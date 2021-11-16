import 'react-native-gesture-handler';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, Linking } from 'react-native';

import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';

export default function AcceptAlarm({ data, goBack, ...props }) {
	const context = useContext(GlobalContext);
	const [onLoading, setOnLoading] = useState(false);
	const [alarm, setAlarm] = useState(data);

	useEffect(() => {
		(async () => {
			setOnLoading(true);
			let response;
			try {
				response = await fetch(context.config.APISERVER.URL + '/api/v1/messageDetail', {
					method: 'GET',
					params: {
						userSn: context.userData.userSn,
						messageSn: data.messageSn,
					},
				});
				response = await response.json();
				setAlarm({ ...alarm, ...response });
			} catch (e) {
				console.log(e);
			} finally {
				setOnLoading(false);
			}
		})();
	}, []);

	return onLoading ? (
		<ActivityIndicator style={{ padding: 32 }} size="large" />
	) : (
		<View style={styles.container}>
			<View style={styles.title}>
				<Text style={styles.titleText}>알림 수락</Text>
			</View>
			<View style={styles.body}>
				<Text style={styles.info}>작업지점: {'지점명'}</Text>
				<Text style={styles.info}>요청사항: {alarm.messageMemo}</Text>
				<Text style={styles.info}>작업주소: {alarm.workLocation}</Text>
				<Text style={styles.info}>
					{alarm.workState === '작업완료'
						? `작업완료일: ${alarm.workCompleteDate ?? '미정'}`
						: `작업예정일: ${alarm.workDueDate ?? '미정'}`}
				</Text>
				<Text style={styles.info}>
					{alarm.workState === '작업완료'
						? `완료작업자: ${alarm.userName ?? '미정'}`
						: `예정작업자: ${alarm.userName ?? '미정'}`}
				</Text>
				<Text style={styles.info}>
					작업자 전화번호:{' '}
					{
						<Text
							style={{
								color: alarm.userPhoneNumber ? '#0000aa' : '#000',
								textDecorationColor: '#0000aa',
								textDecorationLine: alarm.userPhoneNumber
									? 'underline'
									: 'none',
							}}
						/* onPress={ alarm.userPhoneNumber && () => Linking.openURL(`tel:${alarm.userPhoneNumber}`)}*/
						>
							{alarm.userPhoneNumber ?? '정보 없음'}
						</Text>
					}
				</Text>
			</View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-around',
					width: 300,
				}}>
				<Pressable style={styles.button}>
					<Text style={{ color: '#ffffff', fontWeight: GS.font_weight.bold, fontSize: 20 }}>
						알림 수락
					</Text>
				</Pressable>
				<Pressable onPress={goBack} style={styles.button}>
					<Text style={{ color: '#ffffff', fontWeight: GS.font_weight.bold, fontSize: 20 }}>
						닫기
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: GS.border_radius,
		marginHorizontal: 32,
		backgroundColor: '#ffffff',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	title: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 4,
		marginHorizontal: 8,
		borderBottomColor: '#a0a0a0',
		borderBottomWidth: 2,
	},
	titleText: {
		flex: 1,
		textAlign: 'center',
		fontSize: 28,
		fontWeight: GS.font_weight.bold,
		color: '#404040',
	},
	body: {
		marginHorizontal: 8,
		paddingVertical: 4,
	},
	info: {
		fontSize: 20,
		color: GS.text_color,
	},
	button: {
		minWidth: 128,
		backgroundColor: '#4099ff',
		borderRadius: GS.border_radius,
		padding: 16,
		marginVertical: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
