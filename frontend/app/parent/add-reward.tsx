/**
 * Add Reward Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { ParentTheme, Typography } from '../../constants/theme';
import { rewardsAPI } from '../../services/api';

const REWARD_ICONS = [
  '🎁', '🏆', '🎮', '🍕', '🍦', '🎬',
  '🎨', '⚽', '🎸', '📚', '🎯', '🎪',
  '🎢', '🎭', '🎤', '🏅', '💎', '🌟',
];

export default function AddRewardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [rewardName, setRewardName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎁');

  const addRewardMutation = useMutation({
    mutationFn: (data: any) => rewardsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      Alert.alert('Success', 'Reward added successfully!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to add reward');
    },
  });

  const handleSubmit = () => {
    if (!rewardName.trim()) {
      Alert.alert('Error', 'Please enter a reward name');
      return;
    }

    const costNum = parseInt(cost);
    if (!cost || isNaN(costNum) || costNum < 1) {
      Alert.alert('Error', 'Please enter a valid cost (minimum 1 point)');
      return;
    }

    addRewardMutation.mutate({
      reward_name: rewardName.trim(),
      description: description.trim() || null,
      cost: costNum,
      icon: selectedIcon,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Reward</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <Text style={styles.sectionTitle}>Reward Details</Text>

          <Input
            label="Reward Name *"
            value={rewardName}
            onChangeText={setRewardName}
            placeholder="e.g., Extra screen time, Ice cream trip"
          />

          <Input
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add more details about this reward"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Cost (points) *"
            value={cost}
            onChangeText={setCost}
            placeholder="How many points to redeem?"
            keyboardType="numeric"
          />
        </Card>

        <Card style={styles.iconCard}>
          <Text style={styles.sectionTitle}>Choose Icon</Text>
          <View style={styles.iconGrid}>
            {REWARD_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconSelected,
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Text style={styles.iconEmoji}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Button
          title="Add Reward"
          onPress={handleSubmit}
          loading={addRewardMutation.isPending}
          size="lg"
          style={styles.submitButton}
        />
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
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.md,
  },
  iconCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ParentTheme.spacing.md,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: ParentTheme.borderRadius.md,
    backgroundColor: ParentTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ParentTheme.colors.border,
  },
  iconSelected: {
    borderColor: ParentTheme.colors.primary,
    backgroundColor: ParentTheme.colors.primary + '20',
  },
  iconEmoji: {
    fontSize: 32,
  },
  submitButton: {
    marginTop: ParentTheme.spacing.xl,
  },
});
