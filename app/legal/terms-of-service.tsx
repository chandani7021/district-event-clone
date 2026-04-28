import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { TERMS_SECTIONS } from '@/constants/legal';
import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          title: 'Terms of Service',
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
          <Text className="text-2xl font-primary-bold text-foreground">Terms of Service</Text>
          <Text className="text-muted-foreground text-sm">Last updated: January 2025</Text>
          <Text className="text-muted-foreground text-base leading-7">
            Please read these Terms of Service carefully before using the district-clone app.
          </Text>
        </View>

        {/* Sections */}
        {TERMS_SECTIONS.map((section) => (
          <View key={section.title} className="gap-2">
            <Text className="text-foreground font-primary-semibold text-base">{section.title}</Text>
            <Text className="text-muted-foreground text-base leading-7">{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
