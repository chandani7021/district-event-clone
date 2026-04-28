import { Modal, View, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { BOOKING_SELECT_STATE } from '@/constants/booking.constants';

interface StatePickerModalProps {
  visible: boolean;
  selectedState: string;
  onSelect: (state: string) => void;
  onClose: () => void;
  states: string[];
}

export function StatePickerModal({
  visible,
  selectedState,
  onSelect,
  onClose,
  states,
}: StatePickerModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <View
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: THEME.dark.card,
            maxHeight: '70%',
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: THEME.dark.border,
            }}
          >
            <Text className="text-foreground text-lg font-primary-bold">{BOOKING_SELECT_STATE}</Text>
          </View>
          <FlatList
            data={states}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: THEME.dark.border,
                }}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: selectedState === item ? THEME.dark.primary : THEME.dark.foreground,
                    fontWeight: selectedState === item ? '700' : '400',
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
