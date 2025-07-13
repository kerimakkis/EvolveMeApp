import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import apiClient from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { toastMessages } from '../utils/toastUtils';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toastMessages.validationError('all fields');
      return false;
    }

    if (password.length < 6) {
      showToast.warning('Validation Error', 'Password must be at least 6 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      showToast.warning('Validation Error', 'Passwords do not match.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast.warning('Validation Error', 'Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      // Auto-login after successful registration
      await login(response.data.token);
      toastMessages.registerSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Registration failed. Please try again.';
      toastMessages.registerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your personal growth journey today</Text>
        

        
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          autoCapitalize="words"
          autoCorrect={false}
        />
        
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default RegisterScreen;

