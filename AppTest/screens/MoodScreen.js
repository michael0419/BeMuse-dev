import React, { useState, useEffect } from 'react';
import { TouchableHighlight, Text, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';

import { storeData } from '../api/storage/TokenStorage';
import mainStyles from '../components/MainTheme';

const baseUrl = 'http://bemuseferapi.herokuapp.com';

const MoodScreen = ({ navigation, route }) => {
    const [face, setFace] = useState('none');
    const [image, setImage] = useState(null);

    useEffect(() => {
      setImage(route.params.imageData);
    }, []);

    //helper function
    async function resizeImage(imageUrl, width, height){
      const actions = [{
        resize: {
          width,
          height
        }
      }];
      const saveOptions = {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true
      };
      const res = await ImageManipulator.manipulateAsync(imageUrl, actions, saveOptions);
      return res;
    }

    const predictImage = async() => {
      if (image) {
        //console.log(image);
        try {
          //resize image for model and space efficiency
          let imageRes = await resizeImage(image, 48 , 48);
          let data = imageRes.base64;
          //console.log(imageRes.base64);
  
          //Make API request
          try {
            const response = await axios.post(`${baseUrl}/net/image/prediction/`, {
              "img64": data,
            });
            if (response.status === 200) {
              let result = response.data;
              //console.log(` You have created: ${JSON.stringify(response.data)}`);
              setFace(result["model-prediction"]);
              //console.log(result);
  
            } else {
              throw new Error("Error!");
            }
          } catch (error) {
            console.log("An error has occurred!", error);
          }
        } catch (error) {
          console.log('Exception Error: ', error);
        }

      }
    }

    return (
      <SafeAreaView style={mainStyles.container}>
        <Text style={mainStyles.moodTitle}>Mood: {face}</Text>
        <View style={mainStyles.containerButton}>
            {route.params.imageData && <Image 
            source = { { uri: route.params.imageData } }
            style = {mainStyles.containerImage}
            /> }
        </View>
        {face === 'none' ? 
        <TouchableHighlight
        style={mainStyles.discoverButton}
        activeOpacity={0.9}
        underlayColor={'#492A6E'}
        onPress={() => {
          predictImage();
        }} >
          <Text style={mainStyles.buttonText}>Predict</Text>
        </TouchableHighlight> :
        <TouchableHighlight
        style={mainStyles.discoverButton}
        activeOpacity={0.9}
        underlayColor={'#492A6E'}
        onPress={() => {
          navigation.navigate('Song', {
            moodData: face
          });
          storeData('@mood', face);
        }}>
          <Text style={mainStyles.buttonText}>Discover</Text>
        </TouchableHighlight>
         }
      </SafeAreaView>
    );
}

export default MoodScreen;