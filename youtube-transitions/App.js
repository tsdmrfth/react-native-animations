import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import VideoPlayerProvider from './src/components/VideoPlayerProvider';
import videos from './src/components/videos';

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
			<VideoPlayerProvider>
			</VideoPlayerProvider>
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
