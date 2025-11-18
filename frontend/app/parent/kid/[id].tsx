/**
 * Kid Detail Screen
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { ParentTheme, Typography, Avatars } from '../../../constants/theme';
import { kidsAPI, analyticsAPI, choresAPI } from '../../../services/api';

// Helper to display avatar - handles both emoji values and old keys
const getAvatarDisplay = (avatarId: string) => {
  if (avatarId && avatarId.length <= 2) return avatarId;
  return Avatars[avatarId as keyof typeof Avatars] || '😊';
};

export default function KidDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const kidId = parseInt(id as string);

  // Fetch kid details
  const { data: kid, isLoading } = useQuery({
    queryKey: ['kid', kidId],
    queryFn: () => kidsAPI.getOne(kidId),
  });

  // Fetch kid history
  const { data: history } = useQuery({
    queryKey: ['kid-history', kidId],
    queryFn: () => analyticsAPI.getKidHistory(kidId, 30),
  });

  // Fetch kid's chores
  const { data: chores } = useQuery({
    queryKey: ['chores', kidId],
    queryFn: () => choresAPI.getAll(kidId),
  });

  const deleteKidMutation = useMutation({
    mutationFn: () => kidsAPI.delete(kidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kids'] });
      Alert.alert('Success', 'Kid removed successfully');
      router.back();
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Remove Kid',
      `Are you sure you want to remove ${kid?.name}? This will also delete all their chores.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteKidMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!kid) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loading}>
          <Text>Kid not found</Text>
        </View>
      </View>
    );
  }

  const pendingChores = chores?.filter((c: any) => c.status === 'pending') || [];
  const completedChores = chores?.filter((c: any) =>
    c.status === 'completed' || c.status === 'approved'
  ) || [];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{kid.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar & Stats */}
        <Card style={styles.profileCard}>
          <Text style={styles.avatar}>{getAvatarDisplay(kid.avatar_id)}</Text>
          <Text style={styles.name}>{kid.name}</Text>
          {kid.age && <Text style={styles.age}>{kid.age} years old</Text>}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{kid.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{kid.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedChores.length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </Card>

        {/* 30-Day Stats */}
        {history && (
          <Card style={styles.historyCard}>
            <Text style={styles.sectionTitle}>Last 30 Days</Text>
            <View style={styles.historyRow}>
              <View style={styles.historyItem}>
                <Text style={styles.historyLabel}>Total Chores</Text>
                <Text style={styles.historyValue}>{history.total_chores}</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyLabel}>Completed</Text>
                <Text style={styles.historyValue}>
                  {history.status_breakdown?.completed || 0}
                </Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyLabel}>Pending</Text>
                <Text style={styles.historyValue}>
                  {history.status_breakdown?.pending || 0}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Current Chores */}
        <Card style={styles.choresCard}>
          <Text style={styles.sectionTitle}>
            Current Chores ({pendingChores.length})
          </Text>
          {pendingChores.length > 0 ? (
            pendingChores.slice(0, 5).map((chore: any) => (
              <View key={chore.id} style={styles.choreItem}>
                <View style={styles.choreInfo}>
                  <Text style={styles.choreTitle}>{chore.title}</Text>
                  <Text style={styles.chorePoints}>⭐ {chore.points} points</Text>
                </View>
                <Text style={styles.choreStatus}>{chore.status}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No pending chores</Text>
          )}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="View All Chores"
            onPress={() => router.push('/parent/chores')}
            variant="secondary"
          />
          <Button
            title="Remove Kid"
            onPress={handleDelete}
            variant="outline"
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
            loading={deleteKidMutation.isPending}
          />
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  backButton: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
  },
  scrollContent: {
    padding: ParentTheme.spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: ParentTheme.spacing.xl,
  },
  avatar: {
    fontSize: 80,
    marginBottom: ParentTheme.spacing.md,
  },
  name: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.xs,
  },
  age: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.textLight,
    marginBottom: ParentTheme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.xl,
    marginTop: ParentTheme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
    marginTop: 4,
  },
  historyCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  historyItem: {
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
    marginBottom: 4,
  },
  historyValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
  },
  choresCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  choreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ParentTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ParentTheme.colors.border,
  },
  choreInfo: {
    flex: 1,
  },
  choreTitle: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.medium,
    color: ParentTheme.colors.text,
    marginBottom: 4,
  },
  chorePoints: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
  },
  choreStatus: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.primary,
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.textLight,
    textAlign: 'center',
    paddingVertical: ParentTheme.spacing.lg,
  },
  actions: {
    marginTop: ParentTheme.spacing.xl,
    gap: ParentTheme.spacing.md,
  },
  deleteButton: {
    borderColor: ParentTheme.colors.error,
  },
  deleteButtonText: {
    color: ParentTheme.colors.error,
  },
});
