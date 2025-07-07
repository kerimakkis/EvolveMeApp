import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/client';
import GoalItem from '../components/GoalItem';

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
  
  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Button title="Add New Goal" onPress={() => navigation.navigate('AddGoal')} />
      <FlatList
        data={goals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <GoalItem goal={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No goals yet. Add one to get started!</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
});

export default GoalsScreen;
