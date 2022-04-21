import React, { useState } from 'react';
import { Pressable, Text, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from '../components/theme';

function HomeScreen({ navigation }) {
  const [image, setImage] = useState(null);

  // access camera
  const openCamera = async () => {
    // ask user for permission to access the camera
    const camPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (camPermission.granted === false) {
      alert('You have refused to allow this app to access your camera');
      return;
    }

    let result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  // access media library
  const pickImage = async () => {
    // ask user for permission to access media library
    const galPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (galPermission.granted === false) {
      alert('You have refused to allow this app to access your photos');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to BeMuse</Text>
      <View style={styles.containerButton}>
        <Pressable 
        style={styles.button} 
        onPress={ openCamera }>
          <Text>Camera</Text>
        </Pressable>
        <Pressable 
        style={styles.button} 
        onPress={ pickImage }>
          <Text>Gallery</Text>
        </Pressable>
        <Pressable 
        style={styles.button} 
        onPress={() => {
          navigation.navigate('Mood', {
            imageData: image
          })
        }}>
          <Text>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;