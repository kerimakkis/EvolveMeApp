import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HabitItem = ({ habit, onComplete, onDelete }) => {
  const handleDelete = () => {
    console.log('Delete button pressed for habit:', habit._id);
    onDelete && onDelete(habit._id);
  };
  const isCompletedToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return habit.completedDates.some(date => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  const getCurrentStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
    let tempDate = new Date(today);
    
    while (true) {
      const isCompleted = habit.completedDates.some(date => {
        const completedDate = new Date(date);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === tempDate.getTime();
      });

      if (isCompleted) {
        currentStreak++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  const getLastCompletedDate = () => {
    if (habit.completedDates.length === 0) return null;
    
    const sortedDates = [...habit.completedDates].sort((a, b) => 
      new Date(b) - new Date(a)
    );
    
    return new Date(sortedDates[0]);
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    
    if (dateToCheck.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateToCheck.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return dateToCheck.toLocaleDateString();
    }
  };

  const completedToday = isCompletedToday();
  const currentStreak = getCurrentStreak();
  const lastCompleted = getLastCompletedDate();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{habit.title}</Text>
        <View style={styles.stats}>
          <Text style={styles.completionCount}>
            {habit.completedDates.length} times
          </Text>
          {currentStreak > 0 && (
            <Text style={styles.streak}>
              🔥 {currentStreak} day{currentStreak > 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.info}>
        {lastCompleted && (
          <Text style={styles.lastCompleted}>
            Last completed: {formatDate(lastCompleted)}
          </Text>
        )}
        {habit.completedDates.length === 0 && (
          <Text style={styles.noCompletions}>
            Not completed yet
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            completedToday && styles.completedButton
          ]}
          onPress={onComplete}
          disabled={completedToday}
        >
          <Text style={[
            styles.completeButtonText,
            completedToday && styles.completedButtonText
          ]}>
            {completedToday ? '✓ Completed' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  stats: {
    alignItems: 'flex-end',
  },
  completionCount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  streak: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginTop: 2,
  },
  info: {
    marginBottom: 15,
  },
  lastCompleted: {
    fontSize: 14,
    color: '#666',
  },
  noCompletions: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#34C759',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  completedButtonText: {
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HabitItem;

