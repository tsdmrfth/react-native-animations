import { Video } from 'expo-av';
import React from 'react';
import { Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import VideoContent from './VideoContent';

const { height, width } = Dimensions.get('window')

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
    createAnimatedComponent,
    interpolate,
    Extrapolate,
    defined,
    diffClamp
} = Animated
const { END } = State
const AnimatedVideo = createAnimatedComponent(Video)
const AnimatedVideoContent = createAnimatedComponent(VideoContent)

const MINI_PLAYER_HEIGHT = 64
const MAX_TRANSLATION_Y_POSITION = height - 2 * MINI_PLAYER_HEIGHT

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
        const finalPoint = cond(lessThan(addY, oneThirdOfScreenHeight), 0, MAX_TRANSLATION_Y_POSITION)

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
        this.translationY = interpolate(this.translationY, {
            inputRange: [0, MAX_TRANSLATION_Y_POSITION],
            outputRange: [0, MAX_TRANSLATION_Y_POSITION],
            extrapolate: Extrapolate.CLAMP,
        })
        this.containerWidth = interpolate(this.translationY, {
            inputRange: [0, height],
            outputRange: [width, width - 40]
        })
        this.containerHeight = interpolate(this.translationY, {
            inputRange: [0, height],
            outputRange: [height, 100],
            extrapolate: Extrapolate.CLAMP,
        })
        this.containerShadowOpacity = interpolate(this.translationY, {
            inputRange: [0, height - MAX_TRANSLATION_Y_POSITION],
            outputRange: [0, 1]
        })
        this.videoContentOpacity = interpolate(this.translationY, {
            inputRange: [0, height - 200],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP,
        })
    }

    render() {
        const { onGestureEvent } = this
        const { video } = this.props
        const {
            containerStyle,
            videoContentContainerStyle
        } = styles
        const containerAnimatedStyle = {
            transform: [
                {
                    translateY: this.translationY
                }
            ],
            // top: this.translationY,
            width: this.containerWidth,
            shadowOpacity: this.containerShadowOpacity,
        }

        const videoContentAnimatedStyle = {
            // opacity: this.videoContentOpacity,
        }

        return (
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onGestureEvent}>

                <AnimatedView style={[containerStyle, containerAnimatedStyle]}>

                    <AnimatedView
                        // useNativeControls
                        // source={video.video}
                        // resizeMode={Video.RESIZE_MODE_COVER}
                        style={{
                            width: '100%',
                            height: 200,
                            backgroundColor: '#636e72'
                        }}/>

                    <AnimatedView
                        style={[{
                            backgroundColor: 'white',
                            width: '100%',
                            height: this.containerHeight,
                            borderWidth: 1,
                            marginBottom: interpolate(this.translationY, {
                                inputRange: [0, height],
                                outputRange: [0, 20]
                            }),
                        }, videoContentAnimatedStyle]}>
                        <VideoContent video={video}/>
                    </AnimatedView>

                </AnimatedView>

            </PanGestureHandler>
        )
    }

}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        height: '100%',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        shadowColor: 'darkgray',
        shadowOffset: {
            width: 0.6,
            height: 0.6
        },
        shadowRadius: 2,
    },
    videoContentContainerStyle: {
        backgroundColor: 'white',
        width: '100%'
    }
}