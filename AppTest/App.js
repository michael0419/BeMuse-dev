import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { getData } from './api/TokenStorage';
import LoginScreen from './screens/LoginScreen';
import HomeNavigation from './navigation/HomeNavigation';

const Stack = createNativeStackNavigator();

function App() {
  const [isAuthenticated, setIsAuthenicated] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const user = await getData('access_token');
    if (!user) {
      setIsAuthenicated(false);
    }
    else {
      setIsAuthenicated(true);
    }
  };

  return (
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
            component = { HomeNavigation }
            options = { {headerShown: false} }
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;