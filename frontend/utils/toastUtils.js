import Toast from 'react-native-toast-message';

// Toast utility functions
export const showToast = {
  // Success toast
  success: (title, message = '') => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  },

  // Error toast
  error: (title, message = '') => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  },

  // Info toast
  info: (title, message = '') => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  },

  // Warning toast
  warning: (title, message = '') => {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3500,
      autoHide: true,
      topOffset: 50,
    });
  },

  // Custom confirmation dialog
  confirm: (title, message, onConfirm, onCancel) => {
    Toast.show({
      type: 'custom',
      text1: title,
      text2: message,
      position: 'center',
      visibilityTime: 0, // Don't auto hide
      autoHide: false,
      props: {
        onConfirm,
        onCancel,
      },
    });
  },
};

// Common toast messages
export const toastMessages = {
  // Goals
  goalCreated: () => showToast.success('Goal Created', 'Your goal has been successfully created!'),
  goalUpdated: () => showToast.success('Goal Updated', 'Your goal has been successfully updated!'),
  goalDeleted: () => showToast.success('Goal Deleted', 'Your goal has been successfully deleted!'),
  goalDeleteError: (error) => showToast.error('Delete Failed', `Failed to delete goal: ${error}`),
  goalCreateError: (error) => showToast.error('Create Failed', `Failed to create goal: ${error}`),
  goalUpdateError: (error) => showToast.error('Update Failed', `Failed to update goal: ${error}`),

  // Habits
  habitCreated: () => showToast.success('Habit Created', 'Your habit has been successfully created!'),
  habitUpdated: () => showToast.success('Habit Updated', 'Your habit has been successfully updated!'),
  habitDeleted: () => showToast.success('Habit Deleted', 'Your habit has been successfully deleted!'),
  habitCompleted: () => showToast.success('Habit Completed', 'Great job! Keep up the good work!'),
  habitDeleteError: (error) => showToast.error('Delete Failed', `Failed to delete habit: ${error}`),
  habitCreateError: (error) => showToast.error('Create Failed', `Failed to create habit: ${error}`),
  habitUpdateError: (error) => showToast.error('Update Failed', `Failed to update habit: ${error}`),
  habitCompleteError: (error) => showToast.error('Complete Failed', `Failed to complete habit: ${error}`),

  // Auth
  loginSuccess: () => showToast.success('Welcome Back!', 'You have successfully logged in.'),
  loginError: (error) => showToast.error('Login Failed', `Login failed: ${error}`),
  registerSuccess: () => showToast.success('Account Created', 'Your account has been successfully created!'),
  registerError: (error) => showToast.error('Registration Failed', `Registration failed: ${error}`),
  logoutSuccess: () => showToast.info('Logged Out', 'You have been successfully logged out.'),

  // General
  networkError: () => showToast.error('Network Error', 'Please check your internet connection.'),
  serverError: () => showToast.error('Server Error', 'Something went wrong. Please try again.'),
  validationError: (field) => showToast.warning('Validation Error', `Please check your ${field}.`),
  loading: () => showToast.info('Loading', 'Please wait...'),
};

export default showToast; 