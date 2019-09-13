import React from 'react';
import { Dimensions, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from "react-native-reanimated";

const { width, height } = Dimensions.get("window")
const {
    cond,
    eq,
    add,
    sub,
    call,
    set,
    Value,
    event,
    lessThan,
    interpolate,
    Extrapolate,
    greaterOrEq,
    lessOrEq,
    diffClamp,
    View: AnimatedView,
    Code: AnimatedCode,
} = Animated

const { ACTIVE, END, UNDETERMINED } = State

const VIDEO_CONTAINER_HEIGHT = 200
const TRANSLATION_MIN_VALUE = height - 100

export default class YoutubeSwipe extends React.Component {

    constructor(props) {
        super(props)
        this.dragY = new Value(0)
        this.offsetY = new Value(0)
        this.translationY = new Value(0)
        this.gestureState = new Value(-1)
        this.onGestureEvent = event([{
            nativeEvent: {
                translationY: this.dragY,
                state: this.gestureState,
            },
        }])

        this.translationY = this.getTranslationYValue()
        this.videoContainerHeight = this.getVideoContainerHeight()
    }

    render() {
        const {
            containerStyle,
            videoContainerStyle
        } = styles
        const videoContainerAnimatedStyle = {
            transform: [{
                translateY: this.translationY
            }],
            height: this.videoContainerHeight
        }

        return (
            <View style={containerStyle}>

                <PanGestureHandler
                    onGestureEvent={this.onGestureEvent}
                    onHandlerStateChange={this.onGestureEvent}>

                    <AnimatedView style={[videoContainerStyle, videoContainerAnimatedStyle]} />

                </PanGestureHandler>

            </View>
        )
    }

    getTranslationYValue = () => {
        let addY = add(this.offsetY, this.dragY)
        addY = cond(lessOrEq(addY, TRANSLATION_MIN_VALUE), addY, TRANSLATION_MIN_VALUE)
        addY = cond(greaterOrEq(addY, 0), addY, 0)
        const oneThirdOfScreenHeight = height / 3
        let translationY = cond(eq(this.gestureState, ACTIVE),
            addY,
            [
                cond(
                    lessThan(addY, oneThirdOfScreenHeight),
                    set(this.offsetY, 0),
                    set(this.offsetY, TRANSLATION_MIN_VALUE)
                ),
            ]
        )
        translationY = diffClamp(translationY, 0, TRANSLATION_MIN_VALUE)
        return translationY
    }

    getVideoContainerHeight = () => {
        const videoContainerHeight = interpolate(this.translationY, {
            inputRange: [0, TRANSLATION_MIN_VALUE],
            outputRange: [VIDEO_CONTAINER_HEIGHT, 100],
            extrapolate: Extrapolate.CLAMP
        })
        return videoContainerHeight
    }

}

const styles = {
    containerStyle: {
        width: '100%',
        height: '100%',
        backgroundColor: 'gainsboro'
    },
    videoContainerStyle: {
        width: '100%',
        height: VIDEO_CONTAINER_HEIGHT,
        backgroundColor: '#4a494a',
        position: 'absolute',
        top: 0
    }
}