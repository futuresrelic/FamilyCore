/**
 * Kid Dashboard Screen - Playful UI
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
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { KidTheme, Typography } from '../../constants/theme';
import { useAppStore } from '../../state/store';
import { choresAPI, aiAPI } from '../../services/api';
import { deleteItemAsync } from '../../utils/secureStorage';

export default function KidDashboard() {
  const router = useRouter();
  const { selectedKid, setSelectedKid } = useAppStore();
  const queryClient = useQueryClient();
  const [motivationMsg, setMotivationMsg] = useState('');

  // Fetch kid's chores
  const { data: chores, refetch } = useQuery({
    queryKey: ['chores', selectedKid?.id],
    queryFn: () => choresAPI.getAll(selectedKid?.id),
    enabled: !!selectedKid,
  });

  // Complete chore mutation
  const completeChoreMutation = useMutation({
    mutationFn: (choreId: number) => choresAPI.complete(choreId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
      Alert.alert('Awesome!', 'Great job completing your chore! 🎉');
      fetchMotivation();
    },
  });

  const handleLogout = async () => {
    Alert.alert('Logout', 'See you later! 👋', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await deleteItemAsync('kidId');
          setSelectedKid(null);
          router.replace('/mode-select');
        },
      },
    ]);
  };

  const fetchMotivation = async () => {
    if (selectedKid) {
      try {
        const response = await aiAPI.getMotivation(selectedKid.id);
        setMotivationMsg(response.message);
      } catch (error) {
        console.error('Failed to fetch motivation:', error);
      }
    }
  };

  const handleCompleteChore = (choreId: number, choreTitle: string) => {
    Alert.alert(
      'Complete Chore?',
      `Did you finish "${choreTitle}"?`,
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Yes, I Did It!',
          onPress: () => completeChoreMutation.mutate(choreId),
        },
      ]
    );
  };

  const pendingChores = chores?.filter((c: any) => c.status === 'pending') || [];
  const completedToday = chores?.filter((c: any) =>
    c.status === 'completed' || c.status === 'approved'
  ) || [];

  return (
    <LinearGradient
      colors={[KidTheme.colors.background, '#FFFFFF']}
      style={styles.container}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {selectedKid?.name}! 👋</Text>
          <Text style={styles.subtitle}>You're doing great!</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Points & Streak */}
        <Card theme="kid" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{selectedKid?.points || 0}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{selectedKid?.streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{completedToday.length}</Text>
              <Text style={styles.statLabel}>Done Today</Text>
            </View>
          </View>
        </Card>

        {/* Motivation Message */}
        {motivationMsg && (
          <Card theme="kid" style={styles.motivationCard}>
            <Text style={styles.motivationText}>{motivationMsg}</Text>
          </Card>
        )}

        {/* Your Chores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Chores 📋</Text>

          {pendingChores.length > 0 ? (
            pendingChores.map((chore: any) => (
              <TouchableOpacity
                key={chore.id}
                onPress={() => handleCompleteChore(chore.id, chore.title)}
              >
                <Card theme="kid" style={styles.choreCard}>
                  <View style={styles.choreContent}>
                    <View style={styles.choreLeft}>
                      <Text style={styles.choreTitle}>{chore.title}</Text>
                      {chore.description && (
                        <Text style={styles.choreDesc}>{chore.description}</Text>
                      )}
                      <View style={styles.choreMetadata}>
                        <Text style={styles.chorePoints}>⭐ {chore.points} points</Text>
                        <Text style={styles.choreDifficulty}>
                          {chore.difficulty === 'easy' && '😊 Easy'}
                          {chore.difficulty === 'medium' && '💪 Medium'}
                          {chore.difficulty === 'hard' && '🏆 Hard'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.choreButton}>
                      <Text style={styles.checkIcon}>✓</Text>
                      <Text style={styles.tapText}>Tap to finish!</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card theme="kid">
              <Text style={styles.emptyText}>
                🎉 All done! You're a superstar!
              </Text>
            </Card>
          )}
        </View>

        {/* Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards Store 🎁</Text>
          <Button
            title="See What You Can Get!"
            onPress={() => router.push('/kid/rewards')}
            theme="kid"
            size="lg"
          />
        </View>

        {/* Avatar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Avatar</Text>
          <Card theme="kid" style={styles.avatarCard}>
            <Text style={styles.avatarIcon}>{selectedKid?.avatar_id || '😊'}</Text>
            <Button
              title="Change Avatar"
              onPress={() => router.push('/kid/avatar')}
              theme="kid"
              variant="secondary"
            />
          </Card>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: KidTheme.spacing.lg,
    paddingTop: KidTheme.spacing.xxl,
  },
  greeting: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: KidTheme.colors.primary,
  },
  subtitle: {
    fontSize: Typography.fontSizes.base,
    color: KidTheme.colors.textLight,
    marginTop: 4,
  },
  logoutText: {
    fontSize: Typography.fontSizes.sm,
    color: KidTheme.colors.error,
    fontWeight: Typography.fontWeights.semibold,
  },
  scrollContent: {
    padding: KidTheme.spacing.lg,
  },
  statsCard: {
    marginBottom: KidTheme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: KidTheme.colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    color: KidTheme.colors.textLight,
    marginTop: 4,
  },
  motivationCard: {
    marginBottom: KidTheme.spacing.lg,
    backgroundColor: KidTheme.colors.surfaceAccent,
  },
  motivationText: {
    fontSize: Typography.fontSizes.lg,
    color: KidTheme.colors.text,
    textAlign: 'center',
    fontWeight: Typography.fontWeights.semibold,
  },
  section: {
    marginBottom: KidTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: KidTheme.colors.text,
    marginBottom: KidTheme.spacing.md,
  },
  choreCard: {
    marginBottom: KidTheme.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  choreContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  choreLeft: {
    flex: 1,
  },
  choreTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: KidTheme.colors.text,
    marginBottom: 4,
  },
  choreDesc: {
    fontSize: Typography.fontSizes.sm,
    color: KidTheme.colors.textLight,
    marginBottom: 8,
  },
  choreMetadata: {
    flexDirection: 'row',
    gap: 12,
  },
  chorePoints: {
    fontSize: Typography.fontSizes.sm,
    color: KidTheme.colors.star,
    fontWeight: Typography.fontWeights.semibold,
  },
  choreDifficulty: {
    fontSize: Typography.fontSizes.sm,
    color: KidTheme.colors.textLight,
  },
  choreButton: {
    alignItems: 'center',
    backgroundColor: KidTheme.colors.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: KidTheme.borderRadius.lg,
  },
  checkIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  tapText: {
    fontSize: Typography.fontSizes.xs,
    color: '#FFFFFF',
    marginTop: 4,
  },
  emptyText: {
    fontSize: Typography.fontSizes.lg,
    color: KidTheme.colors.text,
    textAlign: 'center',
    padding: KidTheme.spacing.lg,
  },
  avatarCard: {
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 80,
    marginBottom: KidTheme.spacing.md,
  },
});
