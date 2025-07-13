import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';
import './utils/consoleUtils';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ textAlign: 'center', color: '#666' }}>
            Please restart the app or contact support if the problem persists.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const { token, isLoading } = useContext(AuthContext);

  // Global error handling
  useEffect(() => {
    const handleGlobalError = (error, isFatal) => {
      console.log('Global error caught:', error, isFatal);
    };

    const handleUnhandledRejection = (event) => {
      console.log('Unhandled promise rejection:', event.reason);
    };

    // Add global error handlers
    if (global.ErrorUtils) {
      global.ErrorUtils.setGlobalHandler(handleGlobalError);
    }

    // Add unhandled promise rejection handler
    if (global.addEventListener) {
      global.addEventListener('unhandledrejection', handleUnhandledRejection);
    }

    return () => {
      // Cleanup
      if (global.removeEventListener) {
        global.removeEventListener('unhandledrejection', handleUnhandledRejection);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const shouldShowAuth = token === null || token === undefined || token === '';

  return (
    <NavigationContainer
      onStateChange={(state) => {
        // Handle navigation state changes silently
        console.log('Navigation state changed');
      }}
      onError={(error) => {
        // Handle navigation errors silently
        console.log('Navigation error:', error);
      }}
    >
      {!shouldShowAuth ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        <Toast config={toastConfig} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
