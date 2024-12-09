import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator'; 


type User = {
    id: number;
    username: string;
    email: string; // If you meant 'email' instead of 'password'
  };
  
  type Props = {
    user: User; 
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  };

const UserElement = ({user, navigation}: Props) => {

    const handlePress = () => {
        navigation.navigate('Chat', { userId: user.id, username: user.username });
      };

    return (
        <TouchableOpacity 
            onPress={handlePress}
            style={styles.userItem}
        >
          <Text style={styles.userName}>{user.username}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </TouchableOpacity>
    );
}


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

export default UserElement;