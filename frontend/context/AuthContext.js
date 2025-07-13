import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (newToken) => {
    setIsLoading(true);
    setToken(newToken);
    await AsyncStorage.setItem('token', newToken);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setToken(null);
      await AsyncStorage.removeItem('token');
      setIsLoading(false);
    } catch (error) {
      console.error('Error during logout:', error);
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('token');
      setToken(userToken);
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoggedIn error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};