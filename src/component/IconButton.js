import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

export default function IconButton({
	onPress,
	children,
	style = {},
	...props
}) {
	return (
		<Pressable
			style={[styles.container, style]}
			onPress={onPress}>
			{children}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});
