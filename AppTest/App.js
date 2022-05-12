import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MoodScreen from './screens/MoodScreen';
import SongScreen from './screens/SongScreen';
import { getData } from './api/storage/TokenStorage';
import { store } from './api/redux/Store';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenicated] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const user = await getData('@access_token');

    if (!user) {
      setIsAuthenicated(false);
    }
    else {
      setIsAuthenicated(true);
    }
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthenticated ? (
            <Stack.Screen
            name = 'Login'
            component= { LoginScreen }
            options = { {headerShown: false} }
            />
          ) : ( 
            <Stack.Screen 
            name = 'HomeNav'
            component = { HomeScreen }
            options = { {headerShown: false} }
            />
          )}
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
      </NavigationContainer>
    </Provider>
  );
}

export default App;