import React from 'react';
import { Pressable, Text, Image, View } from 'react-native';

import styles from './styles';

function MoodScreen({ navigation, route }) {
    return (
        <View style={styles.container}>
            <Text>Happy</Text>
            <View style={styles.containerButton}>
                { route.params.imageData && <Image 
                source = { { uri: route.params.imageData } } 
                style ={ { width: 200, height: 200 } } 
                />}
            </View>
        <Pressable 
        style={styles.button} 
        onPress={ () => {
          navigation.navigate('Song')
          }
        }>
          <Text>Next</Text>
        </Pressable>
        </View>
    );
}

export default MoodScreen;