// src/screens/ProfileScreen.tsx

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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { RootStackParamList } from '../types';
import { users } from '../data/mockData';

type Route = RouteProp<RootStackParamList, 'Profile'>;

const { width } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const user = users.find(u => u.id === route.params.userId) || users[0];

  const photos = [
    user.avatar,
    `https://picsum.photos/seed/${user.id}1/400/500`,
    `https://picsum.photos/seed/${user.id}2/400/500`,
    `https://picsum.photos/seed/${user.id}3/400/500`,
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>✕</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main photo */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: user.avatar }} style={styles.heroImage} />
          <View style={styles.heroGradient} />
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{user.name}, {user.age}</Text>
            {user.isOnline && (
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Active now</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Bio */}
          {user.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          )}

          {/* Tags */}
          {user.tags && user.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.tagsWrap}>
                {user.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Photos grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.photoGrid}>
              {photos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.gridPhoto} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actionsBar}>
        <TouchableOpacity style={[styles.actionBtn, styles.skipBtn]}>
          <Text style={styles.skipBtnText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]}>
          <Text style={styles.likeBtnText}>♥ Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backBtn: {
    position: 'absolute',
    top: Spacing.xl + 8,
    right: Spacing.base,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: Colors.white, fontSize: 16, fontWeight: Typography.weights.bold },
  heroWrap: { position: 'relative', height: SCREEN_HEIGHT * 0.55 },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroInfo: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.base,
  },
  heroName: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.online,
  },
  onlineText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  content: { padding: Spacing.base },
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  bioText: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary + '30',
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  tagText: {
    color: Colors.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridPhoto: {
    width: (width - Spacing.base * 2 - Spacing.sm) / 2,
    height: 160,
    borderRadius: Radius.lg,
    backgroundColor: Colors.sand,
  },
  actionsBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    paddingBottom: 28,
    gap: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flex: 0,
    width: 52,
  },
  skipBtnText: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  likeBtn: {
    backgroundColor: Colors.primary,
    ...Shadow.md,
  },
  likeBtnText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});

const SCREEN_HEIGHT = Dimensions.get('window').height;
