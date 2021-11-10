import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import config from '../../com.config.json';
import GS from '../GlobalStyles';

export default function WorkerDetail({ navigation, route, ...props }) {
	const [onLoading, setOnLoading] = useState(false);
	const [workerDetailInfo, setWorkerDetailInfo] = useState({});

	useEffect(() => {
		(async () => {
			setOnLoading(true);
			let response;
			try {
				response = await fetch(config.APISERVER.URL + '/api/v1/workerDetail', {
					method: 'GET',
					params: {
						requesterSn: route.params.userData.userSn,
						workerSn: route.params.workerSn,
						workLocation: route.params.workerData.workLocation
					},
				});
				response = await response.json();
				setWorkerDetailInfo({ ...route.params.workerData, ...response });
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
						<Text style={styles.titleText}>{workerDetailInfo.workerName} 작업자님의 정보</Text>
					</View>
					<View style={styles.body}>
						<Text style={styles.info}>
							닉네임: {workerDetailInfo.workerNickname}
						</Text>
						<Text style={styles.info}>
							작업가능여부: {workerDetailInfo.workAvailability}
						</Text>
						<Text style={styles.info}>
							총 수행 작업 수: {workerDetailInfo.workerQCW}건
						</Text>
						<Text style={styles.info}>
							소재지 주소: {workerDetailInfo.workLocation}
						</Text>
						<Text style={styles.info}>
							작업 장소까지의 거리: {workerDetailInfo.userDistance}
						</Text>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<MapView style={{ width: '100%', height: '100%' }}
								provider={PROVIDER_GOOGLE}
							/>

						</View>
					</View>
					<Pressable onPress={navigation.goBack} style={styles.button}>
						<Text style={{ color: '#ffffff', fontFamily: GS.font_family, fontWeight: GS.font_weight.bold, fontSize: 20 }}>
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
		elevation: GS.elevation,
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
		fontFamily: GS.font_family,
		fontWeight: GS.font_weight.bold,
		color: GS.text_color,
	},
	body: {
		flex: 1,
		justifyContent: 'flex-start',
		margin: GS.margin,
		marginTop: GS.margin / 2
	},
	info: {
		paddingVertical: GS.padding,
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
