import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, BackHandler } from 'react-native';
import IconButton from './IconButton';
import { TextInput } from 'react-native-gesture-handler';
import GlobalContext from '../GlobalContext';
import GS from '../GlobalStyles';

export default function SearchInput({ onSubmit, onClose, defaultValue, label, ...props }) {
	const context = useContext(GlobalContext);
	const [searchInput, setSearchInput] = useState(''); // 검색블록 속 검색내용

	useEffect(() => {
		context.setContext({ status: 'Search' });
	}, []);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', () => {
			onClose();
			return true
		})
	}, [context.status])


	return (
		<View style={styles.container}>
			<View style={styles.label}>
				<Text style={styles.labelText}>{label}</Text>
				<IconButton size={32} onPress={onClose}>
					<Image
						style={{ width: 28, height: 28 }}
						source={require('../../public/close_black.png')}
					/>
				</IconButton>
			</View>
			<View style={styles.input}>
				<TextInput
					defaultValue={defaultValue}
					style={styles.inputText}
					placeholder="원하는 키워드를 입력해주세요"
				/>
				<IconButton onPress={() => onSubmit(searchInput)}>
					<Image
						style={{ width: 36, height: 36 }}
						source={require('../../public/search_black.png')}
					/>
				</IconButton>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		maxWidth: 512,
		borderRadius: GS.borderRadius,
		marginHorizontal: GS.margin * 4,
		backgroundColor: '#ffffff',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: GS.padding
	},
	label: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 4,
		borderBottomColor: GS.borderColor,
		borderBottomWidth: 2,
		paddingHorizontal: GS.padding,
	},
	labelText: {
		flex: 1,
		fontSize: 18,
		fontFamily: GS.font_family,
		color: GS.text_color,
		fontWeight: GS.font_weight.bold,
	},
	input: {
		paddingHorizontal: GS.padding,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputText: {
		flex: 1,
		fontSize: 18,
		fontFamily: GS.font_family,
		fontWeight: GS.font_weight.regular,
		paddingVertical: GS.padding
	},
});
