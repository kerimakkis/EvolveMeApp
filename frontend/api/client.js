import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Replace with your computer's local IP address
// On Mac: ifconfig | grep "inet "
// On Windows: ipconfig
const API_URL = 'http://localhost:5001/api'; // <-- Updated automatically

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('API Client: Request URL:', config.url);
    console.log('API Client: Request method:', config.method);
    console.log('API Client: Token found:', !!token);
    if (token) {
        config.headers['x-auth-token'] = token;
        console.log('API Client: Token added to headers');
    } else {
        console.log('API Client: No token found in AsyncStorage');
    }
    return config;
}, (error) => {
    console.error('API Client: Request interceptor error:', error);
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => {
        console.log('API Client: Response received:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Client: Response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default apiClient;