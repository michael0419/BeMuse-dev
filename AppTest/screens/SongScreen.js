import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { fetchPlaylistTrack, playlistTrackSelector } from '../api/redux/PlaylistTrackReducer';
import mainStyles from '../components/MainTheme';
import TrackBox from '../components/TrackTheme';

const SongScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { isLoading, data } = useSelector(playlistTrackSelector);
    const [songKey, setSongKey] = useState(null);
    const [count, setCount] = useState(0);
    let songArr = [];

    useEffect(() => {
        dispatch(fetchPlaylistTrack());
    }, []);

    data?.items?.map((song, i) => {
        if (song.track.preview_url) {
            songArr.push(i);
        }
    });

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <SafeAreaView style={mainStyles.container}>
            <Ionicons 
            name="arrow-back" 
            style={mainStyles.backButton}
            onPress={() => {
                navigation.popToTop()
            }} />
            <Text style={mainStyles.moodTitle}>{route.params.moodData}</Text>
            <View style={mainStyles.containerTrack}>
                {songKey === null ?
                <Text style={mainStyles.songText}>Songs Found!</Text> :
                data?.items?.map((song, i) => {
                    if (song.track.preview_url && i === songKey) {
                        return (
                            <TrackBox key={i}
                                name={song.track.name}
                                images={song.track.album.images[0].url}
                                preview={song.track.preview_url}
                            />
                        );
                    }
                }) }    
            </View>
            {songKey === null ? 
            <TouchableHighlight
            style={mainStyles.nextButton}
            activeOpacity={0.9}
            underlayColor={'#492A6E'}
            onPress={() => {
                if (count < songArr.length) {
                    setCount(count => count + 1);
                    setSongKey(songKey => songKey = songArr[count]);
                }
            }}>
                <Text style={mainStyles.buttonText}>Show</Text>
            </TouchableHighlight> :
            <TouchableHighlight
            style={mainStyles.nextButton}
            activeOpacity={0.9}
            underlayColor={'#492A6E'}
            onPress={() => {
                if (count < songArr.length) {
                    setCount(count => count + 1);
                    setSongKey(songKey => songKey = songArr[count]);
                }
                else {
                    setCount(count => count = 0);
                }
            }}>
                <Text style={mainStyles.buttonText}>Next</Text>
            </TouchableHighlight>   }
        </SafeAreaView>
    );
}

export default SongScreen;