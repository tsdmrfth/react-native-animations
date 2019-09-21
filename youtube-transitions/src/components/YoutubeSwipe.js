import React from 'react';
import { Dimensions, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing } from "react-native-reanimated";

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
    Clock,
    timing,
    startClock,
    stopClock,
    clockRunning,
    block,
    debug,
    onChange,
    neq,
    defined,
    abs
} = Animated

const { ACTIVE, END, UNDETERMINED } = State

const VIDEO_CONTAINER_HEIGHT = 200
const TRANSLATION_MIN_VALUE = height - 100

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),
    }

    const config = {
        duration: 400,
        toValue: dest,
        easing: Easing.elastic(1),
    }

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock),
        ]),
        timing(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position,
    ])
}

export default class YoutubeSwipe extends React.Component {

    constructor(props) {
        super(props)

        const dragY = new Value(0)
        const prevDragY = new Value(0)
        const translationY = new Value(0)
        const gestureState = new Value(-1)

        this.onGestureEvent = event([{
            nativeEvent: {
                translationY: dragY,
                state: gestureState,
            },
        }])

        const _translationY = new Value()
        const oneThirdOfScreenHeight = height / 3
        const finalPoint = cond(
            lessThan(dragY, 0),
            cond(lessOrEq(abs(dragY), oneThirdOfScreenHeight), TRANSLATION_MIN_VALUE, 0),
            cond(lessOrEq(dragY, oneThirdOfScreenHeight), 0, TRANSLATION_MIN_VALUE)
        )
        const clock = new Clock()

        this.translationY = cond(
            eq(gestureState, ACTIVE),
            [
                stopClock(clock),
                set(_translationY, add(_translationY, sub(dragY, prevDragY))),
                set(prevDragY, dragY),
                _translationY
            ],
            [
                set(prevDragY, 0),
                set(
                    _translationY,
                    cond(defined(_translationY), [
                        runTiming(clock, _translationY, 0)
                    ], 0)
                )
            ]
        )
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