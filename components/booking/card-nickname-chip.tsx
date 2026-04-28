import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import type { CardNicknameType } from '@/interfaces/payment.interface';

interface CardNicknameChipProps {
  label: string;
  value: CardNicknameType;
  selected: boolean;
  onPress: (value: CardNicknameType) => void;
}

export function CardNicknameChip({ label, value, selected, onPress }: CardNicknameChipProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      className={`px-4 py-2 rounded-full border ${
        selected ? 'bg-primary border-primary' : 'bg-transparent border-border'
      }`}
    >
      <Text
        className={`text-sm font-primary-medium ${
          selected ? 'text-background' : 'text-muted-foreground'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
