import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface PaymentGroupSectionProps {
  label: string;
  children: React.ReactNode;
}

export function PaymentGroupSection({ label, children }: PaymentGroupSectionProps) {
  return (
    <View className="gap-2">
      <Text className="text-base font-primary-semibold text-muted-foreground">
        {label}
      </Text>
      <View className="rounded-xl overflow-hidden bg-card">
        {children}
      </View>
    </View>
  );
}
