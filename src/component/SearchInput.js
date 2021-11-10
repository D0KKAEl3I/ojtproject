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
		context.setStatus('Search');
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
						style={{ width: 40, height: 40 }}
						source={require('../../public/search_black.png')}
					/>
				</IconButton>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: GS.borderRadius,
		marginHorizontal: 32,
		backgroundColor: '#ffffff',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	label: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 4,
		marginHorizontal: 8,
		borderBottomColor: '#a0a0a0',
		borderBottomWidth: 2,
	},
	labelText: {
		flex: 1,
		fontSize: 18,
		color: GS.text_color,
		fontWeight: GS.font_weight.bold,
	},
	input: {
		marginHorizontal: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputText: {
		flex: 1,
		fontSize: 20,
	},
});
