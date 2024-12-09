import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../Domains';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AuthStackParamList } from '../navigation/AuthNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      // console.log('***handleLogin***', username, password)
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        `username=${username}&password=${password}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
    //   Alert.alert('Success', 'Login successful');
      console.log('***response***', response)
      
      await AsyncStorage.setItem('myId', response.data.id);
      await AsyncStorage.setItem('myName', response.data.username);
      await AsyncStorage.setItem('access_token', response.data.access_token);
      await AsyncStorage.setItem('refresh_token', response.data.refresh_token);

      navigation.navigate('Home');

    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
        // keyboardType="email-address" 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />

      <Button title={loading ? 'Loading...' : 'Login'} onPress={handleLogin} />

      {/* <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  link: {
    color: 'blue',
    marginTop: 12,
  },
});

export default LoginScreen;
