import React from 'react';
import { StyleSheet, View } from 'react-native';
import YoutubeSwipe from './src/YoutubeSwipe';

console.disableYellowBox = true

const App = () => {
	return (
		<View style={styles.containerStyle}>
			<YoutubeSwipe />
		</View>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		flex: 1
	},
})

export default App
