import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import videos from './videos';
import VideoThumnail from './VideoThumnail';

const { height } = Dimensions.get('window')

export default class VideoContent extends React.Component {

    render() {
        const {
            containerStyle,
            videoTitleTextStyle,
            grayTextStyle,
            rowContainerStyle,
            likeButtonContainerStyle,
            likeIconStyle,
            likeIconContainerStyle,
            seperatorLineStyle,
            avatarStyle,
            usernameTextStyle,
            userInfoContainerStyle
        } = styles
        const {
            video: {
                views,
                title,
                username,
                likes,
                dislikes,
                avatar,
                subscribers
            }
        } = this.props

        return (
            <View style={containerStyle}>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={videoTitleTextStyle}>
                        {title}
                    </Text>

                    <Text style={grayTextStyle}>
                        {views}
                    </Text>

                    <View style={[likeButtonContainerStyle, rowContainerStyle]}>
                        <View style={[rowContainerStyle, likeIconContainerStyle]}>
                            <MaterialIcons
                                size={24}
                                name={'thumb-up'}
                                color={'lightgray'}
                                style={likeIconStyle} />
                            <Text style={grayTextStyle}>
                                {likes}
                            </Text>
                        </View>
                        <View style={[rowContainerStyle, likeIconContainerStyle]}>
                            <MaterialIcons
                                size={24}
                                color={'lightgray'}
                                name={'thumb-down'}
                                style={likeIconStyle} />
                            <Text style={grayTextStyle}>
                                {dislikes}
                            </Text>
                        </View>
                    </View>

                    <View style={seperatorLineStyle} />

                    <View style={rowContainerStyle}>

                        <Image source={avatar} style={avatarStyle} />

                        <View style={userInfoContainerStyle}>
                            <Text style={usernameTextStyle}>
                                {username}
                            </Text>

                            <Text style={grayTextStyle}>
                                {subscribers}
                            </Text>
                        </View>

                    </View>

                    <View style={seperatorLineStyle} />
                    {this.renderVideos()}
                </ScrollView>

            </View>
        )
    }

    renderVideos = () => (videos.map(video => <VideoThumnail video={video} />))

}

const styles = {
    containerStyle: {
        width: '100%',
        height,
        backgroundColor: 'white',
        padding: 10
    },
    videoTitleTextStyle: {
        fontSize: 15,
        marginBottom: 3
    },
    grayTextStyle: {
        fontSize: 13,
        color: 'lightgray',
    },
    rowContainerStyle: {
        flexDirection: 'row'
    },
    likeButtonContainerStyle: {
        marginTop: 15,
        alignItems: 'center'
    },
    likeIconStyle: {
        marginRight: 5,
    },
    likeIconContainerStyle: {
        alignItems: 'center',
        marginRight: 5
    },
    seperatorLineStyle: {
        width: '100%',
        height: 1,
        marginTop: 15,
        backgroundColor: 'lightgray'
    },
    avatarStyle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginTop: 15
    },
    usernameTextStyle: {
        fontSize: 14,
    },
    userInfoContainerStyle: {
        marginTop: 15,
        marginLeft: 5
    }
}