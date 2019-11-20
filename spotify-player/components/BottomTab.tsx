import React, {useState} from "react";
import {Dimensions, SafeAreaView, StyleSheet, View} from "react-native";
import {getBottomSpace} from "react-native-iphone-x-helper";

import TabIcon from "./TabIcon";
import Player from "./Player";
import MiniPlayer from "./MiniPlayer";

const {height} = Dimensions.get("window");
const TABBAR_HEIGHT = getBottomSpace() + 50;
const MINIMIZED_PLAYER_HEIGHT = 42;
const SNAP_TOP = 0;
const SNAP_BOTTOM = height - TABBAR_HEIGHT - MINIMIZED_PLAYER_HEIGHT;
const config = {
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 0.1,
    restDisplacementThreshold: 0.1
};

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
        height: TABBAR_HEIGHT,
        flexDirection: "row",
        borderTopColor: "black",
        borderWidth: 1
    }
});

export default () => {
    const [up, setUp] = useState(false);
    const translateY = up ? SNAP_TOP : SNAP_BOTTOM;
    const translateBottomTab = up ? TABBAR_HEIGHT : 0;
    return (
        <>
            <View style={[styles.playerSheet, {transform: [{translateY}]}]}>
                <Player onPress={() => setUp(false)}/>
                <View
                    style={{
                        opacity: up ? 0 : 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: MINIMIZED_PLAYER_HEIGHT
                    }}
                >
                    <MiniPlayer/>
                </View>
            </View>
            <View style={{transform: [{translateY: translateBottomTab}]}}>
                <SafeAreaView style={styles.container}>
                    <TabIcon name="home" label="Home"/>
                    <TabIcon name="search" label="Search"/>
                    <TabIcon
                        name="chevron-up"
                        label="Player"
                        onPress={() => setUp(true)}
                    />
                </SafeAreaView>
            </View>
        </>
    );
};
