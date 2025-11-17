/**
 * Design System - FamilyCore
 * Colors, Typography, Spacing, and Theme Configuration
 */

// Parent Theme (Professional, Dark Blue)
export const ParentTheme = {
  colors: {
    primary: '#1E3A8A',      // Deep blue
    secondary: '#3B82F6',    // Bright blue
    background: '#F8FAFC',   // Light gray
    surface: '#FFFFFF',      // White
    surfaceDark: '#1E293B',  // Dark surface
    text: '#0F172A',         // Dark text
    textLight: '#64748B',    // Light gray text
    success: '#10B981',      // Green
    warning: '#F59E0B',      // Orange
    error: '#EF4444',        // Red
    border: '#E2E8F0',       // Light border
    accent: '#8B5CF6',       // Purple
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

// Kid Theme (Playful, Bright)
export const KidTheme = {
  colors: {
    primary: '#F59E0B',      // Bright orange
    secondary: '#EC4899',    // Pink
    background: '#FEF3C7',   // Light yellow
    surface: '#FFFFFF',      // White
    surfaceAccent: '#DBEAFE', // Light blue
    text: '#1F2937',         // Dark gray
    textLight: '#6B7280',    // Medium gray
    success: '#34D399',      // Bright green
    warning: '#FBBF24',      // Yellow
    error: '#F87171',        // Light red
    border: '#FDE68A',       // Yellow border
    accent: '#8B5CF6',       // Purple
    star: '#FCD34D',         // Gold
    fun: ['#F59E0B', '#EC4899', '#8B5CF6', '#34D399', '#3B82F6'], // Rainbow
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#EC4899',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// Typography
export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Avatars for kids
export const Avatars = {
  default_1: '😊',
  default_2: '🦁',
  default_3: '🐶',
  default_4: '🐱',
  default_5: '🦊',
  default_6: '🐻',
  default_7: '🐼',
  default_8: '🦄',
  default_9: '🐨',
  default_10: '🐸',
  default_11: '🦉',
  default_12: '🐙',
  default_13: '🦋',
  default_14: '🌟',
  default_15: '🚀',
};

// Animation durations
export const AnimationDurations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export default {
  ParentTheme,
  KidTheme,
  Typography,
  Avatars,
  AnimationDurations,
};
