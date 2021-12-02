import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

import GS from '../../GlobalStyles';
import TitleText from '../../component/TitleText';
import ContentView from '../../component/ContentView';
import GlobalContext from '../../GlobalContext';
import BottomButton from '../../component/BottomButton';
import NaverMap from '../../component/NaverMap';

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
						workerSn: route.params.userSn,
						// workLocation: route.params.workerData.workLocation
					},
				});
				response = await response.json();
				console.log(response);
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
				{`${workerDetailInfo.userName} 작업자`}
			</TitleText>
			<ScrollView>
				<ContentView >
					<View style={styles.body}>
						<View style={styles.info}>
							<Text style={styles.infoName}>닉네임</Text>
							<Text style={styles.infoText}>{workerDetailInfo.userNickName}</Text>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoName}>작업가능여부</Text>
							<Text style={styles.infoText}>{workerDetailInfo.workAvailability}</Text>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoName}>총 수행 작업 수</Text>
							<Text style={styles.infoText}>{workerDetailInfo.userQCW}건</Text>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoName}>소재지 주소</Text>
							<Text style={styles.infoText}>{workerDetailInfo.userLocation}</Text>
						</View>
						{/* <View style={styles.info}>
							<Text style={styles.infoName}>작업 장소까지의 거리</Text>
							<Text style={styles.infoText}>{workerDetailInfo.userDistance}</Text>
						</View> */}
					</View>
				</ContentView>
				<ContentView label="위치 정보" style={{ paddingHorizontal: GS.padding }}>
					<View style={styles.map}>
						<NaverMap
							initialRegion={{ latitude: 37.481073, longitude: 127.123328 }}
							markers={[{ latitude: 37.481073, longitude: 127.123328 }]}
						/>
					</View>
				</ContentView>
			</ScrollView>
			<BottomButton data={[{ value: '돌아가기', onPress: navigation.goBack }]} />
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
	map: {
		height: 400,
		marginVertical: GS.margin,
		borderRadius: GS.border_radius,
		overflow: 'hidden',
	},
});
