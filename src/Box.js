import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { PanGestureHandler, State } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"

const { width, height } = Dimensions.get("window")
const { cond, eq, add, call, set, Value, event, interpolate, Extrapolate, block } = Animated

export default class Box extends React.Component {

    constructor(props) {
        super(props);
        this.dragX = new Value(0);
        this.dragY = new Value(0);
        this.offsetX = new Value(width / 2)
        this.offsetY = new Value(100)
        this.gestureState = new Value(-1)
        this.onGestureEvent = event([{
            nativeEvent: {
                translationX: this.dragX,
                translationY: this.dragY,
                state: this.gestureState,
            },
        }])
        const addY = add(this.offsetY, this.dragY)
        const addX = add(this.offsetX, this.dragX)
        this.transX = cond(eq(this.gestureState, State.ACTIVE), addX, set(this.offsetX, addX))
        this.transY = cond(eq(this.gestureState, State.ACTIVE), addY, [
            cond(eq(this.gestureState, State.END), call([addX, addY], this.onDrop)),
            set(this.offsetY, addY),
        ])
    }

    render() {
        const boxAnimatedStyle = {
            transform: [
                {
                    translateX: this.transX,
                },
                {
                    translateY: this.transY,
                },
            ],
        }
        return (
            <View style={styles.container}>

                <View
                    style={styles.dropZone}
                    onLayout={this.saveDropZone} />

                <PanGestureHandler
                    maxPointers={1}
                    onGestureEvent={this.onGestureEvent}
                    onHandlerStateChange={this.onGestureEvent}>
                    <Animated.View style={[styles.box, boxAnimatedStyle]} />
                </PanGestureHandler>

            </View>
        )
    }

    saveDropZone = e => {
        const { width, height, x, y } = e.nativeEvent.layout;
        this.top = y;
        this.bottom = y + height;
        this.left = x;
        this.right = x + width;
    }

    onDrop = ([x, y]) => {
        const isInsideDropzone = x >= this.left && x <= this.right && (y >= this.top && y <= this.bottom)
        isInsideDropzone && alert('In drop zone')
    }
}

const BOX_SIZE = 70

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    dropZone: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,.2)",
        height: "50%",
    },
    box: {
        backgroundColor: "tomato",
        position: "absolute",
        marginLeft: -(BOX_SIZE / 2),
        marginTop: -(BOX_SIZE / 2),
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderColor: "#000",
    },
})