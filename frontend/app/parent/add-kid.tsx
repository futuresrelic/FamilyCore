/**
 * Add Kid Screen
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
import { ParentTheme, Typography, Avatars } from '../../constants/theme';
import { kidsAPI } from '../../services/api';

const AVATAR_OPTIONS = Object.entries(Avatars);

export default function AddKidScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(Avatars.default_1);

  const addKidMutation = useMutation({
    mutationFn: (data: any) => kidsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kids'] });
      Alert.alert('Success', 'Kid added successfully!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to add kid');
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    const ageNum = age ? parseInt(age) : null;
    if (age && (isNaN(ageNum!) || ageNum! < 0 || ageNum! > 18)) {
      Alert.alert('Error', 'Please enter a valid age (0-18)');
      return;
    }

    // Validate username and PIN (optional but must be together)
    if (username.trim() && !pin) {
      Alert.alert('Error', 'Please enter a PIN for kid login');
      return;
    }

    if (pin && !username.trim()) {
      Alert.alert('Error', 'Please enter a username for kid login');
      return;
    }

    if (pin && pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    addKidMutation.mutate({
      name: name.trim(),
      age: ageNum,
      avatar_id: selectedAvatar,
      username: username.trim() || null,
      pin: pin || null,
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
        <Text style={styles.title}>Add Kid</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <Text style={styles.sectionTitle}>Basic Info</Text>

          <Input
            label="Name *"
            value={name}
            onChangeText={setName}
            placeholder="Enter kid's name"
          />

          <Input
            label="Age (optional)"
            value={age}
            onChangeText={setAge}
            placeholder="Enter age"
            keyboardType="numeric"
          />
        </Card>

        <Card style={styles.loginCard}>
          <Text style={styles.sectionTitle}>Kid Login (Optional)</Text>
          <Text style={styles.helperText}>
            Set username & PIN so your kid can login independently
          </Text>

          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="e.g., emma123"
            autoCapitalize="none"
          />

          <Input
            label="PIN (4+ digits)"
            value={pin}
            onChangeText={setPin}
            placeholder="Enter PIN"
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
          />
        </Card>

        <Card style={styles.avatarCard}>
          <Text style={styles.sectionTitle}>Choose Avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATAR_OPTIONS.map(([key, emoji]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.avatarOption,
                  selectedAvatar === emoji && styles.avatarSelected,
                ]}
                onPress={() => setSelectedAvatar(emoji)}
              >
                <Text style={styles.avatarEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Button
          title="Add Kid"
          onPress={handleSubmit}
          loading={addKidMutation.isPending}
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
  loginCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  helperText: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
    marginBottom: ParentTheme.spacing.md,
  },
  avatarCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ParentTheme.spacing.md,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: ParentTheme.borderRadius.md,
    backgroundColor: ParentTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ParentTheme.colors.border,
  },
  avatarSelected: {
    borderColor: ParentTheme.colors.primary,
    backgroundColor: ParentTheme.colors.primary + '20',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  submitButton: {
    marginTop: ParentTheme.spacing.xl,
  },
});
