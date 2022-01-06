import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import GS from '../../GlobalStyles';
import ContentView from '../../component/ContentView';
import GlobalContext from '../../GlobalContext';
import TitleText from '../../component/TitleText';
import BottomButton from '../../component/BottomButton';
import Icon from '../../component/Icon';

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
				setWorkStateColor('#f0a000');
				break;
			case '준비':
				setWorkStateColor('#f0a000');
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
				<ContentView>
					<View style={styles.info}>
						<View style={styles.label}>
							<Icon />
							<Text style={styles.infoName}>상태</Text>
						</View>
						<Text style={[styles.infoText, { color: workStateColor }]}>{workDetailInfo.workState}</Text>
					</View>
					<View style={styles.info}>
						<View style={styles.label}>
							<Icon style={styles.infoIcon} name="location_city" />
							<Text style={styles.infoName}>지점</Text>
						</View>
						<Text style={styles.infoText}>{workDetailInfo.workName}</Text>
					</View>
					<View style={styles.info}>
						<View style={styles.label}>
							<Icon style={styles.infoIcon} name="location" />
							<Text style={styles.infoName}>주소</Text>
						</View>
						<Text style={styles.infoText}>{workDetailInfo.workLocation}</Text>
					</View>
					<View style={styles.info}>
						<View style={styles.label}>
							<Icon style={styles.infoIcon} name="watch" />
							<Text style={styles.infoName}>{workDetailInfo.workState === '작업완료' ? "완료일" : "예정일"}</Text>
						</View>
						<Text style={styles.infoText}>
							{workDetailInfo.workState === '작업완료'
								? workDetailInfo.workCompleteDate || '없음'
								: workDetailInfo.workDueDate || '없음'}
						</Text>
					</View>
				</ContentView>
				<ContentView label="작업자 정보">
					<View style={styles.info}>
						<View style={styles.label}>
							<Icon style={styles.infoIcon} name="nametag" />
							<Text style={styles.infoName}>이름</Text>
						</View>
						<Text style={styles.infoText}>
							{workDetailInfo.userName || '없음'}
						</Text>
					</View>
					<View style={styles.info}>
						<View style={styles.label}>
							<Icon style={styles.infoIcon} name="phone" />
							<Text style={styles.infoName}>연락처</Text>
						</View>
						<Text
							style={{
								fontSize: 24,
								color: '#0000aa',
								textDecorationColor: '#0000aa',
								textDecorationLine: 'underline',
							}}
						// onPress={() => Linking.openURL(`tel:${workDetailInfo.userPhoneNumber}`)}
						>{workDetailInfo.userPhoneNumber || '없음'}</Text>
					</View>
				</ContentView>
			</ScrollView>
			<BottomButton data={[{ value: '돌아가기', onPress: navigation.goBack }]} />
		</View >
	)
}

const styles = StyleSheet.create({

	content: {
		flex: 1,
		maxWidth: GS.wrapper.max_width,
	},
	info: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: GS.padding,
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
});
