import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    // containers
    container: {
      flex: 1,
      backgroundColor: '#28282e',
      alignItems: 'center'
    },
    containerButton: {
      flex: 1,
      justifyContent: 'center',
    },
    containerImage: {
      width: 340, 
      height: 480,
      borderColor: '#000000',
      borderWidth: 3,
      borderRadius: 10
    },
    containerTrack: {
      flex: 1,
      justifyContent: 'center'
    },

    // text
    title: {
      color: '#7b46b8',
      fontSize: 50,
      top: 10
    },
    moodTitle: {
      color: '#7b46b8',
      fontSize: 30,
      top: 10
    },
    buttonText: {
      textAlign: 'center',
      color: '#ffffff'
    },
    songText: {
      color: '#ffffff',
      fontSize: 30
    },

    // buttons
    button: {
      backgroundColor: '#7b46b8',
      padding: 20,
      borderRadius: 10
    },
    cameraButton: {
      backgroundColor: '#7b46b8',
      borderRadius: 100,
      padding: 40,
      bottom: 40
    },
    uploadButton: {
      padding: 12,
      borderRadius: 10,
      backgroundColor: '#7b46b8',
      position: 'absolute',
      right: 10,
      left: 10,
      bottom: 40
    },
    discoverButton: {
      width: 90,
      height: 90,
      borderRadius: 100,
      borderWidth: 1.5,
      borderColor: '#ffffff',
      backgroundColor: '#7b46b8',
      bottom: 20,
      justifyContent: 'center'
    },
    nextButton: {
      backgroundColor: '#7b46b8',
      padding: 20,
      borderRadius: 10,
      bottom: 30
    },
    backButton: {
      color: '#7b46b8',
      fontSize: 50,
      position: 'absolute',
      left: 20,
      top: 30
    }

});