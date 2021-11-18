import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconButton from './IconButton';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';
import Icon from './Icon';

export default function Header({ title, navigation, route, options, ...props }) {
	const context = useContext(GlobalContext);

	return (
		<View style={styles.container}>
			{/* 헤더 왼쪽 아이콘 버튼 */}
			<IconButton
				style={{ flexDirection: 'row' }}
				onPress={
					props.back
						? // 뒤로 돌아갈 페이지가 있을 경우 뒤로가기 버튼이 됨
						navigation.goBack
						: // 필터 메뉴가 열려있을 시 비활성
						() => context.status === 'WorkHome' && props.setOnMenu(true)
				}>
				{props.back ? (
					<>
						<Icon style={{ width: 32, height: 32, opacity: 0.8 }}
							name="back" />
						<Text style={styles.back}>뒤로</Text>
					</>
				) : (
					<Icon style={{ width: 36, height: 36, opacity: 0.8 }}
						name="menu" />
				)}
			</IconButton>
			<Text style={styles.title}>{title}</Text>
			{!props.back && (
				<View style={{ height: '100%', flexDirection: 'row' }}>
					<IconButton
						onPress={() =>
							context.status === 'WorkHome' && navigation.navigate('Alarm')
						}>
						<Icon
							style={{ width: 36, height: 36, opacity: 0.8 }}
							name={props.alarmCount > 0 ? "notice_on" : "notice_off"}
						/>
						{props.alarmCount > 0 && (
							<View style={styles.alarmCount}>
								<Text style={styles.alarmCountNum}>
									{props.alarmCount < 10 ? props.alarmCount : '9+'}
								</Text>
							</View>
						)}
					</IconButton>
					<IconButton

						onPress={() =>
							context.status === 'WorkHome' && props.setOnFilter(true)
						}>
						<Icon
							style={{ width: 36, height: 36, opacity: 0.8 }}
							name="filter"
						/>
					</IconButton>
				</View>
			)
			}
		</View >
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		height: 40,
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: GS.padding_horizontal,
		backgroundColor: GS.background_color,
		zIndex: 99,
	},
	title: {
		position: 'absolute',
		textAlign: 'center',
		left: 0,
		right: 0,
		top: 0,
		fontFamily: GS.font_family,
		fontSize: 24,
		fontWeight: GS.font_weight.bold,
		color: GS.text_color,
		zIndex: -1
	},
	back: {
		color: GS.text_color,
		fontFamily: GS.font_family,
		fontSize: 16,
		fontWeight: GS.font_weight.regular,
		marginLeft: -4
	},
	alarmCount: {
		position: 'absolute',
		right: 4,
		top: 10,
		paddingHorizontal: 4,
		backgroundColor: '#ff0000',
		borderRadius: 999,
		zIndex: 2,
	},
	alarmCountNum: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 10,
		fontWeight: GS.font_weight.bold,

	}
});
