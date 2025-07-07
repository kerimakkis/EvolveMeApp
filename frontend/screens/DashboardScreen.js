import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/client';

const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    totalHabits: 0,
    completedHabitsToday: 0,
    recentJournalEntries: 0
  });
  const [recentGoals, setRecentGoals] = useState([]);
  const [recentHabits, setRecentHabits] = useState([]);

  const fetchDashboardData = async () => {
    try {
      // Fetch goals
      const goalsResponse = await apiClient.get('/goals');
      const goals = goalsResponse.data;
      
      // Fetch habits
      const habitsResponse = await apiClient.get('/habits');
      const habits = habitsResponse.data;
      
      // Calculate stats
      const completedGoals = goals.filter(goal => goal.isCompleted).length;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const completedHabitsToday = habits.filter(habit => {
        return habit.completedDates.some(date => {
          const completedDate = new Date(date);
          completedDate.setHours(0, 0, 0, 0);
          return completedDate.getTime() === today.getTime();
        });
      }).length;

      setStats({
        totalGoals: goals.length,
        completedGoals,
        totalHabits: habits.length,
        completedHabitsToday,
        recentJournalEntries: 0 // Will be updated when journal is implemented
      });

      // Get recent goals (last 3)
      setRecentGoals(goals.slice(0, 3));
      
      // Get recent habits (last 3)
      setRecentHabits(habits.slice(0, 3));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchDashboardData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  const getCompletionRate = () => {
    if (stats.totalGoals === 0) return 0;
    return Math.round((stats.completedGoals / stats.totalGoals) * 100);
  };

  const getHabitCompletionRate = () => {
    if (stats.totalHabits === 0) return 0;
    return Math.round((stats.completedHabitsToday / stats.totalHabits) * 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Your personal growth overview</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalGoals}</Text>
          <Text style={styles.statLabel}>Total Goals</Text>
          <Text style={styles.statSubtext}>{getCompletionRate()}% completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalHabits}</Text>
          <Text style={styles.statLabel}>Active Habits</Text>
          <Text style={styles.statSubtext}>{getHabitCompletionRate()}% today</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Goals', { screen: 'AddGoal' })}
          >
            <Text style={styles.actionButtonText}>Add Goal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Habits')}
          >
            <Text style={styles.actionButtonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Goals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Goals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentGoals.length > 0 ? (
          recentGoals.map((goal) => (
            <View key={goal._id} style={styles.itemCard}>
              <Text style={[styles.itemTitle, goal.isCompleted && styles.completedText]}>
                {goal.title}
              </Text>
              {goal.description && (
                <Text style={styles.itemDescription}>{goal.description}</Text>
              )}
              <Text style={styles.itemDate}>
                {new Date(goal.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No goals yet. Add your first goal!</Text>
        )}
      </View>

      {/* Recent Habits */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Habits</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Habits')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentHabits.length > 0 ? (
          recentHabits.map((habit) => (
            <View key={habit._id} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{habit.title}</Text>
              <Text style={styles.itemSubtext}>
                {habit.completedDates.length} times completed
              </Text>
              <Text style={styles.itemDate}>
                {new Date(habit.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No habits yet. Start building good habits!</Text>
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  statSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemSubtext: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default DashboardScreen;

