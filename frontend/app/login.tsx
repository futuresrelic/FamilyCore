/**
 * Login Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import Button from '../components/Button';
import { ParentTheme, Typography } from '../constants/theme';
import { authAPI } from '../services/api';
import { useAuthStore } from '../state/store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      await setAuth(response.user, response.access_token);
      router.replace('/parent/dashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[ParentTheme.colors.primary, ParentTheme.colors.secondary]}
      style={styles.container}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>🏠 FamilyCore</Text>
            <Text style={styles.subtitle}>AI Family Organizer</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              style={styles.input}
            />

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              size="lg"
              style={styles.loginButton}
            />

            <Button
              title="Create Account"
              onPress={() => router.push('/register')}
              variant="ghost"
              textStyle={styles.registerButtonText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: ParentTheme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: ParentTheme.spacing.xxl,
  },
  title: {
    fontSize: Typography.fontSizes.display,
    fontWeight: Typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: ParentTheme.spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSizes.lg,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: ParentTheme.borderRadius.xl,
    padding: ParentTheme.spacing.xl,
    ...ParentTheme.shadows.lg,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    marginTop: ParentTheme.spacing.md,
  },
  registerButtonText: {
    color: ParentTheme.colors.primary,
  },
});
