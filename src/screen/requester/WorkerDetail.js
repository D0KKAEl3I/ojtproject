import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

import GS from '../../GlobalStyles';
import TitleText from '../../component/TitleText';
import ContentView from '../../component/ContentView';
import GlobalContext from '../../GlobalContext';

export default function WorkerDetail({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [onLoading, setOnLoading] = useState(false);
	const [workerDetailInfo, setWorkerDetailInfo] = useState({});

	useEffect(() => {
		(async () => {
			setOnLoading(true);
			let response;
			try {
				response = await fetch(context.config.APISERVER.URL + '/api/v1/workerDetail', {
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

	return onLoading ? (
		<ActivityIndicator size="large" style={{ flex: 1 }} />
	) : (
		<View style={styles.content}>
			<TitleText>
				{`${workerDetailInfo.workerName} 작업자`}
			</TitleText>
			<ScrollView>
				<ContentView >
					<View style={styles.body}>
						<View style={styles.info}>
							<Text style={styles.infoName}>닉네임</Text>
							<Text style={styles.infoText}>{workerDetailInfo.workerNickname}</Text>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoName}>작업가능여부</Text>
							<Text style={styles.infoText}>{workerDetailInfo.workAvailability}</Text>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoName}>총 수행 작업 수</Text>
							<Text style={styles.infoText}>{workerDetailInfo.workerQCW}건</Text>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoName}>소재지 주소</Text>
							<Text style={styles.infoText}>{workerDetailInfo.workLocation}</Text>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoName}>작업 장소까지의 거리</Text>
							<Text style={styles.infoText}>{workerDetailInfo.userDistance}</Text>
						</View>
					</View>
				</ContentView>
				<ContentView label="위치 정보" style={{ height: 400, paddingVertical: GS.padding, paddingHorizontal: GS.padding }}>
				</ContentView>
			</ScrollView>
			<View style={styles.bottomTab}>
				<Pressable onPress={navigation.goBack} style={styles.button}>
					<Text style={{ color: '#ffffff', fontFamily: GS.font_family, fontWeight: GS.font_weight.bold, fontSize: 20 }}>
						돌아가기
					</Text>
				</Pressable>
			</View>
		</View>
	)
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
		paddingVertical: GS.padding
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

});
