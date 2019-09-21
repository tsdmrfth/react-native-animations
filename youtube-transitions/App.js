import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import videos from './src/components/videos';
import YoutubeSwipe from './src/YoutubeSwipe';

console.disableYellowBox = true

const App = () => {

	const [isAppReady, setIsAppReady] = useState(false)

	const loadVideos = async () => {
		await Promise.all(
			videos.map(video => Promise.all([
				Asset.loadAsync(video.video),
				Asset.loadAsync(video.avatar),
				Asset.loadAsync(video.thumbnail),
			])),
		)
	}

	useEffect(() => {
		loadVideos()
		setIsAppReady(true)
	}, [])

	if (isAppReady) {
		return (
			<View style={styles.containerStyle}>
				<YoutubeSwipe />
			</View>
		)
	}

	return <AppLoading />

}

const styles = StyleSheet.create({
	containerStyle: {
		flex: 1
	},
})

export default App
