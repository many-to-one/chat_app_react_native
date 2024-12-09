import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import ChatScreen from '../screens/ChatScreen';

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Chat: { userId: number; username: string };
    Details: { itemId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={({ route }) => ({ title: route.params.username })}
        />
    </Stack.Navigator>
  );
};

export default StackNavigator;
