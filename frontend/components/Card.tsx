/**
 * Reusable Card Component
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ParentTheme, KidTheme } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  theme?: 'parent' | 'kid';
  style?: ViewStyle;
}

export default function Card({ children, theme = 'parent', style }: CardProps) {
  const currentTheme = theme === 'parent' ? ParentTheme : KidTheme;

  return (
    <View
      style={[
        {
          backgroundColor: currentTheme.colors.surface,
          borderRadius: currentTheme.borderRadius.lg,
          padding: currentTheme.spacing.md,
          ...currentTheme.shadows.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
