import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value)
    } catch (e) {
        console.error('Storage Error', e);
    }
  };

  export const getData = async (name) => {
    try {
      const value = await AsyncStorage.getItem(name)
      if(value !== null) {
          return value;
      }
    } catch(e) {
        return error;
    }
  }