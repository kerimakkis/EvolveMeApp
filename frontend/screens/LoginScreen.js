import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import apiClient from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { toastMessages } from '../utils/toastUtils';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
        toastMessages.validationError('all fields');
        return;
    }
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.token);
      toastMessages.loginSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Login failed. Please check your credentials.';
      toastMessages.loginError(errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add styles like in RegisterScreen
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#333' },
    input: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    error: { color: 'red', textAlign: 'center', marginBottom: 10 },
    link: { color: 'blue', textAlign: 'center', marginTop: 15 },
});


export default LoginScreen;
