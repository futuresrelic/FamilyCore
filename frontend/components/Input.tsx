/**
 * Reusable Input Component
 */
import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { ParentTheme, Typography } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  containerStyle,
  style,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={ParentTheme.colors.textLight}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: ParentTheme.spacing.md,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: ParentTheme.colors.border,
    borderRadius: ParentTheme.borderRadius.md,
    padding: ParentTheme.spacing.md,
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.text,
    backgroundColor: ParentTheme.colors.surface,
  },
  inputError: {
    borderColor: ParentTheme.colors.error,
  },
  errorText: {
    fontSize: Typography.fontSizes.xs,
    color: ParentTheme.colors.error,
    marginTop: ParentTheme.spacing.xs,
  },
});
