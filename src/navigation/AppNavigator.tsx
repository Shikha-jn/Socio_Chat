// src/navigation/AppNavigator.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/HomeScreen';
import { ChatsScreen } from '../screens/ChatsScreen';
import { LikesScreen } from '../screens/LikesScreen';
import { MyProfileScreen } from '../screens/MyProfileScreen';
import { ChatDetailScreen } from '../screens/ChatDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

import { Colors, Typography, Spacing, Shadow } from '../theme';
import { RootStackParamList, MainTabParamList } from '../types';
import { useChatStore } from '../hooks/useChatStore';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab icons
const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: '🏠', inactive: '🏠' },
  Likes: { active: '❤️', inactive: '🤍' },
  Chats: { active: '💬', inactive: '💬' },
  Feed: { active: '✨', inactive: '✨' },
  ProfileTab: { active: '👤', inactive: '👤' },
};

const TAB_LABELS: Record<string, string> = {
  Home: 'Home',
  Likes: 'Likes',
  Chats: 'Chats',
  Feed: 'Feed',
  ProfileTab: 'Profile',
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { totalUnread } = useChatStore();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || Spacing.md }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const icons = TAB_ICONS[route.name] || { active: '•', inactive: '•' };
        const label = TAB_LABELS[route.name] || route.name;
        const showBadge = route.name === 'Chats' && totalUnread > 0;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.tabIconWrap}>
              {isFocused && <View style={styles.tabActiveDot} />}
              <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                {isFocused ? icons.active : icons.inactive}
              </Text>
              {showBadge && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{totalUnread}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function FeedScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
      <Text style={{ fontSize: 40 }}>✨</Text>
      <Text style={{ fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.textPrimary, marginTop: Spacing.md }}>Feed</Text>
      <Text style={{ color: Colors.textMuted, marginTop: Spacing.sm }}>Coming soon</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Likes" component={LikesScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="ProfileTab" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="ChatDetail"
            component={ChatDetailScreen}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    ...Shadow.lg,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabIconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabActiveDot: {
    position: 'absolute',
    top: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.coral,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: Typography.weights.bold,
  },
});
