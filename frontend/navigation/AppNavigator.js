import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginBottom: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Goals') {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === 'Habits') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          }
          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Goals" component={GoalStack} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      {/* <Tab.Screen name="Journal" component={JournalScreen} /> */}
    </Tab.Navigator>
  );
};

export default AppNavigator;
