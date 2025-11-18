/**
 * Add Chore Screen
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
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { ParentTheme, Typography } from '../../constants/theme';
import { choresAPI, kidsAPI } from '../../services/api';

export default function AddChoreScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [kidId, setKidId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('10');
  const [difficulty, setDifficulty] = useState('easy');
  const [recurrence, setRecurrence] = useState('once');

  // Fetch kids
  const { data: kids } = useQuery({
    queryKey: ['kids'],
    queryFn: kidsAPI.getAll,
  });

  const addChoreMutation = useMutation({
    mutationFn: (data: any) => choresAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
      Alert.alert('Success', 'Chore created successfully!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to create chore');
    },
  });

  const handleSubmit = () => {
    if (!kidId) {
      Alert.alert('Error', 'Please select a kid');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a chore title');
      return;
    }

    const pointsNum = parseInt(points);
    if (isNaN(pointsNum) || pointsNum < 1 || pointsNum > 100) {
      Alert.alert('Error', 'Please enter valid points (1-100)');
      return;
    }

    addChoreMutation.mutate({
      kid_id: kidId,
      title: title.trim(),
      description: description.trim() || null,
      points: pointsNum,
      difficulty,
      recurrence,
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
        <Text style={styles.title}>Add Chore</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <Text style={styles.sectionTitle}>Assign To</Text>
          <View style={styles.kidsGrid}>
            {kids && kids.length > 0 ? (
              kids.map((kid: any) => (
                <TouchableOpacity
                  key={kid.id}
                  style={[
                    styles.kidOption,
                    kidId === kid.id && styles.kidSelected,
                  ]}
                  onPress={() => setKidId(kid.id)}
                >
                  <Text style={styles.kidAvatar}>{kid.avatar_id}</Text>
                  <Text style={styles.kidName}>{kid.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noKidsText}>
                No kids added yet. Add a kid first!
              </Text>
            )}
          </View>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Chore Details</Text>

          <Input
            label="Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Clean your room"
          />

          <Input
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about the chore"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Points *"
            value={points}
            onChangeText={setPoints}
            placeholder="10"
            keyboardType="numeric"
          />
        </Card>

        <Card style={styles.optionsCard}>
          <Text style={styles.sectionTitle}>Difficulty</Text>
          <View style={styles.optionsRow}>
            {['easy', 'medium', 'hard'].map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.optionButton,
                  difficulty === diff && styles.optionSelected,
                ]}
                onPress={() => setDifficulty(diff)}
              >
                <Text
                  style={[
                    styles.optionText,
                    difficulty === diff && styles.optionTextSelected,
                  ]}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.optionsCard}>
          <Text style={styles.sectionTitle}>Recurrence</Text>
          <View style={styles.optionsRow}>
            {['once', 'daily', 'weekly'].map((rec) => (
              <TouchableOpacity
                key={rec}
                style={[
                  styles.optionButton,
                  recurrence === rec && styles.optionSelected,
                ]}
                onPress={() => setRecurrence(rec)}
              >
                <Text
                  style={[
                    styles.optionText,
                    recurrence === rec && styles.optionTextSelected,
                  ]}
                >
                  {rec.charAt(0).toUpperCase() + rec.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Button
          title="Create Chore"
          onPress={handleSubmit}
          loading={addChoreMutation.isPending}
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
  kidsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ParentTheme.spacing.md,
  },
  kidOption: {
    alignItems: 'center',
    padding: ParentTheme.spacing.md,
    borderRadius: ParentTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: ParentTheme.colors.border,
    minWidth: 80,
  },
  kidSelected: {
    borderColor: ParentTheme.colors.primary,
    backgroundColor: ParentTheme.colors.primary + '20',
  },
  kidAvatar: {
    fontSize: 32,
    marginBottom: 4,
  },
  kidName: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.text,
    fontWeight: Typography.fontWeights.medium,
  },
  noKidsText: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.textLight,
    padding: ParentTheme.spacing.lg,
  },
  detailsCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  optionsCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.md,
  },
  optionButton: {
    flex: 1,
    paddingVertical: ParentTheme.spacing.md,
    borderRadius: ParentTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: ParentTheme.colors.border,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: ParentTheme.colors.primary,
    backgroundColor: ParentTheme.colors.primary,
  },
  optionText: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.text,
    fontWeight: Typography.fontWeights.medium,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    marginTop: ParentTheme.spacing.xl,
  },
});
