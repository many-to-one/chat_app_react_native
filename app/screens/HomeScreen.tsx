import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator'; 
import axios from 'axios';
import { BASE_URL } from '../Domains';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserElement from '../elements/UserElement';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type User = {
  id: number;
  username: string;
  email: string;
};

const HomeScreen = ({ navigation }: Props) => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {

      const accessToken = await AsyncStorage.getItem('access_token');

      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/users/all_users`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Attach the token in the request header
          },
        });
        setUsers(response.data);
      } catch (error: any) {
        setError(error.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserElement user={item} navigation={navigation} />
        )}
      />
      <Button 
        title="Go to Details" 
        onPress={() => navigation.navigate('Details', { itemId: 42 })} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 10,
    // width: '100%',
    width: 290,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default HomeScreen;
