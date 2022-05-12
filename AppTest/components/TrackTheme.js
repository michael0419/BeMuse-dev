import { View, Text, Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const TrackBox = ({ name, images, preview }) => {
  const [playbackTrack, setPlaybackTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: false
    })
    if (playbackTrack === null) {
      setPlaybackTrack(new Audio.Sound());
    }
  }, []);

  const handleTrackPlayer = async () => {
    if (playbackTrack !== null && playbackStatus === null) {
      const status = await playbackTrack.loadAsync(
        { uri: preview },
        { shouldPlay: true }
      );
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }

    if (playbackStatus.isPlaying) {
      const status = await playbackTrack.pauseAsync();
      setIsPlaying(false);
      return setPlaybackStatus(status);
    }

    if (!playbackStatus.isPlaying) {
      const status = await playbackTrack.playAsync();
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }
  };

  return (
      <View style={styles.trackContainer}>
        <Text style={styles.trackName}>{name}</Text>
        <Image style={styles.trackImage} source={{ uri: images }} />
        <Ionicons 
        name={isPlaying ? 'pause' : 'play'}
        size={60} 
        style={styles.trackButton}
        onPress={handleTrackPlayer} />
      </View>
  )
}

const styles = StyleSheet.create({
    trackContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      width: 340, 
      height: 500
    },
    trackName: {
      color: '#ffffff',
      textAlign: 'center',
      bottom: 30
    },
    trackImage: {
      height: 300,
      width: 300
    },
    trackButton: {
      textAlign: 'center',
      color: '#ffffff',
      top: 30
    }
  });

  export default TrackBox;