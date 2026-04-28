import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { BankOption } from '@/interfaces/payment.interface';

interface BankListItemProps {
  bank: BankOption;
  onPress: (bank: BankOption) => void;
}

export function BankListItem({ bank, onPress }: BankListItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4 border-b border-border"
      onPress={() => onPress(bank)}
    >
      <View
        style={{ backgroundColor: bank.iconColor }}
        className="w-10 h-10 rounded-lg items-center justify-center mr-3"
      >
        <Text className="text-white text-sm font-primary-bold">{bank.iconLabel}</Text>
      </View>
      <Text className="text-foreground text-base flex-1">{bank.name}</Text>
    </TouchableOpacity>
  );
}
