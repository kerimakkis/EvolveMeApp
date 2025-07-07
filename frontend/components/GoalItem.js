import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GoalItem = ({ goal }) => {
  // You would add functionality here to update/delete the goal
  return (
    <View style={styles.card}>
      <Text style={[styles.title, goal.isCompleted && styles.completed]}>
        {goal.title}
      </Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default GoalItem;
