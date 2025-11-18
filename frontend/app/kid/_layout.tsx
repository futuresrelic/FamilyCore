/**
 * Kid Layout - Groups all kid-mode routes
 */
import { Stack } from 'expo-router';

export default function KidLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="rewards" />
    </Stack>
  );
}
