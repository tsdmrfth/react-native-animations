import { Video } from 'expo-av';
import React from 'react';
import { Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const { height } = Dimensions.get('window')

const {
    View: AnimatedView,
    event,
    Value,
    cond,
    eq,
    set,
    Clock,
    add,
    lessThan,
    clockRunning,
    spring,
    stopClock,
    startClock,
    debug,
    lessOrEq,
    greaterOrEq,
    and,
    createAnimatedComponent
} = Animated
const { END } = State
const AnimatedVideo = createAnimatedComponent(Video)

function runSpring(clock, value, dest, velocity) {
    const state = {
        finished: new Value(0),
        velocity: new Value(0),
        position: new Value(0),
        time: new Value(0),
        velocity
    }

    const config = {
        damping: 20,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restSpeedThreshold: 1,
        restDisplacementThreshold: 0.5,
        toValue: new Value(0),
    }

    return [
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.velocity, velocity),
            set(state.position, value),
            set(config.toValue, dest),
            startClock(clock),
        ]),
        spring(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position,
    ]
}

export default class VideoPlayer extends React.Component {

    constructor(props) {
        super(props)
        const translateY = new Value(0)
        const offsetY = new Value(0)
        const gestureState = new Value()
        const velocityY = new Value(0)
        const clock = new Clock()
        const oneThirdOfScreenHeight = height / 3
        const addY = add(offsetY, translateY)
        const finalPoint = cond(lessThan(addY, oneThirdOfScreenHeight), 0, height - 100)

        this.onGestureEvent = event(
            [
                {
                    nativeEvent: {
                        translationY: translateY,
                        state: gestureState,
                        velocityY
                    },
                }
            ], { useNativeDriver: true }
        )

        this.translationY = cond(
            eq(gestureState, END),
            [
                cond(greaterOrEq(addY, 0), [
                    set(translateY, runSpring(clock, addY, finalPoint, velocityY)),
                    set(offsetY, translateY),
                    translateY
                ])
            ],
            [
                cond(clockRunning(clock), [
                    stopClock(clock)
                ]),
                cond(greaterOrEq(addY, 0), addY, 0)
            ]
        )
    }

    render() {
        const { onGestureEvent } = this
        const { video } = this.props
        const { containerStyle } = styles
        const containerAnimatedStyle = {
            transform: [
                {
                    translateY: this.translationY
                }
            ],
        }

        return (
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onGestureEvent}>

                <AnimatedView style={[containerStyle, containerAnimatedStyle]}>

                    <Video
                        useNativeControls
                        source={video.video}
                        resizeMode={Video.RESIZE_MODE_COVER}
                        style={{ width: '100%', height: 200 }} />

                </AnimatedView>

            </PanGestureHandler>
        )
    }

}

const styles = {
    containerStyle: {
        backgroundColor: 'gray',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute'
    },
}