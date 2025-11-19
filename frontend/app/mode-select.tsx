/**
 * Mode Selection Screen - Choose Parent or Kid Login
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ParentTheme, KidTheme, Typography } from '../constants/theme';

export default function ModeSelectScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6']}
      style={styles.container}
    >
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.logo}>👨‍👩‍👧‍👦</Text>
        <Text style={styles.title}>FamilyCore</Text>
        <Text style={styles.subtitle}>Choose how you want to sign in</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.modeButton, styles.parentButton]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.modeIcon}>👨‍💼</Text>
            <Text style={styles.modeTitle}>Parent</Text>
            <Text style={styles.modeDesc}>Manage your family</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, styles.kidButton]}
            onPress={() => router.push('/kid-login')}
          >
            <Text style={styles.modeIcon}>🧒</Text>
            <Text style={styles.modeTitle}>Kid</Text>
            <Text style={styles.modeDesc}>View chores & rewards</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>AI-Powered Family Organization</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ParentTheme.spacing.xl,
  },
  logo: {
    fontSize: 80,
    marginBottom: ParentTheme.spacing.md,
  },
  title: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: ParentTheme.spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSizes.base,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: ParentTheme.spacing.xxl,
  },
  buttonContainer: {
    width: '100%',
    gap: ParentTheme.spacing.lg,
    marginBottom: ParentTheme.spacing.xxl,
  },
  modeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParentTheme.borderRadius.lg,
    padding: ParentTheme.spacing.xl,
    alignItems: 'center',
    ...ParentTheme.shadows.md,
  },
  parentButton: {
    borderWidth: 3,
    borderColor: ParentTheme.colors.primary,
  },
  kidButton: {
    borderWidth: 3,
    borderColor: KidTheme.colors.primary,
  },
  modeIcon: {
    fontSize: 60,
    marginBottom: ParentTheme.spacing.sm,
  },
  modeTitle: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.xs,
  },
  modeDesc: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
  },
  footer: {
    fontSize: Typography.fontSizes.sm,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});
