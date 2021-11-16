import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { BS } from '../GlobalStyles';
import Block from './Block';

export default function AlarmBlock({ navigation, route, select, ...props }) {
	const [workStateColor, setWorkStateColor] = useState('#404040');
	useEffect(() => {
		switch (props.notiType) {
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

	return (
		<Block
			navigation={navigation}
			route={route}
			title={`알림 / ${props.notiDate}`}
			onTouchEnd={() => !props.selected ? select(props) : select(null)}
			toDetail={{ screenName: "AlarmDetail", params: { workData: props } }}
			selected={props.selected}>
			<Text style={[styles.info, { color: workStateColor }]}>
				작업상태: {props.notiType}
			</Text>
			<Text style={styles.info}>
				작업주소: {props.workLocation ?? '정보 없음'}
			</Text>
			<Text style={styles.info}>
				작업자명: {props.userName ?? '정보 없음'}
			</Text>
			<Text style={styles.info}>
				{props.workState === '작업완료'
					? `작업완료일: ${props.workCompleteDate ?? '미정'}`
					: `작업예정일: ${props.workDueDate ?? '미정'}`}
			</Text>
		</Block>
	);
}

const styles = BS;
