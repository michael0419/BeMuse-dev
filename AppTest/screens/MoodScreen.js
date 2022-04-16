import React from 'react';
import { Text, Image, View } from "react-native";

import styles from './styles'

function MoodScreen({ route }) {
    return (
        <View style={styles.container}>
            <View style={containerButton}>
                { route.params.imageData && <Image 
                source = { { uri: route.params.imageData } } 
                style ={ { width: 200, height: 200 } } 
                />}
            </View>
        </View>
    );
}

export default MoodScreen;