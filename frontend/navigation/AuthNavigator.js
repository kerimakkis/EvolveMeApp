import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: false,
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
