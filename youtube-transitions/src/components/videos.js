import moment, { Moment } from 'moment';
import type { ImageSourcePropType } from 'react-native/Libraries/Image/ImageSourcePropType';

export type Video = {
    id: string,
    thumbnail: ImageSourcePropType,
    video: ImageSourcePropType,
    title: string,
    username: string,
    avatar: ImageSourcePropType,
    views: number,
    published: Moment,
};

const videos: Video[] = [
    {
        id: '3',
        thumbnail: require('../../assets/thumbnails/4.png'),
        video: require('../../assets/videos/4.mp4'),
        title: 'Cost Function',
        username: 'Andrew Ng',
        avatar: require('../../assets/avatars/1.png'),
        views: 189,
        published: moment().subtract(5, 'days'),
        likes: 90,
        dislikes: 10,
        subscribers: 8982199
    },
    {
        id: '1',
        thumbnail: require('../../assets/thumbnails/1.png'),
        video: require('../../assets/videos/1.mp4'),
        title: 'Computing on data',
        username: 'Andrew Ng',
        avatar: require('../../assets/avatars/1.png'),
        views: 63,
        published: moment().subtract(10, 'days'),
        likes: 1290,
        dislikes: 19,
        subscribers: 8982199
    },
    {
        id: '2',
        thumbnail: require('../../assets/thumbnails/2.png'),
        video: require('../../assets/videos/2.mp4'),
        title: 'Classification',
        username: 'Andrew Ng',
        avatar: require('../../assets/avatars/1.png'),
        views: 216,
        published: moment().subtract(17, 'days'),
        likes: 901,
        dislikes: 20,
        subscribers: 8982199
    },
    {
        id: '4',
        thumbnail: require('../../assets/thumbnails/3.png'),
        video: require('../../assets/videos/3.mp4'),
        title: 'The problem of overfitting',
        username: 'Andrew Ng',
        avatar: require('../../assets/avatars/1.png'),
        views: 273,
        published: moment().subtract(31, 'days'),
        likes: 8781,
        dislikes: 98,
        subscribers: 8982199
    },
];

export default videos