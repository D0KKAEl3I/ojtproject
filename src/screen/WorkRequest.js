import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable } from 'react-native';
import config from '../../com.config.json';
import GS from '../GlobalStyles';
import GlobalContext from '../GlobalContext';

export default function WorkRequest({ navigation, route, ...props }) {
	const context = useContext(GlobalContext)
	const [{ workData, workerData }, setWorkRequestData] = useState({ workData: {}, workerData: {} });

	useEffect(() => {
		setWorkRequestData({ ...route.params });
		console.log(workData);
	}, []);

	const requestWork = async () => {
		let response;
		try {
			response = await fetch(config.APISERVER.URL + '/api/v1/workerRequest', {
				method: "POST",
				body: {
					requesterSn: context.userData.userSn,
					workSn: workData.workSn,
					workerSn: workerData.workerSn
				}
			})
			response = await response.json();
			console.log(response);
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.title}>
					<Text style={styles.titleText}>{workerData.workerName} 작업자님의 정보</Text>
				</View>
				<View style={styles.body}>
					<Text style={styles.info}>
						작업지점: {workData.workName}
					</Text>
					<Text style={styles.info}>
						요청사항: 작업요청
					</Text>
					<Text style={styles.info}>
						요청사유: 없음
					</Text>
					<Text style={styles.info}>
						작업주소: {workData.workLocation}
					</Text>
					<Text style={styles.info}>
						작업예정일: {workData.workDueDate}
					</Text>
					<Text style={styles.info}>
						작업예정자: {workerData.workerName}
					</Text>
					<Text style={styles.info}>
						작업자연락처: {workData.userPhoneNumber}
					</Text>

				</View>
				<View style={{ flexDirection: 'row' }}>
					<Pressable onPress={requestWork} style={[styles.button, { borderRightWidth: 1, borderColor: '#fff', borderBottomLeftRadius: GS.borderRadius }]}>
						<Text style={{ color: '#ffffff', fontFamily: GS.fontFamily, fontWeight: '900', fontSize: 20 }}>
							작업 요청하기
						</Text>
					</Pressable>
					<Pressable onPress={navigation.goBack} style={[styles.button, { borderLeftWidth: 1, borderColor: '#fff', borderBottomRightRadius: GS.borderRadius }]}>
						<Text style={{ color: '#ffffff', fontFamily: GS.fontFamily, fontWeight: '900', fontSize: 20 }}>
							돌아가기
						</Text>
					</Pressable>
				</View>
			</View>
		</View >
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
		flex: 1,
		height: 48,
		backgroundColor: GS.active_color,
		paddingVertical: GS.padding,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
