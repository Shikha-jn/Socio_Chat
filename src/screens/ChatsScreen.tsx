// src/screens/ChatsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { Avatar } from '../components/Avatar';
import { useChatStore } from '../hooks/useChatStore';
import { RootStackParamList, Conversation } from '../types';
import { recentMatches } from '../data/mockData';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type Nav = StackNavigationProp<RootStackParamList>;

function formatTime(iso: string): string {
  const d = dayjs(iso);
  const now = dayjs();
  if (now.diff(d, 'minute') < 60) return `${now.diff(d, 'minute')}m`;
  if (now.diff(d, 'hour') < 24) return `${now.diff(d, 'hour')}h`;
  return d.format('MMM D');
}

export const ChatsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { conversations } = useChatStore();
  const [search, setSearch] = useState('');

  const filtered = conversations.filter(conv => {
    const other = conv.participants.find(p => p.id !== 'me');
    return other?.name.toLowerCase().includes(search.toLowerCase());
  });

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherUser = item.participants.find(p => p.id !== 'me')!;
    const isUnread = item.unreadCount > 0;
    const lastMsgText = item.lastMessage?.senderId === 'me'
      ? `You: ${item.lastMessage.text}`
      : item.lastMessage?.text || 'Say hello! 👋';

    return (
      <TouchableOpacity
        style={styles.conversationRow}
        onPress={() =>
          navigation.navigate('ChatDetail', {
            conversationId: item.id,
            user: otherUser,
          })
        }
        activeOpacity={0.7}
      >
        <Avatar uri={otherUser.avatar} size={56} showOnline isOnline={otherUser.isOnline} />
        <View style={styles.convInfo}>
          <View style={styles.convHeader}>
            <Text style={[styles.convName, isUnread && styles.convNameBold]}>
              {otherUser.name}
            </Text>
            <Text style={[styles.convTime, isUnread && { color: Colors.primary }]}>
              {item.lastMessage ? formatTime(item.lastMessage.timestamp) : ''}
            </Text>
          </View>
          <View style={styles.convMeta}>
            <Text
              style={[styles.convPreview, isUnread && styles.convPreviewBold]}
              numberOfLines={1}
            >
              {lastMsgText}
            </Text>
            {isUnread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      {/* Recent Matches */}
      <View style={styles.matchesSection}>
        <Text style={styles.sectionLabel}>Recent Matches</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchesRow}>
          {recentMatches.map(user => (
            <TouchableOpacity key={user.id} style={styles.matchItem} activeOpacity={0.8}>
              <View style={styles.matchAvatarWrap}>
                <Avatar uri={user.avatar} size={68} showOnline isOnline={user.isOnline} />
              </View>
              <Text style={styles.matchName} numberOfLines={1}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Conversations */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl + 8,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  matchesSection: {
    paddingBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  matchesRow: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  matchItem: {
    alignItems: 'center',
    width: 76,
  },
  matchAvatarWrap: {
    padding: 2,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 5,
  },
  matchName: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  searchWrap: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.sm,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  convInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  convName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  convNameBold: {
    fontWeight: Typography.weights.bold,
  },
  convTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  convMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  convPreview: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  convPreviewBold: {
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderLight,
    marginLeft: 72,
  },
});
