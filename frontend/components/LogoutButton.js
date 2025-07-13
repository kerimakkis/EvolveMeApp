import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { showToast, toastMessages } from '../utils/toastUtils';

const LogoutButton = ({ style, textStyle }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    showToast.confirm(
      'Logout',
      'Are you sure you want to logout?',
      () => {
        logout();
        toastMessages.logoutSuccess();
      },
      () => {} // Do nothing on cancel
    );
  };

  return (
    <TouchableOpacity style={[styles.logoutButton, style]} onPress={handleLogout}>
      <Text style={[styles.logoutText, textStyle]}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    minWidth: 80,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LogoutButton; 