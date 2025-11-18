/**
 * Calendar Screen (Parent)
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
import { Calendar } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ParentTheme, Typography } from '../../constants/theme';
import { calendarAPI, kidsAPI } from '../../services/api';

export default function CalendarScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Fetch calendar events
  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: () => calendarAPI.getAll(),
  });

  // Fetch kids for filtering
  const { data: kids } = useQuery({
    queryKey: ['kids'],
    queryFn: kidsAPI.getAll,
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: number) => calendarAPI.delete(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      Alert.alert('Success', 'Event deleted');
    },
  });

  const handleDelete = (event: any) => {
    Alert.alert('Delete Event', `Delete "${event.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteEventMutation.mutate(event.id),
      },
    ]);
  };

  // Prepare marked dates for calendar
  const markedDates = events?.reduce((acc: any, event: any) => {
    const date = format(parseISO(event.event_date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = { marked: true, dots: [] };
    }
    return acc;
  }, {});

  // Add selected date highlight
  if (markedDates && selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: ParentTheme.colors.primary,
    };
  }

  // Filter events for selected date
  const selectedDateEvents = events?.filter((event: any) => {
    const eventDate = format(parseISO(event.event_date), 'yyyy-MM-dd');
    return eventDate === selectedDate;
  }) || [];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'chore':
        return '#3B82F6';
      case 'family_event':
        return '#10B981';
      case 'birthday':
        return '#F59E0B';
      default:
        return ParentTheme.colors.primary;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'chore':
        return '✓';
      case 'family_event':
        return '👨‍👩‍👧‍👦';
      case 'birthday':
        return '🎂';
      default:
        return '📅';
    }
  };

  const getKidName = (kidId: number | null) => {
    if (!kidId) return 'All Family';
    const kid = kids?.find((k: any) => k.id === kidId);
    return kid ? kid.name : 'Unknown';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Family Calendar</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Button
          title="+ Add Event"
          onPress={() => router.push('/parent/add-calendar-event')}
          size="lg"
          style={styles.addButton}
        />

        <Card style={styles.calendarCard}>
          <Calendar
            current={selectedDate}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: ParentTheme.colors.surface,
              calendarBackground: ParentTheme.colors.surface,
              textSectionTitleColor: ParentTheme.colors.textLight,
              selectedDayBackgroundColor: ParentTheme.colors.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: ParentTheme.colors.primary,
              dayTextColor: ParentTheme.colors.text,
              textDisabledColor: ParentTheme.colors.border,
              dotColor: ParentTheme.colors.primary,
              selectedDotColor: '#FFFFFF',
              arrowColor: ParentTheme.colors.primary,
              monthTextColor: ParentTheme.colors.text,
              textDayFontWeight: Typography.fontWeights.medium,
              textMonthFontWeight: Typography.fontWeights.bold,
              textDayHeaderFontWeight: Typography.fontWeights.semibold,
            }}
          />
        </Card>

        <Card style={styles.eventsCard}>
          <Text style={styles.sectionTitle}>
            Events on {format(parseISO(selectedDate), 'MMMM d, yyyy')}
          </Text>

          {isLoading ? (
            <View style={styles.loading}>
              <Text>Loading events...</Text>
            </View>
          ) : selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event: any) => (
              <View key={event.id} style={styles.eventItem}>
                <View
                  style={[
                    styles.eventIndicator,
                    { backgroundColor: getEventTypeColor(event.event_type) },
                  ]}
                >
                  <Text style={styles.eventIcon}>
                    {getEventTypeIcon(event.event_type)}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.description && (
                    <Text style={styles.eventDesc}>{event.description}</Text>
                  )}
                  <View style={styles.eventMeta}>
                    <Text style={styles.eventMetaText}>
                      {getKidName(event.kid_id)}
                    </Text>
                    {!event.all_day && (
                      <Text style={styles.eventMetaText}>
                        {format(parseISO(event.event_date), 'h:mm a')}
                      </Text>
                    )}
                    {event.recurrence_type && event.recurrence_type !== 'once' && (
                      <Text style={styles.eventMetaText}>
                        Repeats: {event.recurrence_type}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(event)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No events scheduled for this day
            </Text>
          )}
        </Card>
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
  addButton: {
    marginBottom: ParentTheme.spacing.lg,
  },
  loading: {
    padding: ParentTheme.spacing.xl,
    alignItems: 'center',
  },
  calendarCard: {
    marginBottom: ParentTheme.spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  eventsCard: {
    marginBottom: ParentTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: ParentTheme.spacing.md,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: ParentTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ParentTheme.colors.border,
  },
  eventIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ParentTheme.spacing.md,
  },
  eventIcon: {
    fontSize: 20,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.bold,
    color: ParentTheme.colors.text,
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: Typography.fontSizes.sm,
    color: ParentTheme.colors.textLight,
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    gap: ParentTheme.spacing.md,
    flexWrap: 'wrap',
  },
  eventMetaText: {
    fontSize: Typography.fontSizes.xs,
    color: ParentTheme.colors.textLight,
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: Typography.fontSizes.lg,
    color: ParentTheme.colors.error,
    fontWeight: Typography.fontWeights.bold,
  },
  emptyText: {
    fontSize: Typography.fontSizes.base,
    color: ParentTheme.colors.textLight,
    textAlign: 'center',
    paddingVertical: ParentTheme.spacing.xl,
  },
});
