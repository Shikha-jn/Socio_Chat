// src/screens/ChatDetailScreen.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { Avatar } from '../components/Avatar';
import { useChatStore, sendMessageGlobal, markAsReadGlobal } from '../hooks/useChatStore';
import { RootStackParamList, Message } from '../types';
import dayjs from 'dayjs';

type Route = RouteProp<RootStackParamList, 'ChatDetail'>;

function groupMessages(messages: Message[]): (Message | { type: 'date'; label: string; id: string })[] {
  const result: (Message | { type: 'date'; label: string; id: string })[] = [];
  let lastDate = '';
  messages.forEach(msg => {
    const dateLabel = dayjs(msg.timestamp).format('MMM D');
    if (dateLabel !== lastDate) {
      result.push({ type: 'date', label: dateLabel, id: `date_${dateLabel}` });
      lastDate = dateLabel;
    }
    result.push(msg);
  });
  return result;
}

function formatMsgTime(iso: string): string {
  return dayjs(iso).format('h:mm A');
}

const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );
    const a1 = anim(dot1, 0);
    const a2 = anim(dot2, 200);
    const a3 = anim(dot3, 400);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  return (
    <View style={typingStyles.container}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[typingStyles.dot, { transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );
};

const typingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
});

export const ChatDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { conversationId, user } = route.params;

  const { getMessages } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const messages = getMessages(conversationId);
  const grouped = groupMessages(messages);

  useEffect(() => {
    markAsReadGlobal(conversationId);
  }, [conversationId]);

  useEffect(() => {
    // Show typing indicator when user is sending
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.senderId === 'me') {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2500);
      }
    }
  }, [messages.length]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    sendMessageGlobal(conversationId, text);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText, conversationId]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateLabel}>{item.label}</Text>
        </View>
      );
    }

    const msg = item as Message;
    const isMine = msg.senderId === 'me';

    return (
      <View style={[styles.msgRow, isMine ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isMine && (
          <Avatar uri={user.avatar} size={30} style={{ marginRight: 8, alignSelf: 'flex-end' }} />
        )}
        <View style={styles.msgMeta}>
          <View style={[styles.bubble, isMine ? styles.bubbleSent : styles.bubbleReceived]}>
            <Text style={[styles.bubbleText, isMine ? styles.bubbleTextSent : styles.bubbleTextReceived]}>
              {msg.text}
            </Text>
          </View>
          <Text style={[styles.msgTime, isMine && styles.msgTimeRight]}>
            {formatMsgTime(msg.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfo}
          onPress={() => (navigation as any).navigate('Profile', { userId: user.id })}
          activeOpacity={0.7}
        >
          <Avatar uri={user.avatar} size={40} showOnline isOnline={user.isOnline} />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{user.name}, {user.age}</Text>
            <Text style={styles.headerStatus}>
              {user.isOnline ? '● Online' : `Last seen ${user.lastSeen || 'recently'}`}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Text style={styles.headerActionIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={grouped}
          keyExtractor={item => (item as any).id || (item as Message).id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.msgRow, styles.msgRowLeft, { marginBottom: Spacing.sm }]}>
                <Avatar uri={user.avatar} size={30} style={{ marginRight: 8, alignSelf: 'flex-end' }} />
                <View style={[styles.bubble, styles.bubbleReceived, { paddingVertical: 12 }]}>
                  <TypingIndicator />
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View style={styles.inputWrap}>
          <TouchableOpacity style={styles.attachBtn}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
            returnKeyType="default"
          />
          {inputText.trim().length > 0 ? (
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
              <Text style={styles.sendIcon}>↑</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.emojiBtn}>
              <Text style={styles.emojiIcon}>😊</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl + 4,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  backArrow: {
    fontSize: 32,
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: Spacing.sm,
  },
  headerName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  headerStatus: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  headerAction: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionIcon: {
    fontSize: 22,
    color: Colors.textSecondary,
    letterSpacing: -2,
  },
  messagesList: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dateLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    backgroundColor: Colors.sand,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    maxWidth: '80%',
  },
  msgRowLeft: {
    alignSelf: 'flex-start',
  },
  msgRowRight: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  msgMeta: {
    maxWidth: '100%',
  },
  bubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.lg,
    maxWidth: 280,
  },
  bubbleSent: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    ...Shadow.sm,
  },
  bubbleReceived: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    ...Shadow.sm,
  },
  bubbleText: {
    fontSize: Typography.sizes.base,
    lineHeight: 22,
  },
  bubbleTextSent: {
    color: Colors.white,
  },
  bubbleTextReceived: {
    color: Colors.textPrimary,
  },
  msgTime: {
    fontSize: Typography.sizes.xs - 1,
    color: Colors.textMuted,
    marginTop: 3,
    marginLeft: 4,
  },
  msgTimeRight: {
    textAlign: 'right',
    marginRight: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  attachIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    maxHeight: 120,
    ...Shadow.sm,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  sendIcon: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  emojiBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  emojiIcon: {
    fontSize: 20,
  },
});
