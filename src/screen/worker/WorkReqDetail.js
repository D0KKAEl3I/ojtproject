import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import GS from '../../GlobalStyles';
import ContentView from '../../component/ContentView';
import GlobalContext from '../../GlobalContext';
import TitleText from '../../component/TitleText';
import GoogleMap from '../../component/GoogleMap';

export default function WorkReqDetail({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [onLoading, setOnLoading] = useState(false);
	const [workReqDetailInfo, setWorkReqDetailInfo] = useState({});
	const [workStateColor, setWorkStateColor] = useState('#404040');

	useEffect(() => {
		(async () => {
			setOnLoading(true);
			let response;
			try {
				response = await fetch(context.config.APISERVER.URL + '/api/v1/workReqDetail', {
					method: 'GET',
					params: {
						requesterSn: context.userData.userSn,
						workerSn: 1,
					},
				});
				response = await response.json();
				setWorkReqDetailInfo({ ...route.params.workData, ...response });
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

	return onLoading ? (
		<ActivityIndicator size="large" style={{ flex: 1 }} />
	) : (
		<View style={styles.content}>
			<TitleText>
				{`${workReqDetailInfo.userCompany} 작업 상세`}
			</TitleText>
			<ScrollView>
				<ContentView label="의뢰 정보">
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 상태</Text>
						<Text style={[styles.infoText, { color: workStateColor }]}>
							{workReqDetailInfo.workState}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 지점</Text>
						<Text style={styles.infoText}>
							{workReqDetailInfo.workName}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 주소</Text>
						<Text style={styles.infoText}>
							{workReqDetailInfo.workLocation}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>
							{workReqDetailInfo.workState === '작업완료' ?
								"작업완료일" : "작업예정일"}
						</Text>
						<Text style={styles.infoText}>
							{workReqDetailInfo.workState === '작업완료' ?
								workReqDetailInfo.workCompleteDate || '없음'
								:
								workReqDetailInfo.workDueDate || '없음'}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업지까지의 거리</Text>
						<Text style={styles.infoText}>
							{workReqDetailInfo.workDistance}
						</Text>
					</View>
				</ContentView>
				<ContentView label="위치 정보" style={{ paddingHorizontal: GS.padding }}>
					<View style={styles.map}>
						<GoogleMap
							coordinate={{ latitude: 37.481073, longitude: 127.123328 }}
							markers={[{ latitude: 37.481073, longitude: 127.123328 }]}
						/>
						<View style={styles.mapText}>
							<Text style={{ color: '#fff' }}>앱에서 확인하기</Text>
						</View>
					</View>
				</ContentView>
				<ContentView label="의뢰자 정보">
					<View style={styles.info}>
						<Text style={styles.infoName}>의뢰자 성명</Text>
						<Text style={styles.infoText}>
							{workReqDetailInfo.userName}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>의뢰 업체명</Text>
						<Text style={styles.infoText}>
							{workReqDetailInfo.userCompany}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>의뢰자 연락처
						</Text>
						<Text style={styles.infoText}>
							{<Text
								style={{
									fontSize: 24,
									color: '#0000aa',
									textDecorationColor: '#0000aa',
									textDecorationLine: 'underline',
								}}
							// onPress={() => Linking.openURL(`tel:${workDetailInfo.userPhoneNumber}`)}
							>
								{workReqDetailInfo.userPhoneNumber || '없음'}
							</Text>}
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
		maxWidth: 512,
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
		height: 200,
		marginVertical: GS.margin,
		borderRadius: GS.border_radius,
		overflow: 'hidden',
	},
	mapText: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: '#000000a0',
		borderTopLeftRadius: GS.border_radius,
		borderBottomRightRadius: GS.border_radius,
		padding: GS.padding
	},
});
