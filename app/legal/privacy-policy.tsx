import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { PRIVACY_SECTIONS } from '@/constants/legal';
import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerStyle: { backgroundColor: THEME.dark.background },
          headerTintColor: THEME.dark.foreground,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-6 pb-16 gap-6"
        showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View className="gap-2">
          <Text className="text-2xl font-primary-bold text-foreground">Privacy Policy</Text>
          <Text className="text-muted-foreground text-sm">Last updated: January 2025</Text>
          <Text className="text-muted-foreground text-base leading-7">
            This Privacy Policy explains how district-clone collects, uses, and protects your personal
            information when you use our app.
          </Text>
        </View>

        {/* Sections */}
        {PRIVACY_SECTIONS.map((section) => (
          <View key={section.title} className="gap-2">
            <Text className="text-foreground font-primary-semibold text-base">{section.title}</Text>
            <Text className="text-muted-foreground text-base leading-7">{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
