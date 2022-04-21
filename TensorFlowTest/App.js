import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import * as ImagePicker from 'expo-image-picker';


const App = async () => {
  // State to indicate if TensorFlow.js finished loading
  const [isTfReady, setTfReady] = useState(false);

  useEffect(() => {
    async function waitForTensorFlowJs() {
      await tf.ready();
      setTfReady(true);
    }
    waitForTensorFlowJs();
  }, []);

  //for image
  const [image, setImage] = useState(null);
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

  const [face, setFace] = useState("none");
  async function predictImage(){
    if(image){
      // Load an image as a Uint8Array
      const imageUri = image; 
      const response = await fetch(imageUri, {}, { isBinary: true });
      const imageDataArrayBuffer = await response.arrayBuffer();
      const imageData = new Uint8Array(imageDataArrayBuffer);

      // Decode image data to a tensor
      const imageTensor = decodeJpeg(imageData, 1);

      //load model
      const model = await tf.loadLayersModel(
        'https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json');
      model.summary();

      //Todo: make cloud decode file
      const result = await model.predict(imageTensor);
      const decode = ["mad", "happy", "neutral", "sad"]

      setFace(decode[result[0]]);
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionDescription}>
                TensorFlow.js v{tf.version.tfjs} is {isTfReady ? 'ready' : 'loading'}{' '}
                {isTfReady && `and using backend: ${tf.getBackend()}`}.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
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
            <LearnMoreLinks />
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

