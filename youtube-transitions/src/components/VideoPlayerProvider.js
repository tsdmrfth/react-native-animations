import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import VideoDetail from './VideoDetail';
import VideoPlayerContext from './VideoPlayerContext';

const {
    View: AnimatedView,
    Value,
    timing,
} = Animated
const { height } = Dimensions.get('window')

export default class VideoPlayerProvider extends React.PureComponent {

    state = {
        video: null,
        num: 0
    }

    constructor(props) {
        super(props)
        this.videoContainerTranslateY = new Value(0)
    }

    render() {
        const { setVideo } = this
        const { children } = this.props
        const { video } = this.state
        const videoContainerStyle = {
            transform: [
                {
                    translateY: this.videoContainerTranslateY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height, 0]
                    })
                }
            ],
        }

        return (
            <VideoPlayerContext.Provider value={{ video, setVideo }}>
                <View style={styles.container}>
                    <View style={StyleSheet.absoluteFill}>
                        {children}
                    </View>
                    <AnimatedView style={videoContainerStyle}>
                        {this.renderInside()}
                    </AnimatedView>
                </View>
            </VideoPlayerContext.Provider>
        )
    }

    setVideo = video => this.setState({ video, num: this.state.num === 0 ? 1 : 0 }, this.showVideoDetail)

    renderInside = () => {
        const { video } = this.state

        if (video) {
            return <VideoDetail />
        }
    }

    showVideoDetail = () => timing(this.videoContainerTranslateY, {
        toValue: this.state.num,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
    }).start()

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})