import 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Text, Button, Dimensions, Keyboard, Pressable, BackHandler } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';
import { TextInput } from 'react-native-gesture-handler';
let filterMenuHeight = 408 // 메뉴 전체 높이 360 + 확인버튼 높이 48
const animDuration = 200 // 애니메이션 지속 시간
let windowSize = Dimensions.get("window");

export default function FilterMenu(props) {
	const context = useContext(GlobalContext);
	const [onCalendar, setOnCalendar] = useState(false)
	const [calendar, setCalendar] = useState(""); // 작업예정일과 작업완료일중 어느것의 날짜를 선택중인가? "workDuteDate" 또는 "workCompleteDate"
	const [onLandScape, setOnLandScape] = useState(false); // 화면이 눕혀져있는가?


	useEffect(() => {
		windowSize.width > windowSize.height && setOnLandScape(true)
		Dimensions.addEventListener('change', ({ window: { width, height } }) => {
			windowSize = Dimensions.get('window');
			setOnLandScape(width > height);
		})
	}, [])

	useEffect(() => {
		filterMenuHeight = onLandScape ? 204 : 408
	}, [onLandScape])

	const [filter, setFilter] = useState(context.filter)
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(-filterMenuHeight)).current;


	const fadeIn = useCallback(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: animDuration,
			useNativeDriver: true,
		}).start();
	});
	const fadeOut = useCallback(() => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: animDuration,
			useNativeDriver: true,
		}).start();
	});
	const slideIn = useCallback(() => {
		Animated.timing(slideAnim, {
			toValue: 0,
			duration: animDuration,
			useNativeDriver: true,
		}).start();
	});
	const slideOut = useCallback(() => {
		Animated.timing(slideAnim, {
			toValue: -filterMenuHeight,
			duration: animDuration,
			useNativeDriver: true,
		}).start();
	});
	const openFilterMenu = useCallback(() => {
		slideIn();
		fadeIn();
	})
	const closeFilterMenu = useCallback(() => {
		slideOut();
		fadeOut();
		context.setStatus('WorkHome');
		setTimeout(() => {
			props.setOnFilter(false);
		}, animDuration);
	})
	useEffect(() => {
		context.setStatus('Filter');
		openFilterMenu();
	}, []);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', () => {
			closeFilterMenu();
			return true
		})
	}, [context.status])

	return (
		<View style={styles.container} >
			<Animated.View
				style={[styles.backgroundFilter, { opacity: fadeAnim }]}
				onTouchEnd={closeFilterMenu}
			/>
			<Animated.View
				onTouchEnd={e => e.target === e.currentTarget && Keyboard.dismiss()}
				style={[styles.menu, { transform: [{ translateY: slideAnim }] }]}>
				{/* 메뉴 제목 및 초기화 버튼 */}
				<View style={styles.title}>
					<Text style={{ fontSize: 22, fontWeight: '900', color: GS.text_color }}>작업 검색 필터</Text>
					<Button title="초기화"
						onPress={() => {
							context.setFilter({
								workState: null,
								workDueDate: null,
								workCompleteDate: null
							});
							setFilter({
								workState: null,
								workDueDate: null,
								workCompleteDate: null
							})
						}} />
				</View>
				<View style={{ flexDirection: onLandScape ? 'row' : 'column', justifyContent: 'space-around' }}>
					<Input
						title="작업 상태"
						defaultValue={filter.workState}
						onChangeText={e => setFilter(filter => ({ ...filter, workState: e }))}
						placeholder="미배정/작업완료/"
					/>
					<DateInput
						title="작업 시작일"
						date={filter.workDueDate}
						onDateChange={e => setFilter(filter => ({ ...filter, workDueDate: e }))}
						onPressButton={() => {
							setCalendar("workDueDate");
							setOnCalendar(true);
						}}
					/>
					<DateInput
						title="작업 완료일"
						date={filter.workCompleteDate}
						onDateChange={e => setFilter(filter => ({ ...filter, workCompleteDate: e }))}
						onPressButton={() => {
							setCalendar("workCompleteDate");
							setOnCalendar(true);
						}}
					/>
				</View>
				<Pressable style={styles.submitButton} onPress={() => {
					context.setFilter(filter);
					closeFilterMenu();
				}}>
					<Text style={styles.submitButtonText}>확인</Text>
				</Pressable>
			</Animated.View>
			{onCalendar &&
				<View style={styles.calendarBackground}>
					<Calendar
						onSubmit={date => {
							setFilter(filter => ({ ...filter, [calendar]: date }));
							setOnCalendar(false)
						}}
						onCancle={() => setOnCalendar(false)} />
				</View>
			}
		</View>
	);
}

function Input({ title, placeholder = "", defaultValue, onChangeText }) {
	return (
		<View style={styles.option} >
			<Text style={styles.label}>{title}</Text>
			<TextInput style={styles.input}
				defaultValue={defaultValue}
				placeholder={placeholder || title}
				placeholderTextColor={GS.borderColor}
				onChangeText={onChangeText} />
		</View>
	);
}
function DateInput({ title, date, onPressButton }) {
	return (
		<View style={styles.option} >
			<Text style={styles.label}>{title}</Text>
			<View style={styles.dateContainer}>
				<Text style={[styles.date, { color: date ? GS.text_color : GS.borderColor }]}>{date || "날짜를 선택해주세요"}</Text>
				<Button title="선택" onPress={onPressButton} />
			</View>
		</View>
	);
}
function Calendar({ date, onSubmit, onCancle }) {
	const [selectedDate, setSelectedDate] = useState(date);
	return (
		<View style={styles.calendar}>
			<CalendarPicker
				months={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => month + "월")}
				weekdays={['일', '월', '화', '수', '목', '금', '토']}
				width={windowSize.width - 16}
				onDateChange={e => {
					let year = e.get('year')
					let month = e.get('month') + 1 //n월, 1월일 경우 0을 반환하기 때문에 +1
					let date = e.get('date') / 10 < 1 ? '0' + e.get('date') : e.get('date') // n일, n이 한자릿수일경우 0 추가
					setSelectedDate(`${year}-${month}-${date}`);
				}} />
			<View style={{ flexDirection: 'row' }}>
				<Button title="선택" onPress={() => onSubmit(selectedDate)} />
				<Button title="취소" onPress={onCancle} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 47,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 9,
		overflow: 'hidden',
		padding: GS.padding,
	},
	menu: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: '#ffffff',
		transform: [{ translateY: -filterMenuHeight }],
		zIndex: 2,
	},
	title: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	option: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		padding: GS.padding
	},
	label: {
		marginHorizontal: 8,
		paddingBottom: 4,
		fontSize: 20,
		color: GS.text_color,
		borderBottomColor: '#a0a0a0',
		borderBottomWidth: 2,
	},
	input: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: GS.padding,
		marginVertical: 4,
		marginHorizontal: 8,
		fontSize: 18,
		borderWidth: 2,
		borderColor: '#000a',
		borderRadius: GS.borderRadius
	},
	dateContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 8
	},
	date: {
		fontSize: 18
	},
	submitButton: {
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#4099ff',
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -48
	},
	submitButtonText: {
		color: '#ffffff',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: '900',
	},
	calendar: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderWidth: 2,
		borderColor: '#a0a0a0',
		borderRadius: GS.borderRadius,
	},
	calendarBackground: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000a',
		zIndex: 99
	},
	backgroundFilter: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#000a',
	}
});