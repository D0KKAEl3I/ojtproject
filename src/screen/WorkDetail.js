import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from 'react-native';
import config from '../../com.config.json';
import GS from '../GlobalStyles';

export default function WorkDetail({ navigation, route, ...props }) {
	const [onLoading, setOnLoading] = useState(false);
	const [workDetailInfo, setWorkDetailInfo] = useState({});
	const [workStateColor, setWorkStateColor] = useState('#404040');

	useEffect(() => {
		(async () => {
			setOnLoading(true);
			let response;
			try {
				response = await fetch(config.APISERVER.URL + '/api/v1/workReqDetail', {
					method: 'POST',
					body: {
						requesterSn: route.params.userData.userSn,
						workerSn: 1,
					},
				});
				response = await response.json();
				setWorkDetailInfo({ ...route.params.workData, ...response });
			} catch (e) {
				console.log(e);
			} finally {
				setOnLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		switch (route.params.workData.workState) {
			case '미배정':
				setWorkStateColor('#f00000');
				break;
			case '배정완료':
				setWorkStateColor('#80a000');
				break;
			case '준비':
				setWorkStateColor('#a08000');
				break;
			case '진행중':
				setWorkStateColor('#00a000');
				break;
			case '작업완료':
				setWorkStateColor('#808080');
				break;
			default:
				setWorkStateColor('#404040');
				break;
		}
	}, []);

	return (
		<View style={styles.container}>
			{onLoading ? (
				<ActivityIndicator size="large" style={{ flex: 1 }} />
			) : (
				<View style={styles.content}>
					<View style={styles.title}>
						<Text style={styles.titleText}>{workDetailInfo.workName}</Text>
					</View>
					<View style={styles.body}>
						<Text style={[styles.info, { color: workStateColor }]}>
							작업상태: {workDetailInfo.workState}
						</Text>
						<Text style={styles.info}>
							작업지점: {workDetailInfo.workName}
						</Text>
						<Text style={styles.info}>
							작업주소: {workDetailInfo.workLocation}
						</Text>
						<Text style={styles.info}>
							{workDetailInfo.workState === '작업완료'
								? '작업완료자: '
								: '작업예정자: '}
							{workDetailInfo.userName ?? '미정'}
						</Text>
						<Text style={styles.info}>
							{workDetailInfo.workState === '작업완료'
								? `작업완료일: ${workDetailInfo.workCompleteDate ?? '미정'}`
								: `작업예정일: ${workDetailInfo.workDueDate ?? '미정'}`}
						</Text>
						<Text style={styles.info}>
							작업자 전화번호: {
								<Text
									style={{
										fontSize: 24,
										color: '#0000aa',
										textDecorationColor: '#0000aa',
										textDecorationLine: 'underline',
									}}
								// onPress={() => Linking.openURL(`tel:${workDetailInfo.userPhoneNumber}`)}
								>
									{workDetailInfo.userPhoneNumber ?? '미정'}
								</Text>}
						</Text>
					</View>
					<Pressable onPress={navigation.goBack} style={styles.button}>
						<Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 20 }}>
							돌아가기
						</Text>
					</Pressable>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	content: {
		flex: 1,
		maxWidth: 512,
		backgroundColor: '#ffffff',
		margin: GS.margin,
		...GS.shadow,
		borderRadius: GS.borderRadius,
	},
	title: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 8,
		borderBottomWidth: 2,
		borderBottomColor: GS.borderColor,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	titleText: {
		fontSize: 28,
		fontFamily: GS.fontFamily,
		fontWeight: '900',
		color: GS.text_color,
	},
	body: {
		flex: 1,
		justifyContent: 'flex-start',
		margin: GS.margin,
		marginTop: GS.margin / 2
	},
	info: {
		paddingVertical: GS.padding / 2,
		fontSize: 24,
		color: GS.text_color,
		lineHeight: Platform.OS === "ios" ? 28 : null
	},
	button: {
		height: 48,
		backgroundColor: GS.active_color,
		borderBottomLeftRadius: GS.borderRadius,
		borderBottomRightRadius: GS.borderRadius,
		paddingVertical: GS.padding,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
