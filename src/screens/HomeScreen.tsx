// src/screens/HomeScreen.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { users } from '../data/mockData';
import { User } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.base * 2;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const discoverUsers = [...users].sort(() => Math.random() - 0.5);

const Tag: React.FC<{ label: string; color?: string }> = ({ label, color = Colors.primary }) => (
  <View style={[tagStyles.tag, { backgroundColor: color + '20', borderColor: color + '40' }]}>
    <Text style={[tagStyles.tagText, { color }]}>{label}</Text>
  </View>
);

const tagStyles = StyleSheet.create({
  tag: {
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tagText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
});

export const HomeScreen: React.FC = () => {
  const [cardStack, setCardStack] = useState<User[]>(discoverUsers.slice(0, 5));
  const [likedCount, setLikedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [lastAction, setLastAction] = useState<'like' | 'skip' | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchUser, setMatchUser] = useState<User | null>(null);

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-20deg', '0deg', '20deg'],
  });
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const skipOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const swipeRight = () => {
    setLastAction('like');
    setLikedCount(n => n + 1);
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setCardStack(prev => {
        const [, ...rest] = prev;
        // 30% chance of match
        if (Math.random() < 0.3 && prev[0]) {
          setMatchUser(prev[0]);
          setShowMatch(true);
        }
        return rest;
      });
    });
  };

  const swipeLeft = () => {
    setLastAction('skip');
    setSkippedCount(n => n + 1);
    Animated.timing(position, {
      toValue: { x: -(SCREEN_WIDTH + 100), y: 0 },
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setCardStack(prev => {
        const [, ...rest] = prev;
        return rest;
      });
    });
  };

  const currentUser = cardStack[0];
  const nextUser = cardStack[1];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>Socio</Text>
          <Text style={styles.logoStar}>★</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{likedCount}</Text>
          <Text style={styles.statLabel}>Liked</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{skippedCount}</Text>
          <Text style={styles.statLabel}>Skipped</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: Colors.primary }]}>{cardStack.length}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>

      {/* Card stack */}
      <View style={styles.cardArea}>
        {cardStack.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌟</Text>
            <Text style={styles.emptyTitle}>You've seen everyone!</Text>
            <Text style={styles.emptySubtitle}>Check back soon for new profiles</Text>
          </View>
        ) : (
          <>
            {/* Background card */}
            {nextUser && (
              <View style={[styles.card, styles.cardBehind]}>
                <Image source={{ uri: nextUser.avatar }} style={styles.cardImage} />
              </View>
            )}

            {/* Top card */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate },
                  ],
                },
              ]}
            >
              <Image source={{ uri: currentUser.avatar }} style={styles.cardImage} />

              {/* Like stamp */}
              <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
                <Text style={styles.stampText}>LIKE</Text>
              </Animated.View>

              {/* Skip stamp */}
              <Animated.View style={[styles.stamp, styles.skipStamp, { opacity: skipOpacity }]}>
                <Text style={[styles.stampText, { color: Colors.coral }]}>SKIP</Text>
              </Animated.View>

              {/* Card overlay info */}
              <View style={styles.cardOverlay}>
                <Text style={styles.cardName}>{currentUser.name}, {currentUser.age}</Text>
                {currentUser.bio && (
                  <Text style={styles.cardBio} numberOfLines={2}>{currentUser.bio}</Text>
                )}
                <View style={styles.tagsRow}>
                  {currentUser.tags?.map(tag => (
                    <Tag key={tag} label={tag} color={Colors.white} />
                  ))}
                </View>
              </View>
            </Animated.View>
          </>
        )}
      </View>

      {/* Actions */}
      {cardStack.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtnSm} onPress={() => {}}>
            <Text style={styles.actionSmIcon}>↩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.skipBtn]} onPress={swipeLeft}>
            <Text style={styles.actionBtnIcon}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.superBtn]} onPress={() => {}}>
            <Text style={styles.actionBtnIcon}>★</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={swipeRight}>
            <Text style={styles.actionBtnIcon}>♥</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnSm} onPress={() => {}}>
            <Text style={styles.actionSmIcon}>⚡</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Match modal */}
      {showMatch && matchUser && (
        <View style={styles.matchModal}>
          <View style={styles.matchCard}>
            <Text style={styles.matchEmoji}>🎉</Text>
            <Text style={styles.matchTitle}>It's a Match!</Text>
            <Text style={styles.matchSubtitle}>You and {matchUser.name} liked each other</Text>
            <View style={styles.matchAvatars}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.matchAvatar}
              />
              <View style={styles.matchHeartWrap}>
                <Text style={styles.matchHeart}>❤</Text>
              </View>
              <Image source={{ uri: matchUser.avatar }} style={styles.matchAvatar} />
            </View>
            <TouchableOpacity
              style={styles.matchSendBtn}
              onPress={() => setShowMatch(false)}
            >
              <Text style={styles.matchSendText}>Send a Message</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowMatch(false)}>
              <Text style={styles.matchKeepText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl + 8,
    paddingBottom: Spacing.sm,
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logoText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  logoStar: { fontSize: 16, color: Colors.gold },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  filterIcon: { fontSize: 18, color: Colors.textSecondary },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    gap: Spacing.xl,
  },
  stat: { alignItems: 'center' },
  statNum: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
    backgroundColor: Colors.sand,
    ...Shadow.lg,
  },
  cardBehind: {
    transform: [{ scale: 0.95 }, { translateY: 16 }],
    opacity: 0.8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    background: 'transparent',
    paddingBottom: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  cardBio: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: Spacing.sm,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  stamp: {
    position: 'absolute',
    top: 40,
    borderWidth: 4,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  likeStamp: {
    right: 20,
    borderColor: Colors.primary,
    transform: [{ rotate: '15deg' }],
  },
  skipStamp: {
    left: 20,
    borderColor: Colors.coral,
    transform: [{ rotate: '-15deg' }],
  },
  stampText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
    letterSpacing: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: 28,
    gap: Spacing.md,
  },
  actionBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  actionBtnSm: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  actionSmIcon: { fontSize: 18, color: Colors.textSecondary },
  skipBtn: { backgroundColor: Colors.white },
  superBtn: { backgroundColor: Colors.goldLight },
  likeBtn: { backgroundColor: Colors.primary },
  actionBtnIcon: { fontSize: 24, color: Colors.white },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  emptyEmoji: { fontSize: 60, marginBottom: Spacing.md },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  matchModal: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginHorizontal: Spacing.xxl,
    ...Shadow.lg,
  },
  matchEmoji: { fontSize: 48, marginBottom: Spacing.sm },
  matchTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  matchSubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  matchAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  matchAvatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: Colors.primary },
  matchHeartWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchHeart: { fontSize: 20 },
  matchSendBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  matchSendText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  matchKeepText: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
