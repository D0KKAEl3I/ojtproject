import 'react-native-gesture-handler';
import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import IconButton from './IconButton';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';

export default function Header({ title, navigation, route, options, ...props }) {
	const context = useContext(GlobalContext);

	return (
		<View style={styles.container}>
			{/* 헤더 왼쪽 아이콘 버튼 */}
			<IconButton
				size={48}
				onPress={
					props.back
						? // 뒤로 돌아갈 페이지가 있을 경우 뒤로가기 버튼이 됨
						navigation.goBack
						: // 필터 메뉴가 열려있을 시 비활성
						() => context.status === 'WorkHome' && props.setOnMenu(true)
				}>
				<Image
					style={{ width: 36, height: 36 }}
					source={props.back ?
						options.animation === "slide_from_bottom" //아래에서 올라온 화면일때
							? require('../../public/downarrow_black.png') //아래방향 화살표
							:  //아래에서 올라오지 않을 경우 모두 오른쪽에서 슬라이드된 화면이기에
							require('../../public/back_black.png') //왼쪽방향 화살표
						: require('../../public/menu_black.png') //기본은 햄버거 메뉴
					}
				/>
			</IconButton>
			<Text style={styles.title}>{title}</Text>
			{!props.back && (
				<View style={{ height: '100%', flexDirection: 'row' }}>
					<IconButton
						size={48}
						onPress={() =>
							context.status === 'WorkHome' && navigation.navigate('Alarm')
						}>
						{props.alarmCount > 0 && (
							<View style={styles.alarmCount}>
								<Text style={styles.alarmCountNum}>
									{props.alarmCount < 10 ? props.alarmCount : '9+'}
								</Text>
							</View>
						)}
						<Image
							style={{ width: 36, height: 36 }}
							source={require('../../public/notifi_black.png')}
						/>
					</IconButton>
					<IconButton
						size={48}
						onPress={() =>
							context.status === 'WorkHome' && props.setOnFilter(true)
						}>
						<Image
							style={{ width: 36, height: 36 }}
							source={require('../../public/filter_black.png')}
						/>
					</IconButton>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: '100%',
		height: 48,
		justifyContent: 'space-between',
		paddingHorizontal: GS.padding,
		backgroundColor: '#ffffff',
		elevation: GS.elevation,
		...GS.shadow,
		overflow: 'visible',
		zIndex: 99,
	},
	title: {
		position: 'absolute',
		width: '100%',
		textAlign: 'center',
		left: 0,
		top: 0,
		lineHeight: 44,
		fontSize: 24,
		fontWeight: '900',
		color: GS.text_color,
		zIndex: -1,
	},
	alarmCount: {
		position: 'absolute',
		right: 10,
		top: 12,
		paddingHorizontal: 4,
		backgroundColor: GS.red,
		borderRadius: 999,
		zIndex: 2,
	},
	alarmCountNum: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 10,
		fontWeight: '900',

	}
});
