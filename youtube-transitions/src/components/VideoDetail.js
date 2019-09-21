import React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const {
    View: AnimatedView,
    event,
    Value
} = Animated

export default class VideoDetail extends React.Component {

    constructor(props) {
        super(props)
        this.translateY = new Value(0)
        this.onGestureEvent = event(
            [
                {
                    nativeEvent: {
                        translationY: this.translateY,
                    },
                }
            ], { useNativeDriver: true })
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
                            { translateY: this.translateY }
                        ]
                    }}>
                </AnimatedView>
            </PanGestureHandler>
        )
    }

}