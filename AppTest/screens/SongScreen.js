import React from 'react';
import { Pressable, Text, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from '../components/theme';

function SongScreen({ route }) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Songs</Text>
        </SafeAreaView>
    );
}

export default SongScreen;