import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import MoodScreen from '../screens/MoodScreen';
import SongScreen from '../screens/SongScreen';

const Stack = createNativeStackNavigator();

function HomeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
      name = 'Home'
      component = { HomeScreen }
      options = { {headerShown: false} }
      />
      <Stack.Screen 
      name = 'Mood'
      component = { MoodScreen }
      options = { {headerShown: false} }
      />
      <Stack.Screen
      name = 'Song'
      component= { SongScreen }
      options = { {headerShown: false} }
      />
    </Stack.Navigator>
  );
}

export default HomeNavigation;