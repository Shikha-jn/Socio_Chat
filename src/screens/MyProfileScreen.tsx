// src/screens/MyProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Switch,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { currentUser } from '../data/mockData';

const { width } = Dimensions.get('window');

export const MyProfileScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [showDistance, setShowDistance] = useState(true);

  const profileCompletion = 68;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Text style={styles.editAvatarIcon}>✏</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{currentUser.name}, {currentUser.age}</Text>
          <View style={styles.verifiedRow}>
            <Text style={styles.profileBio}>{currentUser.bio}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Completion */}
        <View style={styles.completionCard}>
          <View style={styles.completionInfo}>
            <Text style={styles.completionLabel}>Complete your profile to stand out</Text>
            <Text style={styles.completionPct}>{profileCompletion}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${profileCompletion}%` }]} />
          </View>
        </View>

        {/* Premium upgrade */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumLeft}>
            <View style={styles.premiumIconWrap}>
              <Text style={styles.premiumIcon}>👑</Text>
            </View>
            <View>
              <Text style={styles.premiumTitle}>Socio Gold</Text>
              <Text style={styles.premiumSub}>Get seen by 3x more people</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Profile Visits', value: '128', icon: '👁' },
            { label: 'Likes', value: '47', icon: '❤️' },
            { label: 'Matches', value: '12', icon: '⚡' },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Boosts & Gifts */}
        <View style={styles.boostsRow}>
          <View style={[styles.boostCard, { flex: 1 }]}>
            <Text style={styles.boostEmoji}>⚡</Text>
            <Text style={styles.boostNum}>11 Boosts</Text>
            <Text style={styles.boostDesc}>Get seen by 11x more people</Text>
          </View>
          <View style={[styles.boostCard, { flex: 1 }]}>
            <Text style={styles.boostEmoji}>🎁</Text>
            <Text style={styles.boostNum}>0 Gifts</Text>
            <Text style={styles.boostDesc}>2x as likely to lead to date</Text>
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.settingsHeader}>Preferences</Text>
        <View style={styles.settingsCard}>
          {[
            { label: 'Notifications', value: notifications, onToggle: setNotifications },
            { label: 'Show distance', value: showDistance, onToggle: setShowDistance },
          ].map((item, i) => (
            <View key={item.label} style={[styles.settingRow, i > 0 && styles.settingBorder]}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={item.value ? Colors.primary : Colors.white}
              />
            </View>
          ))}
          {[
            { label: 'Edit Profile', icon: '✏️' },
            { label: 'Privacy Settings', icon: '🔒' },
            { label: 'Help & Support', icon: '💬' },
            { label: 'Log Out', icon: '🚪', danger: true },
          ].map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.settingRow, styles.settingBorder]}
              activeOpacity={0.7}
            >
              <Text style={[styles.settingLabel, item.danger && { color: Colors.coral }]}>
                {item.icon} {item.label}
              </Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  settingsIcon: { fontSize: 18 },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  editAvatarIcon: { fontSize: 12, color: Colors.white },
  profileName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  profileBio: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  editBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  editBtnText: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.sm,
  },
  completionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  completionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  completionLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  completionPct: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.sand,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  premiumCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  premiumLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  premiumIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: { fontSize: 20 },
  premiumTitle: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.base,
  },
  premiumSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.sizes.xs,
  },
  upgradeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  upgradeBtnText: {
    color: Colors.white,
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.sm,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  boostsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  boostCard: {
    backgroundColor: Colors.primaryPale,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'center',
  },
  boostEmoji: { fontSize: 24, marginBottom: 4 },
  boostNum: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  boostDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    textAlign: 'center',
  },
  settingsHeader: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  settingBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  settingLabel: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  settingArrow: {
    fontSize: Typography.sizes.xl,
    color: Colors.textMuted,
  },
});
