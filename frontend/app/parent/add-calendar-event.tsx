/**
 * Add Calendar Event Screen
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { ParentTheme, Typography } from '../../constants/theme';
import { calendarAPI, kidsAPI } from '../../services/api';

export default function AddCalendarEventScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [eventTime, setEventTime] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [eventType, setEventType] = useState<'chore' | 'family_event' | 'birthday'>('family_event');
  const [recurrenceType, setRecurrenceType] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [selectedKidId, setSelectedKidId] = useState<number | null>(null);

  const { data: kids } = useQuery({
    queryKey: ['kids'],
    queryFn: kidsAPI.getAll,
  });

  const addEventMutation = useMutation({
    mutationFn: (data: any) => calendarAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      Alert.alert('Success', 'Event added successfully!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to add event');
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (!eventDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    // Combine date and time if not all-day
    let fullDateTime = eventDate;
    if (!allDay && eventTime) {
      fullDateTime = `${eventDate}T${eventTime}:00`;
    } else {
      fullDateTime = `${eventDate}T00:00:00`;
    }

    addEventMutation.mutate({
      title: title.trim(),
      description: description.trim() || null,
      event_date: fullDateTime,
      all_day: allDay ? 1 : 0,
      event_type: eventType,
      recurrence_type: recurrenceType,
      kid_id: selectedKidId,
    });
  };

  const EVENT_TYPES = [
    { value: 'family_event', label: 'Family Event', icon: '👨‍👩‍👧‍👦' },
    { value: 'chore', label: 'Chore', icon: '✓' },
    { value: 'birthday', label: 'Birthday', icon: '🎂' },
  ];

  const RECURRENCE_OPTIONS = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Event</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <Text style={styles.sectionTitle}>Event Details</Text>

          <Input
            label="Event Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Family Game Night"
          />

          <Input
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add more details"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Date *"
            value={eventDate}
            onChangeText={setEventDate}
            placeholder="YYYY-MM-DD"
          />

          <View style={styles.allDayToggle}>
            <Text style={styles.label}>All Day Event</Text>
            <View style={styles.toggleButtons}>
              <TouchableOpacity
                style={[styles.toggleButton, allDay && styles.toggleButtonActive]}
                onPress={() => setAllDay(true)}
              >
                <Text style={[styles.toggleText, allDay && styles.toggleTextActive]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !allDay && styles.toggleButtonActive]}
                onPress={() => setAllDay(false)}
              >
                <Text style={[styles.toggleText, !allDay && styles.toggleTextActive]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {!allDay && (
            <Input
              label="Time"
              value={eventTime}
              onChangeText={setEventTime}
              placeholder="HH:MM (24-hour format)"
            />
          )}
        </Card>

        <Card style={styles.typeCard}>
          <Text style={styles.sectionTitle}>Event Type</Text>
          <View style={styles.typeGrid}>
            {EVENT_TYPES.map((type: any) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeOption,
                  eventType === type.value && styles.typeSelected,
                ]}
                onPress={() => setEventType(type.value)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={styles.typeLabel}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.recurrenceCard}>
          <Text style={styles.sectionTitle}>Recurrence</Text>
          <View style={styles.recurrenceGrid}>
            {RECURRENCE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.recurrenceOption,
                  recurrenceType === option.value && styles.recurrenceSelected,
                ]}
                onPress={() => setRecurrenceType(option.value as any)}
              >
                <Text
                  style={[
                    styles.recurrenceLabel,
                    recurrenceType === option.value && styles.recurrenceLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.kidCard}>
          <Text style={styles.sectionTitle}>Assign to Kid (Optional)</Text>
          <View style={styles.kidGrid}>
            <TouchableOpacity
              style={[
                styles.kidOption,
                selectedKidId === null && styles.kidSelected,
              ]}
              onPress={() => setSelectedKidId(null)}
            >
              <Text style={styles.kidAvatar}>👨‍👩‍👧‍👦</Text>
              <Text style={styles.kidName}>All Family</Text>
            </TouchableOpacity>
            {kids?.map((kid: any) => (
              <TouchableOpacity
                key={kid.id}
                style={[
                  styles.kidOption,
                  selectedKidId === kid.id && styles.kidSelected,
                ]}
                onPress={() => setSelectedKidId(kid.id)}
              >
                <Text style={styles.kidAvatar}>{kid.avatar_id}</Text>
                <Text style={styles.kidName}>{kid.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Button
          title="Add Event"
          onPress={handleSubmit}
          loading={addEventMutation.isPending}
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
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.xs,
  },
  allDayToggle: {
    marginBottom: ParentTheme.spacing.md,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: ParentTheme.spacing.sm,
    borderRadius: ParentTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: ParentTheme.colors.border,
    alignItems: 'center',
  },
  toggleButtonActive: {
    borderColor: ParentTheme.colors.primary,
    backgroundColor: ParentTheme.colors.primary + '20',
  },
  toggleText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.medium,
    color: ParentTheme.colors.textLight,
  },
  toggleTextActive: {
    color: ParentTheme.colors.primary,
  },
  typeCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.md,
  },
  typeOption: {
    flex: 1,
    padding: ParentTheme.spacing.md,
    borderRadius: ParentTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: ParentTheme.colors.border,
    alignItems: 'center',
  },
  typeSelected: {
    borderColor: ParentTheme.colors.primary,
    backgroundColor: ParentTheme.colors.primary + '20',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: ParentTheme.spacing.xs,
  },
  typeLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: ParentTheme.colors.text,
    textAlign: 'center',
  },
  recurrenceCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  recurrenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ParentTheme.spacing.sm,
  },
  recurrenceOption: {
    paddingVertical: ParentTheme.spacing.sm,
    paddingHorizontal: ParentTheme.spacing.md,
    borderRadius: ParentTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: ParentTheme.colors.border,
  },
  recurrenceSelected: {
    borderColor: ParentTheme.colors.primary,
    backgroundColor: ParentTheme.colors.primary + '20',
  },
  recurrenceLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: ParentTheme.colors.textLight,
  },
  recurrenceLabelSelected: {
    color: ParentTheme.colors.primary,
  },
  kidCard: {
    marginTop: ParentTheme.spacing.lg,
  },
  kidGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ParentTheme.spacing.md,
  },
  kidOption: {
    width: 80,
    padding: ParentTheme.spacing.sm,
    borderRadius: ParentTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: ParentTheme.colors.border,
    alignItems: 'center',
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
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
    color: ParentTheme.colors.text,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: ParentTheme.spacing.xl,
  },
});
