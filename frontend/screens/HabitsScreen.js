import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/client';
import HabitItem from '../components/HabitItem';

const HabitsScreen = ({ navigation }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [addingHabit, setAddingHabit] = useState(false);

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
    } catch (error) {
      console.error('Failed to complete habit:', error);
      const errorMessage = error.response?.data?.msg || 'Failed to complete habit';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleAddHabit = async () => {
    if (!newHabitTitle.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    setAddingHabit(true);
    try {
      await apiClient.post('/habits', {
        title: newHabitTitle.trim()
      });
      
      setNewHabitTitle('');
      setShowAddModal(false);
      fetchHabits(); // Refresh the list
      Alert.alert('Success', 'Habit created successfully!');
    } catch (error) {
      console.error('Failed to create habit:', error);
      const errorMessage = error.response?.data?.msg || 'Failed to create habit';
      Alert.alert('Error', errorMessage);
    } finally {
      setAddingHabit(false);
    }
  };

  const handleDeleteHabit = (habitId) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/habits/${habitId}`);
              fetchHabits(); // Refresh the list
              Alert.alert('Success', 'Habit deleted successfully');
            } catch (error) {
              console.error('Failed to delete habit:', error);
              Alert.alert('Error', 'Failed to delete habit');
            }
          }
        }
      ]
    );
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
        <Text style={styles.title}>My Habits</Text>
        <Text style={styles.subtitle}>Build positive daily routines</Text>
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

      {/* Add Habit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Habit</Text>
            <Text style={styles.modalSubtitle}>
              What positive habit would you like to build?
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
                  <Text style={styles.modalAddText}>Add Habit</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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

