import React, { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser'
import { View, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session';

import { CLIENT_ID, CLIENT_SECRET } from '../api/SpotifyCreds'
import { storeData } from '../api/TokenStorage';
import styles from '../components/theme';

WebBrowser.maybeCompleteAuthSession();

//Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

function LoginScreen({ navigation }) {
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            scopes: [
                'user-read-email', 
                'playlist-modify-public'
            ],
            usePKCE: false,
            redirectUri: 'exp://192.168.0.2:19000/'
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === 'success') {
            const { access_token } = response.params;
            storeData('access_token', access_token);
            navigation.navigate('HomeNav');
        }
    }, [response]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerButton}>
                <Pressable 
                style={styles.button}
                disabled={!request}
                onPress={() => {
                    promptAsync();
                }}>
                    <Text>Login</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

export default LoginScreen;