import React from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import VideoPlayerContext from './VideoPlayerContext';

export default class VideoThumnail extends React.Component {

    render() {
        const {
            containerStyle
        } = styles

        return (
            <VideoPlayerContext.Consumer>
                {this.renderInside}
            </VideoPlayerContext.Consumer>
        )
    }

    renderInside = ({ setVideo }) => {
        const { video } = this.props
        const { thumbnail, avatar, title, views, username, published } = video

        return (
            <TouchableWithoutFeedback onPress={() => setVideo(video)}>
                <View style={styles.container}>
                    <Image source={thumbnail} style={styles.thumbnail} />
                    <View style={styles.description}>
                        <Image source={avatar} style={styles.avatar} />
                        <View>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.subtitle}>
                                {`${username} • ${views} views • ${published.fromNow()}`}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: 'cadetblue'
    },
    thumbnail: {
        width: '100%',
        height: 200,
    },
    description: {
        flexDirection: 'row',
        margin: 16,
        marginBottom: 32,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
    },
    title: {
        fontSize: 16,
    },
    subtitle: {
        color: 'gray',
    },
})
