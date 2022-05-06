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

import * as FileSystem from 'expo-file-system';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'

import * as ImagePicker from 'expo-image-picker';


const App = () => {
  // State to indicate if TensorFlow.js finished loading
  const [isTfReady, setTfReady] = useState(false);
  const [face, setFace] = useState("none");
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [model, setModel] = useState(null);
  var img2 = null;
  //var model;

  useEffect(() => {
    async function waitForTensorFlowJs() {
      await tf.ready();
      setTfReady(true);
    }
    waitForTensorFlowJs();

    async function loadModel(){
      const modelJson = require('./models/model.json');
      const modelWeights = require('./models/group1-shard1of1.bin');
      const loadedModel = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
      setModel(loadedModel);
      console.log("model loaded");
    }
    loadModel();
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
      img2 = result.uri;
    }
  }

  // const imageToTensor = (rawImageData) => {
  //   const TO_UINT8ARRAY = true
  //   //const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
  //   // Drop the alpha channel info for mobilenet
    
  //   //new
  //   const data = rawImageData;

  //   const buffer = new Uint8Array(width * height * 3)
  //   let offset = 0 // offset into original data
  //   for (let i = 0; i < buffer.length; i += 3) {
  //     buffer[i] = data[offset]
  //     buffer[i + 1] = data[offset + 1]
  //     buffer[i + 2] = data[offset + 2]

  //     offset += 4
  //   }

  //   return tf.tensor3d(buffer, [height, width, 3], 'float32')
  // }

  function imageToTensor(rawImageData) {
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

    return tf.tensor3d(buffer, [height, width, 3])
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
  

  const prepTensor = (imgTensor, size) => {
    // Convert to tensor
    //const imgTensor = tf.fromPixels(img)
    const NORMALIZATION_OFFSET = tf.scalar(2*127.5)
    // Normalize from [0, 255] to [0, 1].
    const normalized = imgTensor
      .toFloat()
      .sub(NORMALIZATION_OFFSET)
      .div(NORMALIZATION_OFFSET)

    if (imgTensor.shape[0] === size && imgTensor.shape[1] === size) {
      return normalized
    }

    // Resize image to proper dimensions
    const alignCorners = true
    return tf.image.resizeBilinear(normalized, [size, size], alignCorners)
  }


  const rgbToGrayscale = async imgTensor => {
    const minTensor = imgTensor.min()
    const maxTensor = imgTensor.max()
    const min = (await minTensor.data())[0]
    const max = (await maxTensor.data())[0]
    minTensor.dispose()
    maxTensor.dispose()

    // Normalize to [0, 1]
    const normalized = imgTensor.sub(tf.scalar(min)).div(tf.scalar(max - min))

    // Compute mean of R, G, and B values
    let grayscale = normalized.mean(2)

    // Expand dimensions to get proper shape: (h, w, 1)
    return grayscale.expandDims(2)
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
        console.log(fileUri)      
        // const imgB64 = await FileSystem.readAsStringAsync(fileUri, {
        //     encoding: FileSystem.EncodingType.Base64,
        // });
        // const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
        // const raw = new Uint8Array(imgBuffer)  
        //var imageTensor = decodeJpeg(raw);//imageToTensor(raw); //tf.tensor3d(raw, [height, width, 3])//tf.node.decodeImage(raw);
        // const imageAssetPath = Image.resolveAssetSource(image);
        // const response = await fetch(image, {}, { isBinary: true })
        // const rawImageData = await response.arrayBuffer()
        const imgB64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
        const raw = new Uint8Array(imgBuffer)  
        const imageTensor = imageToTensor(raw)
        const valuesTensor =  imageTensor.arraySync();
        console.log(imageTensor.print());

        //const fileUri = 'NON-HTTP-URI-GOES-HERE';      
        // const imgB64 = await FileSystem.readAsStringAsync(fileUri, {
        //     encoding: FileSystem.EncodingType.Base64,
        // });
        // const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
        // const raw = new Uint8Array(imgBuffer)  
        // const imageTensor = decodeJpeg(raw);

        //const preConvert = await imageTensor.data();
        const imageTensorSum = imageTensor.sum();
        const imageChecksum = (await imageTensorSum.data())[0];
        console.log(imageTensor.print());
        console.log(imageChecksum);
  
        //this.setState({ predictions: predictions })
        // this.setState({ image_uri: imageAssetPath.uri })

        // Decode image data to a tensor
        const alignCorners = true
        console.log("tensor good");
        //const imageTensor = tf.image.resizeBilinear(decodeJpeg(imageData, 1), [48, 48], alignCorners);
        //imageTensor = imageTensor.resizeBilinear([48, 48]).reshape([48,48,3]);
        
        //imageTensor= tf.ones([48,48,3])
        //convert to greyscale
        const rgb_weights=[0.2989, 0.5870, 0.1140]
        const imageTensor2 = tf.image.resizeBilinear(imageTensor, [48,48], true).mul(rgb_weights).sum(-1).expandDims( -1)
        
        const imageTensorSum2 = imageTensor2.sum();
        const imageChecksum2 = (await imageTensorSum2.data())[0];
        console.log(imageTensor2.print());
        console.log(imageChecksum2);
        //imageTensor= imageTensor//.reshape([-1,48,48,1])
        //imageTensor = tf.image.resizeBilinear(imageTensor, [48,48], true)//.reshape([-1,48,48,1])
        
        //color conversion
        // const imageTensor1 = await rgbToGrayscale(imageTensor);
        // console.log(imageTensor1.print());

        //normalize
        // const imageTensor2 = await prepTensor(imageTensor1, 48);
        

        
        //imageTensor= tf.image.resizeBilinear(imageTensor, [48,48], true).reshape([-1,48,48,1])
        let input = tf.zeros([1, 48, 48, 1]);
        input[0] = imageTensor2
        
        //const postConvert = await imageTensor.data();
        //console.log(imageTensor.print());
        console.log("tensor converted");
        
        //model.summary();

        //Todo: make cloud decode file
        const result = await model.predict(input).data();
        console.log(result);
        const decode = ["mad", "happy", "neutral", "sad"]

        setFace(decode[result[0]]);
        console.log("predictions made" + result);
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

