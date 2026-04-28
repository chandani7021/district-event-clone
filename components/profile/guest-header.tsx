import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';


interface GuestHeaderProps {
  onLoginPress: () => void;
}

export function GuestHeader({ onLoginPress }: GuestHeaderProps) {
  return (
    <View className="px-lg pt-xl pb-lg gap-lg">
      <Text className="text-muted-foreground text-base">
        Sign up or log in to start booking your plans!
      </Text>
      <Pressable
        className="bg-foreground rounded-xl py-[14px] items-center justify-center"
        onPress={onLoginPress}
      >
        <Text className="text-primary-foreground text-base font-primary-semibold">Login / Sign up</Text>
      </Pressable>
    </View>
  );
}
