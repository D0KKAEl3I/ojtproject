import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

import GS from '../../GlobalStyles';
import TitleText from '../../component/TitleText';
import ContentView from '../../component/ContentView';
import GlobalContext from '../../GlobalContext';
import BottomButton from '../../component/BottomButton';
import NaverMap, { getTraoptimal } from '../../component/NaverMap';
import Icon from '../../component/Icon';

const sampleCoordinates = [{ latitude: 37.481073, longitude: 127.123328 }, { latitude: 37.48, longitude: 127.2 }]

export default function WorkerDetail({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [onLoading, setOnLoading] = useState(false);
	const [workerDetailInfo, setWorkerDetailInfo] = useState({});
	const [path, setPath] = useState([])
	const [distance, setDistance] = useState(0);


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
				setWorkerDetailInfo({ ...route.params.workerData, ...response });
			} catch (e) {
				console.log(e);
			} finally {
				setOnLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		if (workerDetailInfo !== {}) {
			(async () => {
				let traoptimal = await getTraoptimal(sampleCoordinates)
				traoptimal = traoptimal[0]
				setPath(traoptimal.path.map(([longitude, latitude]) => ({ latitude, longitude })))
				let distance = 0;
				traoptimal.guide.map(item => distance += item.distance)
				setDistance(distance)
			})()
		}
	}, [workerDetailInfo])

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
							<View style={styles.label}>
								<Icon style={styles.infoIcon} name="nametag" />
								<Text style={styles.infoName}>닉네임</Text>
							</View>
							<Text style={styles.infoText}>{workerDetailInfo.userNickName}</Text>
						</View>
						<View style={styles.info}>
							<View style={styles.label}>
								<Icon style={styles.infoIcon} name="location_city" />
								<Text style={styles.infoName}>작업가능여부</Text>
							</View>
							<Text style={styles.infoText}>{workerDetailInfo.workAvailability}</Text>
						</View>
						<View style={styles.info}>
							<View style={styles.label}>
								<Icon style={styles.infoIcon} name="location_city" />
								<Text style={styles.infoName}>총 수행 작업 수</Text>
							</View>
							<Text style={styles.infoText}>{workerDetailInfo.userQCW}건</Text>
						</View>
						<View style={styles.info}>
							<View style={styles.label}>
								<Icon style={styles.infoIcon} name="location_city" />
								<Text style={styles.infoName}>소재지 주소</Text>
							</View>
							<Text style={styles.infoText}>{workerDetailInfo.userLocation}</Text>
						</View>
						<View style={styles.info}>
							<View style={styles.label}>
								<Icon style={styles.infoIcon} name="phone" />
								<Text style={styles.infoName}>연락처</Text>
							</View>
							<Text style={{
								fontSize: 24,
								color: '#0000aa',
								textDecorationColor: '#0000aa',
								textDecorationLine: 'underline',
							}}>{workerDetailInfo.userPhoneNumber || '없음'}</Text>
						</View>
					</View>
				</ContentView>
				<ContentView label="위치 정보" style={{ paddingHorizontal: GS.padding }}>
					<View style={styles.map}>
						<NaverMap
							path={path}
							center={sampleCoordinates[0]}
							markers={sampleCoordinates}
						/>
					</View>
					<View style={styles.info}>
						<View style={styles.label}>
							<Icon style={styles.infoIcon} name="location" />
							<Text style={styles.infoName}>작업 장소까지의 거리</Text>
						</View>
						<Text style={styles.infoText}>
							{
								distance < 1000 ?
									`${distance}m`
									:
									`${distance / 1000}km`
							}
						</Text>
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
	label: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	infoIcon: {
		width: 28,
		height: 28,
		opacity: 0.7,
		marginRight: GS.margin
	},
	infoName: {
		color: GS.text_color,
		fontFamily: GS.font_family,
		fontSize: 18,
		fontWeight: GS.font_weight.bold,
	},
	infoText: {
		color: GS.text_color,
		fontFamily: GS.font_family,
		fontSize: 22,
		fontWeight: GS.font_weight.regular,
	},
	map: {
		height: 400,
		marginVertical: GS.margin,
		borderRadius: GS.border_radius,
		overflow: 'hidden',
	},
});
