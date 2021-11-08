import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import GS from '../GlobalStyles';

export default function BottomTabMenu({ data }) {
	return (
		<View style={styles.container}>
			{data.map((item, i) => (
				<Tab
					key={i}
					disable={item.disable}
					onPress={item.onPress}
					value={item.value}
					fontStyle={item.fontStyle}
				/>
			))}
		</View>
	);
}

function Tab({ onPress, value, fontStyle, disable, ...props }) {
	return (
		<Pressable
			key={props.key}
			style={[styles.button, disable && styles.disable]}
			onPress={() => !disable && onPress()}>
			<Text
				style={[styles.buttonText, disable && styles.disabledText, fontStyle]}>
				{value}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 60,
		backgroundColor: '#ffffff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: GS.padding,
		paddingHorizontal: GS.padding + 4,
		elevation: 8,
		...GS.shadow
	},
	disable: {
		backgroundColor: GS.disabled_color,
	},
	button: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		maxWidth: 150,
		// height: '100%',
		backgroundColor: '#4099ff',
		borderRadius: GS.borderRadius,
		marginHorizontal: GS.padding / 2,
		elevation: 1,
		...GS.shadow,
		shadowRadius: 2,
	},
	buttonText: {
		color: '#ffffff',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: '900',
	},
	disabledText: {
		color: GS.text_disabled_color,
	},
});
