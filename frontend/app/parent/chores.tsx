/**
 * Chores Management Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ParentTheme, Typography } from '../../constants/theme';
import { choresAPI, kidsAPI } from '../../services/api';

export default function ChoresScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('all');

  // Fetch all chores
  const { data: chores, isLoading } = useQuery({
    queryKey: ['chores'],
    queryFn: () => choresAPI.getAll(),
  });

  // Fetch kids for display
  const { data: kids } = useQuery({
    queryKey: ['kids'],
    queryFn: kidsAPI.getAll,
  });

  const approveChoreMutation = useMutation({
    mutationFn: (choreId: number) => choresAPI.approve(choreId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
      queryClient.invalidateQueries({ queryKey: ['kids'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      Alert.alert('Success', 'Chore approved and points awarded!');
    },
  });

  const deletechoreMutation = useMutation({
    mutationFn: (choreId: number) => choresAPI.delete(choreId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
      Alert.alert('Success', 'Chore deleted');
    },
  });

  const handleApprove = (chore: any) => {
    const kid = kids?.find((k: any) => k.id === chore.kid_id);
    Alert.alert(
      'Approve Chore',
      `Award ${chore.points} points to ${kid?.name || 'this kid'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => approveChoreMutation.mutate(chore.id),
        },
      ]
    );
  };

  const handleDelete = (chore: any) => {
    Alert.alert('Delete Chore', 'Are you sure you want to delete this chore?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteChoreMutation.mutate(chore.id),
      },
    ]);
  };

  const getKidName = (kidId: number) => {
    return kids?.find((k: any) => k.id === kidId)?.name || 'Unknown';
  };

  const filteredChores = chores?.filter((chore: any) => {
    if (filter === 'all') return true;
    return chore.status === filter;
  });

  const completedChores = filteredChores?.filter(
    (c: any) => c.status === 'completed'
  ) || [];
  const pendingChores = filteredChores?.filter(
    (c: any) => c.status === 'pending'
  ) || [];
  const approvedChores = filteredChores?.filter(
    (c: any) => c.status === 'approved'
  ) || [];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chores</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.tab, filter === 'all' && styles.tabActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[styles.tabText, filter === 'all' && styles.tabTextActive]}
            >
              All ({chores?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, filter === 'pending' && styles.tabActive]}
            onPress={() => setFilter('pending')}
          >
            <Text
              style={[
                styles.tabText,
                filter === 'pending' && styles.tabTextActive,
              ]}
            >
              Pending ({pendingChores.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, filter === 'completed' && styles.tabActive]}
            onPress={() => setFilter('completed')}
          >
            <Text
              style={[
                styles.tabText,
                filter === 'completed' && styles.tabTextActive,
              ]}
            >
              Completed ({completedChores.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Chore Button */}
        <Button
          title="+ Add Chore"
          onPress={() => router.push('/parent/add-chore')}
          size="lg"
          style={styles.addButton}
        />

        {/* Chores List */}
        {isLoading ? (
          <View style={styles.loading}>
            <Text>Loading chores...</Text>
          </View>
        ) : filteredChores && filteredChores.length > 0 ? (
          filteredChores.map((chore: any) => (
            <Card key={chore.id} style={styles.choreCard}>
              <View style={styles.choreHeader}>
                <View style={styles.choreInfo}>
                  <Text style={styles.choreTitle}>{chore.title}</Text>
                  <Text style={styles.choreKid}>
                    {getKidName(chore.kid_id)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    chore.status === 'completed' && styles.statusCompleted,
                    chore.status === 'approved' && styles.statusApproved,
                    chore.status === 'pending' && styles.statusPending,
                  ]}
                >
                  <Text style={styles.statusText}>{chore.status}</Text>
                </View>
              </View>

              {chore.description && (
                <Text style={styles.choreDesc}>{chore.description}</Text>
              )}

              <View style={styles.choreFooter}>
                <View style={styles.choreMeta}>
                  <Text style={styles.metaText}>⭐ {chore.points} points</Text>
                  <Text style={styles.metaText}>
                    {chore.difficulty.toUpperCase()}
                  </Text>
                  <Text style={styles.metaText}>
                    {chore.recurrence.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.choreActions}>
                  {chore.status === 'completed' && (
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprove(chore)}
                    >
                      <Text style={styles.approveButtonText}>✓ Approve</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(chore)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Card>
            <Text style={styles.emptyText}>No chores found</Text>
          </Card>
        )}
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
  filterTabs: {
    flexDirection: 'row',
    marginBottom: ParentTheme.spacing.lg,
    backgroundColor: ParentTheme.colors.surface,
    borderRadius: ParentTheme.borderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: ParentTheme.spacing.sm,
    alignItems: 'center',
    borderRadius: ParentTheme.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: ParentTheme.colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
    fontWeight: Typography.fontWeights.medium,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    marginBottom: ParentTheme.spacing.lg,
  },
  loading: {
    padding: ParentTheme.spacing.xl,
    alignItems: 'center',
  },
  choreCard: {
    marginBottom: ParentTheme.spacing.md,
  },
  choreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ParentTheme.spacing.sm,
  },
  choreInfo: {
    flex: 1,
  },
  choreTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: 4,
  },
  choreKid: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: ParentTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: ParentTheme.borderRadius.sm,
    backgroundColor: ParentTheme.colors.border,
  },
  statusPending: {
    backgroundColor: ParentTheme.colors.warning + '30',
  },
  statusCompleted: {
    backgroundColor: ParentTheme.colors.secondary + '30',
  },
  statusApproved: {
    backgroundColor: ParentTheme.colors.success + '30',
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    color: ParentTheme.colors.text,
    textTransform: 'uppercase',
  },
  choreDesc: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.sm,
  },
  choreFooter: {
    borderTopWidth: 1,
    borderTopColor: ParentTheme.colors.border,
    paddingTop: ParentTheme.spacing.sm,
    marginTop: ParentTheme.spacing.sm,
  },
  choreMeta: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.md,
    marginBottom: ParentTheme.spacing.sm,
  },
  metaText: {
    fontSize: Typography.fontSizes.xs,
    color: ParentTheme.colors.textLight,
  },
  choreActions: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.sm,
  },
  approveButton: {
    flex: 1,
    backgroundColor: ParentTheme.colors.success,
    paddingVertical: ParentTheme.spacing.sm,
    borderRadius: ParentTheme.borderRadius.sm,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontWeight: Typography.fontWeights.semibold,
    fontSize: Typography.fontSizes.sm,
  },
  deleteButton: {
    paddingVertical: ParentTheme.spacing.sm,
    paddingHorizontal: ParentTheme.spacing.md,
  },
  deleteButtonText: {
    color: ParentTheme.colors.error,
    fontWeight: Typography.fontWeights.medium,
    fontSize: Typography.fontSizes.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.textLight,
    textAlign: 'center',
    paddingVertical: ParentTheme.spacing.xl,
  },
});
