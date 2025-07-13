import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/client';
import GoalItem from '../components/GoalItem';
import LogoutButton from '../components/LogoutButton';
import { showToast, toastMessages } from '../utils/toastUtils';

const GoalsScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGoals = async () => {
    try {
      const response = await apiClient.get('/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // useFocusEffect runs when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchGoals();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGoals();
  }, []);

  const handleUpdateGoal = (goal) => {
    navigation.navigate('AddGoal', { 
      goalId: goal._id,
      title: goal.title,
      description: goal.description,
      isEditing: true 
    });
  };

  const handleDeleteGoal = async (goalId) => {
    console.log('Attempting to delete goal with ID:', goalId);
    showToast.confirm(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      async () => {
        try {
          const response = await apiClient.delete(`/goals/${goalId}`);
          console.log('Delete response:', response);
          fetchGoals(); // Refresh the list
          toastMessages.goalDeleted();
        } catch (error) {
          console.error('Failed to delete goal:', error);
          console.error('Error response:', error.response?.data);
          toastMessages.goalDeleteError(error.response?.data?.msg || error.message);
        }
      },
      () => console.log('Delete cancelled')
    );
  };
  
  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Goals</Text>
          <Text style={styles.subtitle}>Set and track your personal goals</Text>
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
        data={goals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <GoalItem 
            goal={item} 
            onUpdate={handleUpdateGoal}
            onDelete={handleDeleteGoal}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptyText}>Set your first goal to start your journey</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddGoal')}
            >
              <Text style={styles.emptyButtonText}>Add Your First Goal</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddGoal')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
});

export default GoalsScreen;
