import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/BottomTabNavigator';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type DetailsScreenProps = {
  route: DetailsScreenRouteProp;
  navigation: StackNavigationProp<RootStackParamList, 'Details'>;
};

const DetailsScreen = ({ route, navigation }: DetailsScreenProps) => {
  const { itemId } = route.params;

  return (
    <View style={styles.container}>
      <Text>Details Screen</Text>
      <Text>Item ID: {itemId}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailsScreen;
