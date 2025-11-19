/**
 * Kid Login Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { KidTheme, Typography } from '../constants/theme';
import { useAppStore } from '../state/store';
import { setItemAsync } from '../utils/secureStorage';

const API_URL = 'http://localhost:8000';

export default function KidLoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const setSelectedKid = useAppStore((state) => state.setSelectedKid);

  const handleLogin = async () => {
    if (!username.trim() || !pin) {
      Alert.alert('Error', 'Please enter username and PIN');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/kids/login`, {
        username: username.trim(),
        pin: pin,
      });

      const { kid } = response.data;

      // Store kid data
      setSelectedKid(kid);
      await setItemAsync('kidId', kid.id.toString());

      // Navigate to kid dashboard
      router.replace('/kid/dashboard');
    } catch (error: any) {
      console.error('Kid login error:', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.detail || 'Invalid username or PIN'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[KidTheme.colors.primary, '#FCD34D']}
      style={styles.container}
    >
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.logo}>🧒</Text>
            <Text style={styles.title}>Kid Login</Text>
            <Text style={styles.subtitle}>Enter your username and PIN</Text>

            <View style={styles.form}>
              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Your username"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label="PIN"
                value={pin}
                onChangeText={setPin}
                placeholder="Your PIN"
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
              />

              <Button
                title="Let's Go! 🚀"
                onPress={handleLogin}
                loading={loading}
                size="lg"
                style={styles.loginButton}
              />

              <Text style={styles.helpText}>
                Ask your parent if you forgot your username or PIN
              </Text>
            </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    padding: KidTheme.spacing.lg,
    paddingTop: KidTheme.spacing.xxl,
  },
  backButtonText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: KidTheme.spacing.xl,
  },
  logo: {
    fontSize: 100,
    marginBottom: KidTheme.spacing.md,
  },
  title: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: KidTheme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSizes.base,
    color: '#FFFFFF',
    marginBottom: KidTheme.spacing.xxl,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  loginButton: {
    marginTop: KidTheme.spacing.lg,
  },
  helpText: {
    fontSize: Typography.fontSizes.sm,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: KidTheme.spacing.md,
    opacity: 0.9,
  },
});
