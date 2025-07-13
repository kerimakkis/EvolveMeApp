import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/client';
import HabitItem from '../components/HabitItem';
import LogoutButton from '../components/LogoutButton';
import { showToast, toastMessages } from '../utils/toastUtils';

const HabitsScreen = ({ navigation, route }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [addingHabit, setAddingHabit] = useState(false);
  
  // Check if we're in edit mode
  const isEditing = route?.params?.isEditing;
  const habitId = route?.params?.habitId;
  const habitTitle = route?.params?.title;

  // Load existing habit data if editing
  useEffect(() => {
    if (isEditing && habitTitle) {
      setNewHabitTitle(habitTitle);
      setShowAddModal(true);
    }
  }, [isEditing, habitTitle]);

  const fetchHabits = async () => {
    try {
      const response = await apiClient.get('/habits');
      setHabits(response.data);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchHabits();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHabits();
  }, []);

  const handleCompleteHabit = async (habitId) => {
    try {
      await apiClient.post(`/habits/${habitId}/complete`);
      // Refresh the habits list to show updated completion status
      fetchHabits();
      toastMessages.habitCompleted();
    } catch (error) {
      console.error('Failed to complete habit:', error);
      const errorMessage = error.response?.data?.msg || 'Failed to complete habit';
      toastMessages.habitCompleteError(errorMessage);
    }
  };

  const handleAddHabit = async () => {
    if (!newHabitTitle.trim()) {
      toastMessages.validationError('habit title');
      return;
    }

    setAddingHabit(true);
    try {
      if (isEditing && habitId) {
        // Update existing habit
        await apiClient.put(`/habits/${habitId}`, {
          title: newHabitTitle.trim()
        });
        
        setNewHabitTitle('');
        setShowAddModal(false);
        fetchHabits(); // Refresh the list
        toastMessages.habitUpdated();
        // Clear edit mode after successful update
        navigation.setParams({ isEditing: false, habitId: null, title: null });
      } else {
        // Create new habit
        await apiClient.post('/habits', {
          title: newHabitTitle.trim()
        });
        
        setNewHabitTitle('');
        setShowAddModal(false);
        fetchHabits(); // Refresh the list
        toastMessages.habitCreated();
      }
    } catch (error) {
      console.error('Failed to save habit:', error);
      const errorMessage = error.response?.data?.msg || 'Failed to save habit';
      if (isEditing) {
        toastMessages.habitUpdateError(errorMessage);
      } else {
        toastMessages.habitCreateError(errorMessage);
      }
    } finally {
      setAddingHabit(false);
    }
  };

  const handleDeleteHabit = (habitId) => {
    console.log('Attempting to delete habit with ID:', habitId);
    
    // Toast confirmation dialog
    showToast.confirm(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      () => {
        console.log('Delete confirmed for habit:', habitId);
        deleteHabit(habitId);
      },
      () => {
        console.log('Delete cancelled for habit:', habitId);
      }
    );
  };

  const deleteHabit = async (habitId) => {
    try {
      const response = await apiClient.delete(`/habits/${habitId}`);
      console.log('Delete response:', response);
      fetchHabits(); // Refresh the list
      toastMessages.habitDeleted();
    } catch (error) {
      console.error('Failed to delete habit:', error);
      console.error('Error response:', error.response?.data);
      toastMessages.habitDeleteError(error.response?.data?.msg || error.message);
    }
  };

  const renderHabitItem = ({ item }) => (
    <HabitItem
      habit={item}
      onComplete={() => handleCompleteHabit(item._id)}
      onDelete={() => handleDeleteHabit(item._id)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your habits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Habits</Text>
          <Text style={styles.subtitle}>Build positive daily routines</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.dashboardButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Ionicons name="home-outline" size={20} color="white" />
            <Text style={styles.dashboardButtonText}>Dashboard</Text>
          </TouchableOpacity>
          <LogoutButton style={styles.logoutButton} />
        </View>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        renderItem={renderHabitItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyText}>
              Start building positive habits to improve your daily routine
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.emptyButtonText}>Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add/Edit Habit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Habit' : 'Add New Habit'}</Text>
            <Text style={styles.modalSubtitle}>
              {isEditing ? 'Update your habit details' : 'What positive habit would you like to build?'}
            </Text>

            <TextInput
              style={styles.modalInput}
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
              placeholder="e.g., Exercise for 30 minutes"
              maxLength={100}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewHabitTitle('');
                  // Clear edit mode when canceling
                  if (isEditing) {
                    navigation.setParams({ isEditing: false, habitId: null, title: null });
                  }
                }}
                disabled={addingHabit}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalAddButton, addingHabit && styles.modalAddButtonDisabled]}
                onPress={handleAddHabit}
                disabled={addingHabit}
              >
                {addingHabit ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalAddText}>{isEditing ? 'Update Habit' : 'Add Habit'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dashboardButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.3)',
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 25,
    backgroundColor: '#fafafa',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalCancelText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
  },
  modalAddButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalAddText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HabitsScreen;

