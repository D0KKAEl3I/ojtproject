import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import GS from '../../GlobalStyles';
import ContentView from '../../component/ContentView';
import GlobalContext from '../../GlobalContext';
import TitleText from '../../component/TitleText';
import BottomButton from '../../component/BottomButton';

export default function WorkDetail({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [onLoading, setOnLoading] = useState(false);
	const [workDetailInfo, setWorkDetailInfo] = useState({});
	const [workStateColor, setWorkStateColor] = useState('#404040');

	useEffect(() => {
		(async () => {
			setOnLoading(true);
			let response;
			try {
				response = await fetch(context.config.APISERVER.URL + '/api/v1/workDetail', {
					method: 'POST',
					body: {
						requesterSn: context.userData.userSn,
						workerSn: 1,
					},
				});
				response = await response.json();
				console.log(route.params.workData);
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

	return onLoading ? (
		<ActivityIndicator size="large" style={{ flex: 1 }} />
	) : (
		<View style={styles.content}>
			<TitleText>
				{`${workDetailInfo.workName} 상세정보`}
			</TitleText>
			<ScrollView>
				<ContentView >
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 상태</Text>
						<Text style={[styles.infoText, { color: workStateColor }]}>
							{workDetailInfo.workState}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 지점</Text>
						<Text style={styles.infoText}>
							{workDetailInfo.workName}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업 주소</Text>
						<Text style={styles.infoText}>
							{workDetailInfo.workLocation}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업자 성명</Text>
						<Text style={styles.infoText}>
							{workDetailInfo.userName || '없음'}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>
							{workDetailInfo.workState === '작업완료' ?
								"작업완료일" : "작업예정일"}
						</Text>
						<Text style={styles.infoText}>
							{workDetailInfo.workState === '작업완료' ?
								workDetailInfo.workCompleteDate || '없음'
								:
								workDetailInfo.workDueDate || '없음'}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.infoName}>작업자 연락처
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
								{workDetailInfo.userPhoneNumber || '없음'}
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


});
