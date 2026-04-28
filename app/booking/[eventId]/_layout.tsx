import { Stack } from 'expo-router';

export default function BookingSubLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack screenOptions={{ headerBackTitle: '' }} />
    </>
  );
}
