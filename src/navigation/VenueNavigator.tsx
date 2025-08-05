import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

// Import venue screens (we'll create these later)
import VenueDashboardScreen from '../screens/venue/VenueDashboardScreen';
import VenueEventsScreen from '../screens/venue/VenueEventsScreen';
import VenueAnalyticsScreen from '../screens/venue/VenueAnalyticsScreen';
import VenueProfileScreen from '../screens/venue/VenueProfileScreen';

const Tab = createBottomTabNavigator();

export default function VenueNavigator() {
  console.log('VenueNavigator rendered');
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'business' : 'business-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          shadowColor: COLORS.secondary,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: COLORS.surface,
          shadowColor: COLORS.secondary,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        headerTitleStyle: {
          color: COLORS.text,
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTintColor: COLORS.secondary,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={VenueDashboardScreen}
        options={{
          title: 'Venue Dashboard',
          headerShown: false,
        }}
        listeners={{
          tabPress: () => {
            console.log('Dashboard tab pressed');
          },
        }}
      />
      <Tab.Screen 
        name="Events" 
        component={VenueEventsScreen}
        options={{
          title: 'My Events',
          headerShown: false,
        }}
        listeners={{
          tabPress: () => {
            console.log('Events tab pressed');
          },
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={VenueAnalyticsScreen}
        options={{
          title: 'Analytics',
          headerShown: false,
        }}
        listeners={{
          tabPress: () => {
            console.log('Analytics tab pressed');
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={VenueProfileScreen}
        options={{
          title: 'Venue Profile',
          headerShown: false,
        }}
        listeners={{
          tabPress: () => {
            console.log('Profile tab pressed');
          },
        }}
      />
    </Tab.Navigator>
  );
} 