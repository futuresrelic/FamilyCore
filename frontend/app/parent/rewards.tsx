/**
 * Rewards Store Screen (Parent)
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
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ParentTheme, Typography } from '../../constants/theme';
import { rewardsAPI } from '../../services/api';

export default function RewardsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: rewardsAPI.getAll,
  });

  const deleteRewardMutation = useMutation({
    mutationFn: (rewardId: number) => rewardsAPI.delete(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      Alert.alert('Success', 'Reward deleted');
    },
  });

  const handleDelete = (reward: any) => {
    Alert.alert('Delete Reward', `Delete "${reward.reward_name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteRewardMutation.mutate(reward.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rewards Store</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button
          title="+ Add Reward"
          onPress={() => router.push('/parent/add-reward')}
          size="lg"
          style={styles.addButton}
        />

        {isLoading ? (
          <View style={styles.loading}>
            <Text>Loading rewards...</Text>
          </View>
        ) : rewards && rewards.length > 0 ? (
          rewards.map((reward: any) => (
            <Card key={reward.id} style={styles.rewardCard}>
              <View style={styles.rewardHeader}>
                <Text style={styles.rewardIcon}>{reward.icon || '🎁'}</Text>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardName}>{reward.reward_name}</Text>
                  {reward.description && (
                    <Text style={styles.rewardDesc}>{reward.description}</Text>
                  )}
                  <Text style={styles.rewardCost}>⭐ {reward.cost} points</Text>
                </View>
              </View>
              <View style={styles.rewardActions}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(reward)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        ) : (
          <Card>
            <Text style={styles.emptyText}>
              No rewards yet. Add rewards for your kids to redeem with their
              points!
            </Text>
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
  addButton: {
    marginBottom: ParentTheme.spacing.lg,
  },
  loading: {
    padding: ParentTheme.spacing.xl,
    alignItems: 'center',
  },
  rewardCard: {
    marginBottom: ParentTheme.spacing.md,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ParentTheme.spacing.sm,
  },
  rewardIcon: {
    fontSize: 40,
    marginRight: ParentTheme.spacing.md,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: 4,
  },
  rewardDesc: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
    marginBottom: 4,
  },
  rewardCost: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.primary,
    fontWeight: Typography.fontWeights.semibold,
  },
  rewardActions: {
    borderTopWidth: 1,
    borderTopColor: ParentTheme.colors.border,
    paddingTop: ParentTheme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
