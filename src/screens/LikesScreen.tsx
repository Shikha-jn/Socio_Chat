// src/screens/LikesScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { users } from '../data/mockData';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.base * 2 - Spacing.sm) / 2;

export const LikesScreen: React.FC = () => {
  const likedYou = users.slice(0, 6);
  const isPremium = false;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Likes</Text>
        <Text style={styles.headerCount}>{likedYou.length} people liked you</Text>
      </View>

      {!isPremium && (
        <View style={styles.premiumBanner}>
          <Text style={styles.premiumTitle}>👁 See who likes you</Text>
          <Text style={styles.premiumSub}>Upgrade to make matches instantly</Text>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>Upgrade · Save 50%</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {likedYou.map((user, i) => (
          <View key={user.id} style={styles.likeCard}>
            <Image
              source={{ uri: user.avatar }}
              style={[styles.likeImg, !isPremium && i > 1 && styles.blurred]}
            />
            {!isPremium && i > 1 ? (
              <View style={styles.lockOverlay}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
            ) : (
              <View style={styles.likeInfo}>
                <Text style={styles.likeName}>{user.name}, {user.age}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  headerCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  premiumBanner: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.base,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  premiumTitle: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  premiumSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  premiumBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  premiumBtnText: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: 100,
  },
  likeCard: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.3,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.sand,
    ...Shadow.sm,
  },
  likeImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurred: {
    opacity: 0.15,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.sand,
  },
  lockIcon: { fontSize: 36 },
  likeInfo: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  likeName: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});
