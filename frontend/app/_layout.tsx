/**
 * Root Layout - App Entry Point
 */
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, useAppStore } from '../state/store';
import { getItemAsync } from '../utils/secureStorage';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isAuthenticated, loadAuth } = useAuthStore();
  const { selectedKid, setSelectedKid } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadAuth();

      // Check if there's a kid session
      const kidId = await getItemAsync('kidId');
      if (kidId && !isAuthenticated) {
        // Kid was logged in, but we don't have their full data
        // They'll need to log in again
        setSelectedKid(null);
      }

      setInitializing(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthScreens = segments[0] === 'login' || segments[0] === 'kid-login' || segments[0] === 'mode-select' || segments[0] === 'register';
    const inParentScreens = segments[0] === 'parent';
    const inKidScreens = segments[0] === 'kid';

    // Parent is authenticated
    if (isAuthenticated && !inParentScreens && !inAuthScreens) {
      router.replace('/parent/dashboard');
    }
    // Kid is authenticated
    else if (selectedKid && !inKidScreens && !inAuthScreens) {
      router.replace('/kid/dashboard');
    }
    // Nobody is authenticated
    else if (!isAuthenticated && !selectedKid && !inAuthScreens) {
      router.replace('/mode-select');
    }
  }, [isAuthenticated, selectedKid, segments, initializing]);

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
