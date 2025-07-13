import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GoalItem = ({ goal, onUpdate, onDelete }) => {
  const handleDelete = () => {
    console.log('Delete button pressed for goal:', goal._id);
    onDelete && onDelete(goal._id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, goal.isCompleted && styles.completed]}>
          {goal.title}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionIcon}
            onPress={() => onUpdate && onUpdate(goal)}
          >
            <Ionicons name="create-outline" size={18} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionIcon}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.description}>{goal.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 6,
    marginLeft: 6,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default GoalItem;
