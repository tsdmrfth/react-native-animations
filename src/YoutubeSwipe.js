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
    interpolate,
    Extrapolate,
    block,
    and,
    greaterOrEq,
    lessOrEq,
    onChange,
    greaterThan,
    lessThan,
    diffClamp,
    View: AnimatedView,
    Code: AnimatedCode,
    Clock
} = Animated

const { ACTIVE, END } = State

const VIDEO_CONTAINER_HEIGHT = 200
const TRANSLATION_MIN_VALUE = height - 100

function spring(dt, position, velocity, anchor, mass = 1, tension = 300) {
    const dist = sub(position, anchor);
    const acc = divide(multiply(-1, tension, dist), mass);
    return set(velocity, add(velocity, multiply(dt, acc)));
}

function damping(dt, velocity, mass = 1, damping = 12) {
    const acc = divide(multiply(-1, damping, velocity), mass);
    return set(velocity, add(velocity, multiply(dt, acc)));
}

function interaction(gestureTranslation, gestureState) {
    const dragging = new Value(0);
    const start = new Value(0);
    const position = new Value(0);
    const velocity = new Value(0);

    const clock = new Clock();
    const dt = divide(diff(clock), 1000);

    return cond(
        eq(gestureState, State.ACTIVE),
        [
            cond(dragging, 0, [set(dragging, 1), set(start, position)]),
            stopClock(clock),
            dt,
            set(position, add(start, gestureTranslation)),
        ],
        [
            set(dragging, 0),
            startClock(clock),
            spring(dt, position, velocity, 0),
            damping(dt, velocity),
            set(position, add(position, multiply(velocity, dt))),
        ]
    );
}

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
        const addY = add(this.offsetY, this.dragY)
        const oneThirdOfScreenHeight = height / 3
        let translationY = cond(eq(this.gestureState, ACTIVE), addY, cond(eq(this.gestureState, END), [
            cond(lessThan(addY, oneThirdOfScreenHeight), set(this.offsetY, 0), set(this.offsetY, TRANSLATION_MIN_VALUE))
        ]))
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