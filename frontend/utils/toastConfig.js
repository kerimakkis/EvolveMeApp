import Toast from 'react-native-toast-message';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Custom Toast Configuration
export const toastConfig = {
  success: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toast, styles.successToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  
  error: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toast, styles.errorToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  
  info: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toast, styles.infoToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  
  warning: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toast, styles.warningToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  
  custom: ({ text1, text2, props, ...rest }) => (
    <View style={[styles.toast, styles.confirmToast]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
        <View style={styles.confirmButtons}>
          <TouchableOpacity
            style={[styles.confirmButton, styles.cancelButton]}
            onPress={() => {
              Toast.hide();
              props?.onCancel?.();
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, styles.confirmButtonStyle]}
            onPress={() => {
              Toast.hide();
              props?.onConfirm?.();
            }}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  toastMessage: {
    fontSize: 14,
    opacity: 0.8,
  },
  successToast: {
    backgroundColor: '#34C759',
  },
  errorToast: {
    backgroundColor: '#FF3B30',
  },
  infoToast: {
    backgroundColor: '#007AFF',
  },
  warningToast: {
    backgroundColor: '#FF9500',
  },
  confirmToast: {
    backgroundColor: '#007AFF',
    minHeight: 120,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  confirmButtonStyle: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default toastConfig; 