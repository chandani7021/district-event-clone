import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { BankOption } from '@/interfaces/payment.interface';

interface PopularBankItemProps {
  bank: BankOption;
  onPress: (bank: BankOption) => void;
}

export function PopularBankItem({ bank, onPress }: PopularBankItemProps) {
  return (
    <TouchableOpacity
      className="items-center gap-2 flex-1"
      onPress={() => onPress(bank)}
    >
      <View
        style={{ backgroundColor: bank.iconColor }}
        className="w-14 h-14 rounded-2xl items-center justify-center"
      >
        <Text className="text-white text-xl font-primary-bold">{bank.iconLabel}</Text>
      </View>
      <Text className="text-foreground text-xs text-center font-primary-medium">{bank.name}</Text>
    </TouchableOpacity>
  );
}
