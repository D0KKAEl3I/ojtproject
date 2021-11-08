import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

export default function HeaderButton({
	size,
	onPress,
	children,
	style,
	...props
}) {
	return (
		<Pressable
			style={[styles.container, { width: size, height: size }, style ?? {}]}
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
