/**
 * AI Insights Screen (Parent)
 */
import React from 'react';
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
import { format, parseISO } from 'date-fns';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ParentTheme, Typography } from '../../constants/theme';
import { aiInsightsAPI } from '../../services/api';

export default function AIInsightsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: aiInsightsAPI.getAll,
  });

  const generateInsightsMutation = useMutation({
    mutationFn: () => aiInsightsAPI.generate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      Alert.alert('Success', 'New insights generated!');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to generate insights');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (insightId: number) => aiInsightsAPI.markAsRead(insightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
  });

  const deleteInsightMutation = useMutation({
    mutationFn: (insightId: number) => aiInsightsAPI.delete(insightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      Alert.alert('Success', 'Insight deleted');
    },
  });

  const handleDelete = (insight: any) => {
    Alert.alert('Delete Insight', 'Delete this insight?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteInsightMutation.mutate(insight.id),
      },
    ]);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'chore_suggestion':
        return '💡';
      case 'motivation':
        return '🌟';
      case 'fairness_alert':
        return '⚖️';
      case 'productivity_tip':
        return '🎯';
      default:
        return '🤖';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'chore_suggestion':
        return '#3B82F6';
      case 'motivation':
        return '#F59E0B';
      case 'fairness_alert':
        return '#EF4444';
      case 'productivity_tip':
        return '#10B981';
      default:
        return ParentTheme.colors.primary;
    }
  };

  const getInsightTypeLabel = (type: string) => {
    switch (type) {
      case 'chore_suggestion':
        return 'Chore Suggestion';
      case 'motivation':
        return 'Motivation';
      case 'fairness_alert':
        return 'Fairness Alert';
      case 'productivity_tip':
        return 'Productivity Tip';
      default:
        return type;
    }
  };

  const unreadInsights = insights?.filter((i: any) => i.is_read === 0) || [];
  const readInsights = insights?.filter((i: any) => i.is_read === 1) || [];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Insights</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button
          title="🤖 Generate New Insights"
          onPress={() => generateInsightsMutation.mutate()}
          size="lg"
          loading={generateInsightsMutation.isPending}
          style={styles.generateButton}
        />

        {isLoading ? (
          <View style={styles.loading}>
            <Text>Loading insights...</Text>
          </View>
        ) : (
          <>
            {unreadInsights.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  New Insights ({unreadInsights.length})
                </Text>
                {unreadInsights.map((insight: any) => (
                  <Card key={insight.id} style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                      <View
                        style={[
                          styles.insightIcon,
                          { backgroundColor: getInsightColor(insight.insight_type) + '20' },
                        ]}
                      >
                        <Text style={styles.insightEmoji}>
                          {getInsightIcon(insight.insight_type)}
                        </Text>
                      </View>
                      <View style={styles.insightHeaderText}>
                        <Text style={styles.insightType}>
                          {getInsightTypeLabel(insight.insight_type)}
                        </Text>
                        <Text style={styles.insightDate}>
                          {format(parseISO(insight.created_at), 'MMM d, h:mm a')}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.insightText}>{insight.text}</Text>

                    <View style={styles.insightActions}>
                      <TouchableOpacity
                        style={styles.markReadButton}
                        onPress={() => markAsReadMutation.mutate(insight.id)}
                      >
                        <Text style={styles.markReadButtonText}>Mark as Read</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(insight)}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {readInsights.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Read Insights ({readInsights.length})
                </Text>
                {readInsights.map((insight: any) => (
                  <Card key={insight.id} style={[styles.insightCard, styles.readInsightCard]}>
                    <View style={styles.insightHeader}>
                      <View
                        style={[
                          styles.insightIcon,
                          { backgroundColor: getInsightColor(insight.insight_type) + '10' },
                        ]}
                      >
                        <Text style={styles.insightEmoji}>
                          {getInsightIcon(insight.insight_type)}
                        </Text>
                      </View>
                      <View style={styles.insightHeaderText}>
                        <Text style={[styles.insightType, styles.readText]}>
                          {getInsightTypeLabel(insight.insight_type)}
                        </Text>
                        <Text style={styles.insightDate}>
                          {format(parseISO(insight.created_at), 'MMM d, h:mm a')}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.insightText, styles.readText]}>
                      {insight.text}
                    </Text>

                    <View style={styles.insightActions}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(insight)}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {insights && insights.length === 0 && (
              <Card>
                <Text style={styles.emptyText}>
                  No insights yet. Generate insights to get AI-powered recommendations
                  for your family!
                </Text>
              </Card>
            )}
          </>
        )}
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
  generateButton: {
    marginBottom: ParentTheme.spacing.lg,
  },
  loading: {
    padding: ParentTheme.spacing.xl,
    alignItems: 'center',
  },
  section: {
    marginBottom: ParentTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.md,
  },
  insightCard: {
    marginBottom: ParentTheme.spacing.md,
  },
  readInsightCard: {
    opacity: 0.7,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ParentTheme.spacing.md,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ParentTheme.spacing.md,
  },
  insightEmoji: {
    fontSize: 24,
  },
  insightHeaderText: {
    flex: 1,
  },
  insightType: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: 2,
  },
  insightDate: {
    fontSize: Typography.fontSizes.xs,
    color: ParentTheme.colors.textLight,
  },
  insightText: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.text,
    lineHeight: 22,
    marginBottom: ParentTheme.spacing.md,
  },
  readText: {
    color: ParentTheme.colors.textLight,
  },
  insightActions: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: ParentTheme.colors.border,
    paddingTop: ParentTheme.spacing.sm,
  },
  markReadButton: {
    flex: 1,
    paddingVertical: ParentTheme.spacing.sm,
    paddingHorizontal: ParentTheme.spacing.md,
    borderRadius: ParentTheme.borderRadius.md,
    backgroundColor: ParentTheme.colors.primary + '20',
    alignItems: 'center',
  },
  markReadButtonText: {
    color: ParentTheme.colors.primary,
    fontWeight: Typography.fontWeights.semibold,
    fontSize: Typography.fontSizes.sm,
  },
  deleteButton: {
    paddingVertical: ParentTheme.spacing.sm,
    paddingHorizontal: ParentTheme.spacing.md,
  },
  deleteButtonText: {
    color: ParentTheme.colors.error,
    fontWeight: Typography.fontWeights.medium,
    fontSize: Typography.fontSizes.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.textLight,
    textAlign: 'center',
    paddingVertical: ParentTheme.spacing.xl,
  },
});
