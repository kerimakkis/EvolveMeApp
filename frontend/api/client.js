import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Replace with your computer's local IP address
// On Mac: ifconfig | grep "inet "
// On Windows: ipconfig
const API_URL = 'http://localhost:5000/api'; // <-- Updated automatically

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;