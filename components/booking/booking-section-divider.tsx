import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export function BookingSectionDivider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 mx-4 my-5">
      <View className="flex-1 h-px bg-border" />
      <Text className="text-xs font-primary-bold tracking-widest text-muted-foreground">
        {label}
      </Text>
      <View className="flex-1 h-px bg-border" />
    </View>
  );
}
