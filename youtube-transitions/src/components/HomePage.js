import React from 'react'
import { ScrollView } from 'react-native'
import videos from './videos'
import VideoThumnail from './VideoThumnail'

export const HomePage = () => {

    return (
        <ScrollView>
            {renderVideoThumnnails()}
        </ScrollView>
    )

    function renderVideoThumnnails() {
        return videos.map(video => {
            return <VideoThumnail video={video} key={video.id} />
        })
    }

}