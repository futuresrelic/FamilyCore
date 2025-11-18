/**
 * Rewards Browse Screen (Kid Mode)
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
import { KidTheme, Typography } from '../../constants/theme';
import { rewardsAPI, kidsAPI } from '../../services/api';
import { useAppStore } from '../../state/store';

export default function KidRewardsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedKid = useAppStore((state) => state.selectedKid);

  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: rewardsAPI.getAll,
  });

  const { data: kid } = useQuery({
    queryKey: ['kid', selectedKid?.id],
    queryFn: () => kidsAPI.getOne(selectedKid!.id),
    enabled: !!selectedKid?.id,
  });

  const redeemRewardMutation = useMutation({
    mutationFn: (data: { kidId: number; rewardId: number }) =>
      rewardsAPI.redeem(data.kidId, data.rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kid', selectedKid?.id] });
      queryClient.invalidateQueries({ queryKey: ['kids'] });
      Alert.alert('🎉 Success!', 'Reward redeemed! Ask your parent to give it to you!');
    },
    onError: (error: any) => {
      Alert.alert('Oops!', error.response?.data?.detail || 'Not enough points!');
    },
  });

  const handleRedeem = (reward: any) => {
    if (!kid || !selectedKid) {
      Alert.alert('Error', 'Please select a kid profile first');
      return;
    }

    if (kid.points < reward.cost) {
      Alert.alert(
        'Not Enough Points',
        `You need ${reward.cost} points but only have ${kid.points} points. Complete more chores to earn points!`
      );
      return;
    }

    Alert.alert(
      '🎁 Redeem Reward?',
      `Do you want to redeem "${reward.reward_name}" for ${reward.cost} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () =>
            redeemRewardMutation.mutate({
              kidId: selectedKid.id,
              rewardId: reward.id,
            }),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎁 Rewards Store</Text>
        <View style={{ width: 60 }} />
      </View>

      {kid && (
        <View style={styles.pointsBanner}>
          <Text style={styles.pointsLabel}>Your Points</Text>
          <Text style={styles.pointsValue}>⭐ {kid.points}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Loading rewards...</Text>
          </View>
        ) : rewards && rewards.length > 0 ? (
          <View style={styles.rewardsGrid}>
            {rewards.map((reward: any) => {
              const canAfford = kid && kid.points >= reward.cost;
              return (
                <Card key={reward.id} style={styles.rewardCard}>
                  <View style={styles.rewardContent}>
                    <Text style={styles.rewardIcon}>{reward.icon || '🎁'}</Text>
                    <Text style={styles.rewardName}>{reward.reward_name}</Text>
                    {reward.description && (
                      <Text style={styles.rewardDesc}>{reward.description}</Text>
                    )}
                    <View style={styles.costContainer}>
                      <Text style={styles.rewardCost}>⭐ {reward.cost}</Text>
                      {!canAfford && (
                        <Text style={styles.needMore}>
                          Need {reward.cost - (kid?.points || 0)} more
                        </Text>
                      )}
                    </View>
                    <Button
                      title={canAfford ? 'Redeem' : 'Not Enough Points'}
                      onPress={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      loading={redeemRewardMutation.isPending}
                      size="sm"
                      style={[
                        styles.redeemButton,
                        !canAfford && styles.disabledButton,
                      ]}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card>
            <Text style={styles.emptyText}>
              No rewards available yet. Ask your parent to add some rewards!
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
    backgroundColor: KidTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: KidTheme.spacing.lg,
    paddingTop: KidTheme.spacing.xxl,
    backgroundColor: KidTheme.colors.surface,
    ...KidTheme.shadows.md,
  },
  backButton: {
    fontSize: Typography.fontSizes.base,
    color: KidTheme.colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: KidTheme.colors.text,
  },
  pointsBanner: {
    backgroundColor: KidTheme.colors.primary,
    padding: KidTheme.spacing.lg,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.medium,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: KidTheme.spacing.lg,
  },
  loading: {
    padding: KidTheme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSizes.base,
    color: KidTheme.colors.textLight,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: KidTheme.spacing.md,
  },
  rewardCard: {
    width: '48%',
    marginBottom: 0,
  },
  rewardContent: {
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 60,
    marginBottom: KidTheme.spacing.sm,
  },
  rewardName: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.bold,
    color: KidTheme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  rewardDesc: {
    fontSize: Typography.fontSizes.xs,
    color: KidTheme.colors.textLight,
    textAlign: 'center',
    marginBottom: KidTheme.spacing.sm,
  },
  costContainer: {
    alignItems: 'center',
    marginBottom: KidTheme.spacing.sm,
  },
  rewardCost: {
    fontSize: Typography.fontSizes.lg,
    color: KidTheme.colors.primary,
    fontWeight: Typography.fontWeights.bold,
  },
  needMore: {
    fontSize: Typography.fontSizes.xs,
    color: KidTheme.colors.error,
    marginTop: 2,
  },
  redeemButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyText: {
    fontSize: Typography.fontSizes.base,
    color: KidTheme.colors.textLight,
    textAlign: 'center',
    paddingVertical: KidTheme.spacing.xl,
  },
});
