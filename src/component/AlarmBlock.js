import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { BS } from '../GlobalStyles';
import Block from './Block';
import Icon from './Icon';

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
			<View style={styles.info}>
				<Icon style={styles.infoIcon} />
				<Text style={[styles.infoText, { color: workStateColor }]}>
					상태: {props.workState || "없음"}
				</Text>
			</View>
			<View style={styles.info}>
				<Icon style={styles.infoIcon} name="location" color="black" />
				<Text style={styles.infoText}>
					주소: {props.workLocation || "없음"}
				</Text>
			</View>
			<View style={styles.info}>
				<Icon style={styles.infoIcon} name="nametag" />
				<Text style={styles.infoText}>
					작업자명: {props.userName || "없음"}
				</Text>
			</View>
			<View style={styles.info}>
				<Icon style={styles.infoIcon} name="watch" />
				<Text style={styles.infoText}>
					{props.workState === '작업완료'
						? `작업완료일: ${props.workCompleteDate || '없음'}`
						: `작업예정일: ${props.workDueDate || '없음'}`}
				</Text>
			</View>
		</Block>
	);
}

const styles = BS;
