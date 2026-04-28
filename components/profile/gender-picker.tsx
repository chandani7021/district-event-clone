import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GENDER_OPTIONS = ['Male', 'Female', 'Others'] as const;

interface GenderPickerProps {
  value: string;
  onChange: (val: string) => void;
}

export function GenderPicker({ value, onChange }: GenderPickerProps) {
  return (
    <View>
      <Text className="text-secondary-foreground text-sm font-primary-medium mb-2">Gender</Text>
      <Select
        value={value ? { value, label: value } : undefined}
        onValueChange={(option) => onChange(option?.value ?? '')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent>
          {GENDER_OPTIONS.map((option) => (
            <SelectItem key={option} value={option} label={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </View>
  );
}
