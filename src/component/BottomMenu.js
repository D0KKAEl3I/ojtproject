import 'react-native-gesture-handler';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import GS from '../GlobalStyles';
import Button from './Button';
import GlobalContext from '../GlobalContext';

export default function BottomMenu({ data }) {
	const [onDoAnything, setOnDoAnything] = useState(false)
	const screenName = useRef(null)
	const context = useContext(GlobalContext)

	useEffect(() => {
		screenName.current = context.status
	}, [data])

	return (
		<View style={styles.container}>
			<View style={styles.wrapper}>
				{data.map((item, i) => (
					<Button
						key={i}
						style={[styles.button, item.disable && styles.disable]}
						onPress={() => {
							if (screenName.current !== context.status) return
							setOnDoAnything(true)
							if (!onDoAnything)
								item.onPress()
							setTimeout(() => {
								setOnDoAnything(false)
							}, 1500)
						}}
					>
						<Text style={[styles.buttonText, item.disable && styles.disabledText]}>{item.value}</Text>
					</Button>
				))}
			</View>
		</View >
	);
}

const styles = StyleSheet.create({
	container: {
		height: 60,
		backgroundColor: GS.background_color,
		alignItems: 'center'
	},
	wrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		maxWidth: GS.max_width,
		width: '100%',
		paddingVertical: GS.padding,
		paddingHorizontal: GS.padding / 2,
		backgroundColor: '#ffffff',
		borderTopLeftRadius: GS.border_radius,
		borderTopRightRadius: GS.border_radius,
		elevation: GS.elevation,
		...GS.shadow,
	},
	disable: {
		backgroundColor: GS.disabled_color,
	},
	button: {
		flex: 1,
		// height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		maxWidth: 150,
		marginHorizontal: GS.padding / 2,
		backgroundColor: '#4099ff',
		borderRadius: GS.border_radius,
		elevation: 1,
		...GS.shadow,
		shadowRadius: 2,
	},
	buttonText: {
		color: '#ffffff',
		textAlign: 'center',
		fontSize: 16,
		fontFamily: GS.font_family,
		fontWeight: GS.font_weight.bold,
	},
	disabledText: {
		color: GS.text_disabled_color,
	},
});
