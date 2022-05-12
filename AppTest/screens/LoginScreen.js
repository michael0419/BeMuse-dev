import React, { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { View, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResponseType, useAuthRequest } from 'expo-auth-session';

import { CLIENT_ID, CLIENT_SECRET } from '../api/storage/SpotifyCreds';
import { storeData } from '../api/storage/TokenStorage';
import mainStyles from '../components/MainTheme';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
      };
    
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            scopes: [
                'user-read-email',
                'user-read-currently-playing',
                'user-read-playback-state',
                'user-modify-playback-state',
                'playlist-read-collaborative',
                'playlist-read-private'
            ],
            usePKCE: false,
            redirectUri: 'exp://192.168.0.2:19000/'
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { access_token } = response.params;
            storeData('@access_token', access_token);
            navigation.navigate('Home', { screen: 'Home' });
        }
    }, [response]);

    return (
        <SafeAreaView style={mainStyles.container}>
            <StatusBar style='light' />
            <View style={mainStyles.containerButton}>
                <Pressable 
                style={mainStyles.button}
                disabled={!request}
                onPress={() => {
                    promptAsync();
                }}>
                    <Text style={mainStyles.buttonText}>Login</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

export default LoginScreen;