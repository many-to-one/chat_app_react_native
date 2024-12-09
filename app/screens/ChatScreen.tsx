import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, FlatList } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator'; 
import { RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { BASE_URL, WS_URL } from "../Domains";
import axios from "axios";

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

type Props = {
  route: ChatScreenRouteProp;
};

type MyUser = {
    myId: number;
}

type MessageBase = {
    message: string;
  };
  
type ChatBase = {
//   id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  chat_messages: MessageBase[];
};

const ChatScreen = ({route}: Props) => {

    const { userId, username } = route.params;
    const [messages, setMessages] = useState<MessageBase[]>([]);
    const [messageText, setMessageText] = useState<string>('');
    const clientId = Date.now();
    const ws = new WebSocket(`ws://${WS_URL}/${clientId}`); 
    // const ws = new WebSocket(`ws://localhost:8005/ws/${clientId}`); 

    const [myId, setMyId] = useState<number>(0);

    const getMyId = async() => {
        try {
            const id = await AsyncStorage.getItem('myId');
            console.log('myId', id)
            const parsedId = id ? parseInt(id, 10) : 0; 
            setMyId(isNaN(parsedId) ? 0 : parsedId);
          } catch (error) {
            console.error('Failed to load myId:', error);
          }
    }

    useEffect(() => {
        getMyId();
    }, [])


    useEffect(() => {
        fetchMessages();
    }, [])

        const fetchMessages = async () => {

          const accessToken = await AsyncStorage.getItem('access_token');

          const messageData = {
            sender_id: myId, 
            receiver_id: userId, 
          };

          console.log('messageData', messageData)

          try {
            const response = await axios.get(`${BASE_URL}/chat/get_chat`, {
                params: {
                  sender_id: myId,
                  receiver_id: userId,
                },
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`, // Attach the token in the request header
                },
              });
            const chatData: ChatBase[] = response.data;
            // const chatData = response.data.chat_messages;

            console.log('chatData', response.data)
    
            const loadedMessages: MessageBase[] = chatData.flatMap(chat => chat.chat_messages);
    
            // setMessages(loadedMessages);
            setMessages((prevMessages) => [...prevMessages, ...loadedMessages]);
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        };

    

    useEffect(() => {
        ws.onmessage = (event) => {
            console.log('onmessage', event.data)
        //   const receivedData: ChatBase = JSON.parse(event.data);
          
        //   // Extract the chat_messages from the received data
        //   const incomingMessages: MessageBase[] = receivedData.chat_messages;
    
        //   setMessages((prevMessages) => [...prevMessages, ...incomingMessages]);
        };
    
        return () => ws.close(); // Clean up the WebSocket connection on unmount
      }, []);

      const sendMessage = () => {
        if (messageText.trim() === '') return;
    
        // Create a ChatBase message to send to the server
        const messageData: ChatBase = {
        //   id: Date.now(), // Unique ID
          sender_id: myId, // Current user ID (make this dynamic as needed)
          receiver_id: userId, // Receiver ID (can be dynamic)
          message: messageText,
          chat_messages: [{ message: messageText }], // Message list
        };
    
        // Send message to the WebSocket server
        ws.send(JSON.stringify(messageData));
    
        // Add to local state as a sent message
        const newMessage: MessageBase = {
          message: messageText,
        };
    
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageText('');
      };

      return (
        <KeyboardAvoidingView
          style={styles.container}
        //   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{item.message}</Text>
              </View>
            )}
          />
    
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
      },
      messageContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
        maxWidth: '80%',
      },
      messageText: {
        fontSize: 16,
      },
      inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
      },
      input: {
        flex: 1,
        height: 40,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
      },
      sendButton: {
        backgroundColor: '#075E54',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginLeft: 10,
      },
      sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
    });


export default ChatScreen;