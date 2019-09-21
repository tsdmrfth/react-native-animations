import React from 'react';
import VideoPlayerContext from './VideoPlayerContext';

export default class VideoPlayerProvider extends React.PureComponent {

    state = {
        video: null
    }

    setVideo = video => this.setState({ video })

    render() {
        const { setVideo } = this
        const { children } = this.props
        const { video } = this.state

        return (
            <VideoPlayerContext.Provider value={{ video, setVideo }}>
                {children}
            </VideoPlayerContext.Provider>
        )
    }

}