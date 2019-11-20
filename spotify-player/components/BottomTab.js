import React from "react"
import { Dimensions, SafeAreaView, StyleSheet } from "react-native"
import { getBottomSpace } from "react-native-iphone-x-helper"
import TabIcon from "./TabIcon"
import Player from "./Player"
import MiniPlayer from "./MiniPlayer"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import Animated from 'react-native-reanimated'
import { clamp, onGestureEvent, timing, withSpring } from "react-native-redash"

const { height } = Dimensions.get("window")
const TAB_BAR_HEIGHT = getBottomSpace() + 50
const MINIMIZED_PLAYER_HEIGHT = 42
const SNAP_TOP = 0
const SNAP_BOTTOM = height - TAB_BAR_HEIGHT - MINIMIZED_PLAYER_HEIGHT
const {
    Value,
    interpolate,
    Extrapolate,
    useCode,
    cond,
    clockRunning,
    Clock,
    block,
    set,
    not
} = Animated
const config = {
    damping: 20,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.01
}

export default () => {
    const translationY = new Value(0)
    const velocityY = new Value(0)
    const state = new Value(State.UNDETERMINED)
    const offset = new Value(SNAP_BOTTOM)
    const goUp = new Value(0)
    const goDown = new Value(0)
    const goDownClock = new Clock()
    const goUpClock = new Clock()
    const gestureHandler = onGestureEvent({
        translationY,
        velocityY,
        state
    })
    const translateY = clamp(withSpring({
        state,
        velocity: velocityY,
        value: translationY,
        snapPoints: [SNAP_BOTTOM, SNAP_TOP],
        config,
        offset
    }), SNAP_TOP, SNAP_BOTTOM)
    const miniPlayerOpacity = interpolate(translateY, {
        inputRange: [SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT, SNAP_BOTTOM],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP
    })
    const miniPlayerOverlayOpacity = interpolate(translateY, {
        inputRange: [SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT * 3, SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP
    })
    const bottomTabBarTranslateY = interpolate(translateY, {
        inputRange: [SNAP_TOP, SNAP_BOTTOM],
        outputRange: [TAB_BAR_HEIGHT, 0],
        extrapolate: Extrapolate.CLAMP
    })
    const playerBorderRadius = interpolate(translateY, {
        inputRange: [SNAP_TOP, SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT],
        outputRange: [0, 5]
    })

    useCode(
        block([
            cond(
                goDown,
                set(
                    offset,
                    timing({
                        duration: 400,
                        from: SNAP_TOP,
                        to: SNAP_BOTTOM,
                        clock: goDownClock
                    })
                ),
                cond(
                    not(clockRunning(goDownClock)),
                    set(goDown, 0)
                )
            )
        ]),
        []
    )

    useCode(
        block([
            cond(
                goUp,
                set(
                    offset,
                    timing({
                        duration: 400,
                        from: SNAP_BOTTOM,
                        to: SNAP_TOP,
                        clock: goUpClock
                    })
                ),
                cond(
                    not(clockRunning(goUpClock)),
                    set(goUp, 0)
                )
            )
        ])
    )

    return (
        <>
            <PanGestureHandler {...gestureHandler}>

                <Animated.View style={[styles.playerSheet, { transform: [{ translateY }] }]}>
                    <Player
                        style={{
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5
                        }}
                        onPress={() => goDown.setValue(1)}/>
                    <Animated.View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: "#272829",
                            opacity: miniPlayerOverlayOpacity
                        }}
                        pointerEvents={'none'}
                    />
                    <Animated.View
                        style={{
                            opacity: miniPlayerOpacity,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: MINIMIZED_PLAYER_HEIGHT
                        }}>
                        <MiniPlayer onPress={() => goUp.setValue(1)}/>
                    </Animated.View>
                </Animated.View>

            </PanGestureHandler>

            <Animated.View style={{ transform: [{ translateY: bottomTabBarTranslateY }] }}>
                <SafeAreaView style={styles.container}>
                    <TabIcon name="home" label="Home"/>
                    <TabIcon name="search" label="Search"/>
                    <TabIcon
                        name="chevron-up"
                        label="Player"/>
                </SafeAreaView>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    playerSheet: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "cyan"
    },
    container: {
        backgroundColor: "#272829",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT,
        flexDirection: "row",
        borderTopColor: "black",
        borderWidth: 1
    }
})