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

import * as FileSystem from 'expo-file-system';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'

import * as ImageManipulator from 'expo-image-manipulator';

import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';
const baseUrl = 'http://localhost:8000';


const App = () => {
  // State to indicate if TensorFlow.js finished loading
  const [isTfReady, setTfReady] = useState(false);
  const [face, setFace] = useState("none");
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  //const [model, setModel] = useState(null);
  //var model;

  useEffect(() => {
    async function waitForTensorFlowJs() {
      await tf.ready();
      setTfReady(true);
    }
    waitForTensorFlowJs();

    // async function loadModel(){
    //   await tf.ready()
    //   if(!model){
    //     const modelJson = require('./models/model.json');
    //     const modelWeights = require('./models/group1-shard1of1.bin');
    //     const loadedModel = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
    //     setModel(loadedModel);
    //     console.log("model loaded");
    //   }
    // }
    // loadModel();
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

  //new
  function base64ImageToTensorStandardAndGrey(base64){
    //Function to convert jpeg image to tensors
    const rawImageData = tf.util.encodeString(base64, 'base64');
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Float32Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]/255.0;
      buffer[i + 1] = data[offset + 1]/255.0;
      buffer[i + 2] = data[offset + 2]/255.0;
      offset += 4;
    }

    //Make greyscale
    const buffer2 = new Float32Array(width * height)
    for (let i = 0; i < buffer.length; i += 3) {
      buffer2[i/3] = 0.2989*buffer[i] + 0.5870*buffer[i + 1] +  0.1140*buffer[i + 2]; 
    }
    return tf.tensor3d(buffer2, [height, width, 1], 'float32');
  }

  function base64ImageToTensor(base64){
    //Function to convert jpeg image to tensors
    const rawImageData = tf.util.encodeString(base64, 'base64');
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Float32Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }
    return tf.tensor3d(buffer, [height, width, 3], 'float32');
  }

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
                TensorFlow.js v{tf.version.tfjs} is {isTfReady ? 'ready' : 'loading'}{' '}
                {isTfReady && `and using backend: ${tf.getBackend()}`}.
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

