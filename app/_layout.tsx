import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

const InitialLayout = () => {
  const { session, loading, profile } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (session && profile) {
      if (!profile.onboarding_completed) {
        // If onboarding is not complete, force user to onboarding flow
        router.replace('/onboarding/step1');
      } else if (!inAuthGroup) {
        // If onboarding is complete and user is logged in,
        // redirect to the main app.
        router.replace('/(tabs)');
      }
    } else if (!session) {
      // If the user is not signed in and is trying to access
      // a protected route, redirect to the welcome screen.
      if (inAuthGroup) {
        router.replace('/welcome');
      }
    }
  }, [session, loading, profile, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="onboarding/step1" />
      <Stack.Screen name="onboarding/step2" />
      <Stack.Screen name="onboarding/step3" />
      <Stack.Screen name="onboarding/form" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
