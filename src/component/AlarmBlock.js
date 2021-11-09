import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import IconButton from './IconButton';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';

export default function AlarmBlock({ navigation, route, select, ...props }) {
	const [workStateColor, setWorkStateColor] = useState('#404040');
	useEffect(() => {
		switch (props.workState) {
			case '배정취소':
				setWorkStateColor('#f00000');
				break;
			case '배정요청':
				setWorkStateColor('#f0a000');
				break;
			case '작업자변경':
				setWorkStateColor('#f0a000');
				break;
			case '배정완료':
				setWorkStateColor('#00a000');
				break;
			default:
				setWorkStateColor('#404040');
				break;
		}
	}, []);

	const context = useContext(GlobalContext);

	return (
		<GlobalContext.Consumer>
			{state => (
				<View
					style={[styles.container, props.selected && styles.selected]}
					onTouchEnd={e => (!props.selected ? select(props) : select(null))}>
					<View style={styles.title}>
						<Text style={styles.titleText}>
							알림{props.messageSn} / {props.messageDate}
						</Text>
						<IconButton
							onPress={() =>
								navigation.navigate('AlarmDetail', {
									userData: state.userData,
									workData: props,
								})
							}
							size={48}>
							<View
								style={styles.openButton}
								onTouchEnd={e => e.stopPropagation()}>
								<Image
									style={{ width: '100%', height: '100%', opacity: 0.7 }}
									source={require('../../public/next_black.png')}
								/>
							</View>
						</IconButton>
					</View>
					<Text style={styles.body}>
						<Text style={[styles.info, { color: workStateColor }]}>
							작업상태: {props.workState}
							{'\n'}
						</Text>
						<Text style={styles.info}>
							작업주소: {props.workLocation ?? '정보 없음'}
							{'\n'}
						</Text>
						<Text style={styles.info}>
							작업자명: {props.userName ?? '정보 없음'}
							{'\n'}
						</Text>
						<Text style={styles.info}>
							작업예정일: {props.workDueDate ?? '미정'}
							{'\n'}
						</Text>
						<Text style={styles.info}>
							작업완료일: {props.workCompleteDate ?? '미정'}
						</Text>
					</Text>
				</View>
			)}
		</GlobalContext.Consumer>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#ffffff',
		borderRadius: GS.borderRadius,
		marginVertical: GS.margin / 2,
		marginHorizontal: GS.margin,
		elevation: GS.elevation,
		...GS.shadow
	},
	selected: {
		backgroundColor: '#a0d9ff',
	},
	title: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: GS.padding * 2,
		borderBottomColor: GS.borderColor,
		borderBottomWidth: 2,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8
	},
	titleText: {
		fontSize: 24,
		fontWeight: '900',
		color: GS.text_color,
		fontFamily: GS.fontFamily,
	},
	openButton: {
		width: 40,
		height: 40,
		borderRadius: 999,
	},
	body: {
		paddingVertical: 4,
		paddingHorizontal: GS.padding * 2,
	},
	info: {
		width: '100%',
		fontSize: 20,
		color: GS.text_color,
		lineHeight: Platform.OS === "ios" ? 28 : null
	},
});
