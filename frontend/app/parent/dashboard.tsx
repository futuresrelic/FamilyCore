/**
 * Parent Dashboard Screen
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ParentTheme, Typography, Avatars } from '../../constants/theme';
import { useAuthStore, useKidsStore } from '../../state/store';
import { kidsAPI, analyticsAPI, choresAPI, aiAPI } from '../../services/api';

// Helper to display avatar - handles both emoji values and old keys
const getAvatarDisplay = (avatarId: string) => {
  // If it's already an emoji, return it
  if (avatarId && avatarId.length <= 2) return avatarId;
  // If it's a key like "default_8", convert to emoji
  return Avatars[avatarId as keyof typeof Avatars] || '😊';
};

export default function ParentDashboard() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { kids, setKids } = useKidsStore();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch kids
  const { data: kidsData, refetch: refetchKids } = useQuery({
    queryKey: ['kids'],
    queryFn: kidsAPI.getAll,
  });

  // Fetch dashboard analytics
  const { data: dashboardData, refetch: refetchDashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: analyticsAPI.getDashboard,
  });

  // Fetch pending chores
  const { data: pendingChores, refetch: refetchChores } = useQuery({
    queryKey: ['chores', 'pending'],
    queryFn: () => choresAPI.getAll(undefined, 'pending'),
  });

  useEffect(() => {
    if (kidsData) {
      setKids(kidsData);
    }
  }, [kidsData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchKids(),
      refetchDashboard(),
      refetchChores(),
    ]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
          router.replace('/login');
        },
      },
    ]);
  };

  const generateAIInsights = async () => {
    try {
      await aiAPI.generateInsights();
      Alert.alert('Success', 'New AI insights generated!');
      router.push('/parent/insights');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate insights');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.full_name || 'Parent'}!</Text>
          <Text style={styles.subtitle}>Here's your family overview</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        {dashboardData && (
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardData.completion_rate}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardData.completed_chores}</Text>
              <Text style={styles.statLabel}>Completed This Week</Text>
            </Card>

            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardData.points_earned}</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </Card>
          </View>
        )}

        {/* Kids Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Kids</Text>
            <Button
              title="+ Add Kid"
              onPress={() => router.push('/parent/add-kid')}
              size="sm"
              variant="secondary"
            />
          </View>

          {kids && kids.length > 0 ? (
            kids.map((kid) => (
              <Card key={kid.id} style={styles.kidCard}>
                <View style={styles.kidInfo}>
                  <Text style={styles.kidAvatar}>{getAvatarDisplay(kid.avatar_id)}</Text>
                  <View style={styles.kidDetails}>
                    <Text style={styles.kidName}>{kid.name}</Text>
                    <Text style={styles.kidStats}>
                      {kid.points} points • {kid.streak} day streak
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push(`/parent/kid/${kid.id}`)}
                  >
                    <Text style={styles.viewButton}>View</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          ) : (
            <Card>
              <Text style={styles.emptyText}>
                No kids added yet. Add your first kid to get started!
              </Text>
            </Card>
          )}
        </View>

        {/* Pending Chores */}
        {pendingChores && pendingChores.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Chores ({pendingChores.length})</Text>
            <Button
              title="Review Chores"
              onPress={() => router.push('/parent/chores')}
              variant="outline"
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.buttonGrid}>
            <Button
              title="📋 Manage Chores"
              onPress={() => router.push('/parent/chores')}
              variant="secondary"
              style={styles.gridButton}
            />

            <Button
              title="🎁 Rewards Store"
              onPress={() => router.push('/parent/rewards')}
              variant="secondary"
              style={styles.gridButton}
            />

            <Button
              title="📅 Calendar"
              onPress={() => router.push('/parent/calendar')}
              variant="secondary"
              style={styles.gridButton}
            />

            <Button
              title="🤖 AI Insights"
              onPress={generateAIInsights}
              variant="secondary"
              style={styles.gridButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParentTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ParentTheme.spacing.lg,
    paddingTop: ParentTheme.spacing.xxl,
    backgroundColor: ParentTheme.colors.surface,
    ...ParentTheme.shadows.sm,
  },
  greeting: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
    marginTop: 4,
  },
  logoutText: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.error,
    fontWeight: Typography.fontWeights.semibold,
  },
  scrollContent: {
    padding: ParentTheme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.md,
    marginBottom: ParentTheme.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    color: ParentTheme.colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: ParentTheme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ParentTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.md,
  },
  kidCard: {
    marginBottom: ParentTheme.spacing.md,
  },
  kidInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kidAvatar: {
    fontSize: 40,
    marginRight: ParentTheme.spacing.md,
  },
  kidDetails: {
    flex: 1,
  },
  kidName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: ParentTheme.colors.text,
  },
  kidStats: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
    marginTop: 4,
  },
  viewButton: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
  emptyText: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.textLight,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ParentTheme.spacing.md,
  },
  gridButton: {
    flex: 1,
    minWidth: '45%',
  },
});
