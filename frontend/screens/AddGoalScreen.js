import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/client';
import { showToast, toastMessages } from '../utils/toastUtils';

const AddGoalScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if we're in edit mode
  const isEditing = route?.params?.isEditing;
  const goalId = route?.params?.goalId;

  // Load existing goal data if editing
  useEffect(() => {
    if (isEditing && route?.params?.title) {
      setTitle(route.params.title);
      setDescription(route.params.description || '');
    }
  }, [isEditing, route?.params]);

  const validateForm = () => {
    if (!title.trim()) {
      toastMessages.validationError('goal title');
      return false;
    }
    if (title.trim().length < 3) {
      showToast.warning('Validation Error', 'Goal title must be at least 3 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isEditing && goalId) {
        // Update existing goal
        await apiClient.put(`/goals/${goalId}`, {
          title: title.trim(),
          description: description.trim() || undefined
        });

        toastMessages.goalUpdated();
        setTimeout(() => navigation.goBack(), 1500);
      } else {
        // Create new goal
        await apiClient.post('/goals', {
          title: title.trim(),
          description: description.trim() || undefined
        });

        toastMessages.goalCreated();
        setTimeout(() => navigation.goBack(), 1500);
      }
    } catch (error) {
      console.error('Failed to save goal:', error);
      const errorMessage = error.response?.data?.msg || 'Failed to save goal. Please try again.';
      if (isEditing) {
        toastMessages.goalUpdateError(errorMessage);
      } else {
        toastMessages.goalCreateError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      showToast.confirm(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        () => navigation.goBack(),
        () => {} // Do nothing on cancel
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{isEditing ? 'Edit Goal' : 'Add New Goal'}</Text>
            <Text style={styles.subtitle}>
              {isEditing ? 'Update your goal details' : 'Set a clear, achievable goal for yourself'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.dashboardButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Ionicons name="home-outline" size={20} color="white" />
            <Text style={styles.dashboardButtonText}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Learn React Native"
              maxLength={100}
              autoFocus
            />
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your goal in detail..."
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{description.length}/500</Text>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips for setting effective goals:</Text>
            <Text style={styles.tip}>• Be specific and measurable</Text>
            <Text style={styles.tip}>• Set realistic timeframes</Text>
            <Text style={styles.tip}>• Break large goals into smaller steps</Text>
            <Text style={styles.tip}>• Write down why this goal matters to you</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>{isEditing ? 'Update Goal' : 'Create Goal'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  dashboardButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dashboardButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  tipsContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  tip: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddGoalScreen;

