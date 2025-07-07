import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from '../screens/DashboardScreen';
import GoalsScreen from '../screens/GoalsScreen';
import AddGoalScreen from '../screens/AddGoalScreen';
import HabitsScreen from '../screens/HabitsScreen';
// You would also import JournalScreen and AddHabitScreen here

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GoalStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GoalsList" component={GoalsScreen} options={{ title: 'My Goals' }} />
      <Stack.Screen name="AddGoal" component={AddGoalScreen} options={{ title: 'Add New Goal' }} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Goals" component={GoalStack} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      {/* <Tab.Screen name="Journal" component={JournalScreen} /> */}
    </Tab.Navigator>
  );
};

export default AppNavigator;
