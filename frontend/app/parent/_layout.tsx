/**
 * Parent Layout - Groups all parent-mode routes
 */
import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="add-kid" />
      <Stack.Screen name="kid/[id]" />
      <Stack.Screen name="chores" />
      <Stack.Screen name="add-chore" />
      <Stack.Screen name="rewards" />
      <Stack.Screen name="add-reward" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="add-calendar-event" />
      <Stack.Screen name="insights" />
    </Stack>
  );
}
