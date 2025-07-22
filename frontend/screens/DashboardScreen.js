import React, { useState, useEffect, useCallback, useContext } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from '../components/LogoutButton';
import LanguageSelector from '../components/LanguageSelector';
import { showToast, toastMessages } from '../utils/toastUtils';
import apiClient from '../api/client';

const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
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

  const handleUpdateGoal = (goal) => {
    navigation.navigate('Goals', { 
      screen: 'AddGoal', 
      params: { 
        goalId: goal._id,
        title: goal.title,
        description: goal.description,
        isEditing: true 
      }
    });
  };

  const handleDeleteGoal = (goalId) => {
    console.log('Dashboard: Attempting to delete goal with ID:', goalId);
    
    // Toast confirmation dialog
    showToast.confirm(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      () => {
        console.log('Dashboard: Delete confirmed for goal:', goalId);
        deleteGoal(goalId);
      },
      () => {
        console.log('Dashboard: Delete cancelled for goal:', goalId);
      }
    );
  };

  const deleteGoal = async (goalId) => {
    try {
      console.log('Dashboard: Making DELETE request to:', `/goals/${goalId}`);
      const response = await apiClient.delete(`/goals/${goalId}`);
      console.log('Dashboard: Delete goal response:', response);
      fetchDashboardData(); // Refresh data
      toastMessages.goalDeleted();
    } catch (error) {
      console.error('Dashboard: Failed to delete goal:', error);
      console.error('Dashboard: Error response:', error.response?.data);
      console.error('Dashboard: Error status:', error.response?.status);
      toastMessages.goalDeleteError(error.response?.data?.msg || error.message);
    }
  };

  const handleUpdateHabit = (habit) => {
    // Navigate to habits screen with edit mode
    navigation.navigate('Habits', { 
      habitId: habit._id,
      title: habit.title,
      isEditing: true 
    });
  };

  const handleDeleteHabit = (habitId) => {
    console.log('Dashboard: Attempting to delete habit with ID:', habitId);
    
    // Toast confirmation dialog
    showToast.confirm(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      () => {
        console.log('Dashboard: Delete confirmed for habit:', habitId);
        deleteHabit(habitId);
      },
      () => {
        console.log('Dashboard: Delete cancelled for habit:', habitId);
      }
    );
  };

  const deleteHabit = async (habitId) => {
    try {
      const response = await apiClient.delete(`/habits/${habitId}`);
      console.log('Dashboard: Delete response:', response);
      fetchDashboardData(); // Refresh data
      toastMessages.habitDeleted();
    } catch (error) {
      console.error('Dashboard: Failed to delete habit:', error);
      console.error('Dashboard: Error response:', error.response?.data);
      toastMessages.habitDeleteError(error.response?.data?.msg || error.message);
    }
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t('common.loading_progress')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>{t('dashboard')}</Text>
            <Text style={styles.subtitle}>{t('personal_growth_overview')}</Text>
          </View>
          <View style={styles.headerActions}>
            <LanguageSelector />
            <LogoutButton />
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalGoals}</Text>
          <Text style={styles.statLabel}>{t('total_goals')}</Text>
          <Text style={styles.statSubtext}>{getCompletionRate()}% {t('completed')}</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalHabits}</Text>
          <Text style={styles.statLabel}>{t('active_habits')}</Text>
          <Text style={styles.statSubtext}>{getHabitCompletionRate()}% {t('today')}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('quick_actions')}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Goals', { screen: 'AddGoal' })}
          >
            <Text style={styles.actionButtonText}>{t('add_goal', { ns: 'goals' })}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Habits')}
          >
            <Text style={styles.actionButtonText}>{t('add_habit', { ns: 'habits' })}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Goals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recent_goals')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
            <Text style={styles.seeAllText}>{t('see_all')}</Text>
          </TouchableOpacity>
        </View>
        
        {recentGoals.length > 0 ? (
          recentGoals.map((goal) => (
            <View key={goal._id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemTitle, goal.isCompleted && styles.completedText]}>
                  {goal.title}
                </Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.actionIcon}
                    onPress={() => handleUpdateGoal(goal)}
                  >
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionIcon}
                    onPress={() => handleDeleteGoal(goal._id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
              {goal.description && (
                <Text style={styles.itemDescription}>{goal.description}</Text>
              )}
              <Text style={styles.itemDate}>
                {new Date(goal.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t('no_goals', { ns: 'goals' })}</Text>
        )}
      </View>

      {/* Recent Habits */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recent_habits')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Habits')}>
            <Text style={styles.seeAllText}>{t('see_all')}</Text>
          </TouchableOpacity>
        </View>
        
        {recentHabits.length > 0 ? (
          recentHabits.map((habit) => (
            <View key={habit._id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{habit.title}</Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.actionIcon}
                    onPress={() => handleUpdateHabit(habit)}
                  >
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionIcon}
                    onPress={() => handleDeleteHabit(habit._id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.itemSubtext}>
                {habit.completedDates.length} {t('times_completed')}
              </Text>
              <Text style={styles.itemDate}>
                {new Date(habit.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t('no_habits', { ns: 'habits' })}</Text>
        )}
      </View>

      <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* FAB butonunu kaldırdım */}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
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

export default DashboardScreen;

