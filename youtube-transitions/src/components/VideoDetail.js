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
    debug
} = Animated
const { END } = State

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

export default class VideoDetail extends React.Component {

    constructor(props) {
        super(props)
        const translateY = new Value(0)
        const offsetY = new Value(0)
        const gestureState = new Value()
        const velocityY = new Value(0)
        const clock = new Clock()
        const oneThirdOfScreenHeight = height / 3
        const addY = add(translateY, offsetY)
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
                set(translateY, runSpring(clock, add(translateY, offsetY), finalPoint, velocityY)),
                set(offsetY, translateY),
                translateY
            ],
            [
                add(offsetY, translateY)
            ]
        )
    }

    render() {
        const { onGestureEvent } = this

        return (
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onGestureEvent}>
                <AnimatedView
                    style={{
                        backgroundColor: 'gray',
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        transform: [
                            { translateY: this.translationY }
                        ]
                    }}>
                </AnimatedView>
            </PanGestureHandler>
        )
    }

}