import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Image,
  Platform,
  // StatusBar,
} from 'react-native';

// import {
//   Header,
//   Colors,
// } from 'react-native/Libraries/NewAppScreen';

import * as ImageManipulator from 'expo-image-manipulator';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';
const baseUrl = 'http://localhost:8000';

const App = () => {

  const [face, setFace] = useState("none");
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  //const [model, setModel] = useState(null);
  //var model;

  useEffect(() => {



  }, []);

  //for image
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      //img2 = result.uri;
    }
  }

  const getImageDimensions = () => {
 
    Image.getSize(image, (Width, Height) => {
      setWidth(Width);
      setHeight(Height);
      console.log(height)
      console.log(width)
 
    }, (errorMsg) => {
      console.log(errorMsg);
 
    });
 
  }

  //helper functions

  async function resizeImage(imageUrl, width, height){
    const actions = [{
      resize: {
        width,
        height
      },
    }];
    const saveOptions = {
      compress: 0.75,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    };
    const res = await ImageManipulator.manipulateAsync(imageUrl, actions, saveOptions);
    return res;
  }
  
  const predictImage = async() => {
    if(image){
      // Load an image as a Uint8Array
      // const imageUri = image; 
      // console.log(imageUri);
      // const response = await fetch(imageUri, {}, { isBinary: true });
      // const imageDataArrayBuffer = await imageUri.arrayBuffer();
      // const imageData = new Uint8Array(imageDataArrayBuffer);
      console.log(image);
      try {
        getImageDimensions();
        const fileUri = image;
        //console.log(fileUri)      

        //works
        let imageRes = await resizeImage(image, 48 , 48);
        //let imageTensor = base64ImageToTensor(imageRes.base64);
        //let imageTensor = base64ImageToTensorStandardAndGrey(imageRes.base64);
        let data = imageRes.base64

        console.log(imageRes.base64)
        //WIP

        // const configurationObject = {
        //   method: 'post',
        //   url: `${baseUrl}/api/users/1`,
        // };

        

        //Todo: make API request
        try {
          const response = await axios.post(`${baseUrl}/net/image/prediction/`, {
            "img64": data,
          });
          if (response.status === 200) {
            let result = response.data
            console.log(` You have created: ${JSON.stringify(response.data)}`);
            setFace(result["model-prediction"])
            console.log(result)

          } else {
            throw new Error("An error has occurred");
          }
        } catch (error) {
          console.log("An error has occurred");
        }
        
        

      //  console.log('----------- predictions: ', predictions);
        
      } catch (error) {
        console.log('Exception Error: ', error);
      }

    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          
          {/* {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )} */}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionDescription}>
                Hello World
              </Text>
            </View>
            <View style={styles.sectionContainer}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Button title="Pick an image from camera roll" onPress={pickImage} />
                  {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Predict on the image" onPress={predictImage} />
                <Text style={styles.sectionDescription}>
                  Prediction is {face}.
                </Text>
                </View>
            </View>
            
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#2ee188',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: '#d3e2da',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#9e3309',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: '#af84fc',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

