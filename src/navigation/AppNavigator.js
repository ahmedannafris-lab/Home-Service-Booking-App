import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from '../components';
import { colors, fontSizes, spacing } from '../theme';
import { AdminProvider } from '../context/AdminContext';

// Profile & Admin Flow Screens
import { ProfileMainScreen } from '../screens/profile/ProfileMainScreen';
import { AdminPortalScreen } from '../screens/profile/AdminPortalScreen';
import { ServiceProvidersScreen } from '../screens/profile/ServiceProvidersScreen';
import { ProviderVerificationScreen } from '../screens/profile/ProviderVerificationScreen';
import { UserManagementScreen } from '../screens/profile/UserManagementScreen';
import { ManageUserScreen } from '../screens/profile/ManageUserScreen';
import { AdminPlaceholderScreen } from '../screens/profile/AdminPlaceholderScreen';

const Tabs = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const BookingsStack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function PlaceholderScreen({ title, description }) {
  return (
    <View style={styles.screen}>
      <Header title={title} />
      <View style={styles.placeholder}>
        <View style={styles.placeholderIcon}>
          <Ionicons name="construct-outline" size={28} color={colors.primary} />
        </View>
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderText}>{description}</Text>
      </View>
    </View>
  );
}

function makeStack(Stack, screenName, title, description) {
  return function TabStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={screenName}>
          {() => <PlaceholderScreen title={title} description={description} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };
}

const HomeStackScreen = makeStack(
  HomeStack,
  'HomeMain',
  'Home',
  'Find trusted help for your home.'
);

const BookingsStackScreen = makeStack(
  BookingsStack,
  'BookingsMain',
  'Bookings',
  'Your upcoming service appointments will appear here.'
);

const MessagesStackScreen = makeStack(
  MessagesStack,
  'MessagesMain',
  'Messages',
  'Conversations with your service providers will appear here.'
);

const HistoryStackScreen = makeStack(
  HistoryStack,
  'HistoryMain',
  'History',
  'Completed and past bookings will appear here.'
);

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileMainScreen} />
      <ProfileStack.Screen name="AdminPortal" component={AdminPortalScreen} />
      <ProfileStack.Screen
        name="ServiceProviders"
        component={ServiceProvidersScreen}
      />
      <ProfileStack.Screen
        name="ProviderVerification"
        component={ProviderVerificationScreen}
      />
      <ProfileStack.Screen
        name="UserManagement"
        component={UserManagementScreen}
      />
      <ProfileStack.Screen name="ManageUser" component={ManageUserScreen} />
      <ProfileStack.Screen
        name="AdminPlaceholder"
        component={AdminPlaceholderScreen}
      />
    </ProfileStack.Navigator>
  );
}

const tabIcons = {
  Home: ['home-outline', 'home'],
  Bookings: ['calendar-outline', 'calendar'],
  Messages: ['chatbubble-ellipses-outline', 'chatbubble-ellipses'],
  History: ['time-outline', 'time'],
  Profile: ['person-outline', 'person'],
};

export function AppNavigator() {
  return (
    <AdminProvider>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, focused, size }) => {
            const [outline, filled] = tabIcons[route.name];
            return (
              <Ionicons
                name={focused ? filled : outline}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tabs.Screen name="Home" component={HomeStackScreen} />
        <Tabs.Screen name="Bookings" component={BookingsStackScreen} />
        <Tabs.Screen name="Messages" component={MessagesStackScreen} />
        <Tabs.Screen name="History" component={HistoryStackScreen} />
        <Tabs.Screen name="Profile" component={ProfileStackScreen} />
      </Tabs.Navigator>
    </AdminProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    marginBottom: spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  placeholderTitle: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  placeholderText: {
    maxWidth: 280,
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 22,
    textAlign: 'center',
  },
  tabBar: {
    height: 64,
    paddingTop: 6,
    paddingBottom: 6,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});