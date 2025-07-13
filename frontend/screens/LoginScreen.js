import React, { useRef, useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import apiClient from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { toastMessages } from '../utils/toastUtils';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const videoRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <View style={{ flex: 1 }}>
      <Video
        ref={videoRef}
        source={require('../assets/intro.mp4')}
        style={[
          styles.videoBg,
          Platform.OS === 'web' && { objectFit: 'cover', position: 'fixed', width: '100vw', height: '100vh', minWidth: '100vw', minHeight: '100vh' }
        ]}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
        onError={e => console.log('Video error:', e)}
      />
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
        <Button title="Login" onPress={handleLogin} />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    maxWidth: 360,
  },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  link: { color: 'white', textAlign: 'center', marginTop: 15, textDecorationLine: 'underline', fontWeight: '600' },
});

export default LoginScreen;
