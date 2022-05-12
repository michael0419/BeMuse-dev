import React from 'react';
import { TouchableHighlight, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import mainStyles from '../components/MainTheme';

const HomeScreen = ({ navigation }) => {
  let imageData = null;

  const uploadImage = async (photo) => {
    if (!photo.cancelled) {
      imageData = photo.uri;
    }
    else {
      imageData = null;
    }
  }

  // access camera
  const openCamera = async () => {
    // ask user for permission to access the camera
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.granted === false) {
      alert('You have refused to allow this app to access your camera');
      return;
    }

    try {
      let photo = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [2, 3],
        quality: 1,
      });

      return await uploadImage(photo);
    }
    catch (e) {
      console.error(e);
      return;
    }
  }

  // access media library
  const pickImage = async () => {
    // ask user for permission to access media library
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (galleryPermission.granted === false) {
      alert('You have refused to allow this app to access your photos');
      return;
    }

    try {
      let photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 1,
      });

      return await uploadImage(photo);
    }
    catch (e) {
      console.error(e);
      return;
    }
  }

  return (
    <SafeAreaView style={mainStyles.container}>
      <StatusBar style='light' />
      <Text style={mainStyles.title}>BeMuse</Text>
      <View style={mainStyles.containerButton}>
        <TouchableHighlight 
        style={mainStyles.cameraButton}
        activeOpacity={0.9}
        underlayColor={'#492A6E'}
        onPress={async () => {
          await openCamera();
          if (imageData) {
            navigation.navigate('Mood', {
              imageData: imageData
            });
          }
        }}>
          <Ionicons 
          name="camera" 
          size={80}
          style={mainStyles.buttonText}/>
        </TouchableHighlight>
        <TouchableHighlight
        style={mainStyles.uploadButton}
        activeOpacity={0.9}
        underlayColor={'#492A6E'}
        onPress={async () => {
          await pickImage();
          if (imageData) {
            navigation.navigate('Mood', {
              imageData: imageData
            });
          }
        }}>
          <Text style={mainStyles.buttonText}>Upload</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;