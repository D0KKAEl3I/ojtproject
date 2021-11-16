import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, BackHandler, Platform, TextInput } from 'react-native';
import IconButton from './IconButton';
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
					onChangeText={e => setSearchInput(e)}
					onEndEditing={() => onSubmit(searchInput)}
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
		borderRadius: GS.border_radius,
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
		borderBottomColor: GS.border_color,
		borderBottomWidth: 2,
	},
	labelText: {
		flex: 1,
		fontSize: 18,
		fontFamily: GS.font_family,
		color: GS.text_color,
		fontWeight: GS.font_weight.bold,
	},
	input: {
		paddingLeft: Platform.select({ ios: 4 }),
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: Platform.select({ ios: 4 })
	},
	inputText: {
		flex: 1,
		fontSize: 18,
		fontFamily: GS.font_family,
		fontWeight: GS.font_weight.regular,
	},
});
