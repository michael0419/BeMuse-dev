import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('access_token', value)
    } catch (e) {
        console.error(e);
    }
  };

  export const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('access_token')
      if(value !== null) {
          return value;
      }
    } catch(e) {
        return error;
    }
  }