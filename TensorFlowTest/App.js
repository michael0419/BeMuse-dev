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

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'

import * as ImagePicker from 'expo-image-picker';


const App = () => {
  // State to indicate if TensorFlow.js finished loading
  const [isTfReady, setTfReady] = useState(false);
  const [face, setFace] = useState("none");
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function waitForTensorFlowJs() {
      await tf.ready();
      setTfReady(true);
    }
    waitForTensorFlowJs();
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
    }
  }

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 1]);
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
        const imageAssetPath = Image.resolveAssetSource(image);
  
        const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
        const rawImageData = await response.arrayBuffer()
        const imageTensor = imageToTensor(rawImageData)
        //const predictions = await this.model.detect(imageTensor)
  
        //this.setState({ predictions: predictions })
        // this.setState({ image_uri: imageAssetPath.uri })

        // Decode image data to a tensor
        const alignCorners = true
        
        //const imageTensor = tf.image.resizeBilinear(decodeJpeg(imageData, 1), [48, 48], alignCorners);
        imageTensor = tf.image.resizeBilinear(imageTensor, [48, 48], alignCorners);

        //load model
        const model = await tf.loadLayersModel('https://raw.githubusercontent.com/michael0419/BeMuse-dev/TensorFlowTest/models/V1/model.json');
        //model.summary();

        //Todo: make cloud decode file
        const result = await model.classify(imageTensor);
        const decode = ["mad", "happy", "neutral", "sad"]

        setFace(decode[result[0]]);
  
        console.log('----------- predictions: ', predictions);
  
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
          <Header />
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
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

