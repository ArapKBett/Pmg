// mobile-app/App.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

const API_URL = 'https://your-server-domain.com/api';

export default function App() {
  const [credentials, setCredentials] = useState([]);
  const [otps, setOtps] = useState([]);
  const [masterPassword, setMasterPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');

  const login = async () => {
    try {
      // Derive encryption key from master password
      const key = CryptoJS.PBKDF2(masterPassword, 'salt', {
        keySize: 256/32,
        iterations: 10000
      }).toString();
      
      setEncryptionKey(key);
      
      // Verify master password with server
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: 'your@email.com', // Replace with actual email input
        masterPassword: CryptoJS.SHA256(masterPassword).toString()
      });
      
      if (response.data.token) {
        await SecureStore.setItemAsync('token', response.data.token);
        setLoggedIn(true);
        fetchCredentials(key);
      }
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Invalid credentials');
    }
  };

  const fetchCredentials = async (key) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await axios.get(`${API_URL}/credentials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const decrypted = response.data.map(cred => ({
        ...cred,
        username: decrypt(cred.username, key),
        password: decrypt(cred.password, key)
      }));
      
      setCredentials(decrypted);
    } catch (error) {
      Alert.alert('Sync Failed', 'Could not fetch credentials');
    }
  };

  const decrypt = (ciphertext, key) => {
    if (!ciphertext) return '';
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  return (
    <View style={styles.container}>
      {!loggedIn ? (
        <>
          <Text style={styles.title}>Password Manager</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Master Password"
            value={masterPassword}
            onChangeText={setMasterPassword}
          />
          <Button title="Login" onPress={login} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Your Credentials</Text>
          <FlatList
            data={credentials}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card}>
                <Text style={styles.service}>{item.service}</Text>
                <Text>Username: {item.username}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5
  },
  service: {
    fontWeight: 'bold',
    marginBottom: 5
  }
});
