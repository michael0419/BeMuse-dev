# BeMuse
An App that uses Facial Emotion Recognition for the discovery of music!

## Why we built it  
We developed this application to explore machine learning options on mobile as well as learn React Native.
In the end we were able to  
- make a facial emotion recognition model through transfer learning 
- make an RESTful api with that model
- integrate the Spotify api in React Native
- integrate camera and system image picker to get images in React Native

## Our goals
To make a efficient and fast inferencing model for mobile use.
To make it easy to get from image to a song discovery.
To learn from this experience and grow as programmers.

## How to use this application  
To run the application, one should: 
1. install Expo-cli with Yarn.
2. make a non-managed project in Expo.
3. install libraries in our AppTest/packadge.json using Expo install
4. copy the files from AppTest/
5. use the command expo run which will give you options to run using the web browser or on your phone using the Expo App to scan the qr code.

## How we trained our model  
We primarily used this [Google Colab Notebook](https://colab.research.google.com/drive/1ZBBU3FYsp1kkCHW8aF2DVX710-DlAD5n?usp=sharing) for our final model version.

## How we implemented the API 
The link to the github repo is [here](https://github.com/michael0419/BeMuse-backend)

## Issues we resolved 
We originally wanted to use tfjs-react-native for local processing but ran into an issue where any method call using the library on mobile applications will return a Tensor of the correct shape but with all values set to 0. We applied the same code into a non React Native enviroment and checked that it works. We found this issue reported on GitHub. Our code for using tfjs-react-native can be found under the tensorflow test branch of this repo.

Our solution was to make an API that can perform the predictions for us while the issues of using tfjs-react-native could be resolved.

## Future plans
- Make the predicition making local to the host device
- Improve user experience by reducing the friction in submitting their faces
- Improve the model performance implementing better pre-processing.
