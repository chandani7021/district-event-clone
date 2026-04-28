import { Pressable, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { SelectedTicket, TicketType } from '../types/booking.types';

interface TicketSelectionStepProps {
  ticketTypes: TicketType[];
  selectedTickets: SelectedTicket[];
  onSetQuantity: (ticketType: TicketType, quantity: number) => void;
}

export function TicketSelectionStep({
  ticketTypes,
  selectedTickets,
  onSetQuantity,
}: TicketSelectionStepProps) {
  const getQuantity = (typeId: string) =>
    selectedTickets.find((t) => t.type.id === typeId)?.quantity ?? 0;

  return (
    <View>
      <Text className="text-lg font-primary-bold text-foreground mb-4">Choose tickets</Text>
      <View className="gap-3">
        {ticketTypes.map((tt) => {
          const qty = getQuantity(tt.id);
          return (
            <View
              key={tt.id}
              className={`rounded-2xl p-4 ${tt.is_sold_out ? 'opacity-50' : ''}`}
              style={{
                borderWidth: 1.5,
                borderColor: qty > 0 ? THEME.dark.foreground : THEME.dark.border,
                backgroundColor: qty > 0 ? THEME.dark.secondary : 'transparent',
              }}>
              <View className="flex-row items-start justify-between gap-2">
                {/* Left: info */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <Text className="font-primary-bold text-foreground text-[15px]">
                      {tt.name}
                    </Text>
                    {tt.is_sold_out && (
                      <View
                        className="rounded-md px-1.5 py-0.5"
                        style={{ backgroundColor: THEME.dark.muted }}>
                        <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
                          Sold Out
                        </Text>
                      </View>
                    )}
                    {!tt.is_sold_out && tt.available < 20 && (
                      <View className="bg-district_clone_orange/10 rounded-md px-1.5 py-0.5">
                        <Text className="text-xs text-district_clone_orange">
                          Only {tt.available} left
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="font-primary-bold text-base mt-1" style={{ color: THEME.dark.foreground }}>
                    ₹{tt.price.toLocaleString('en-IN')}
                  </Text>
                  {tt.description && (
                    <Text
                      className="text-sm mt-1 leading-4"
                      style={{ color: THEME.dark.mutedForeground }}>
                      {tt.description}
                    </Text>
                  )}
                </View>

                {/* Right: Add button or stepper — fixed width so left text never reflows */}
                {!tt.is_sold_out && (
                  <View style={{ width: 116, alignItems: 'flex-end' }}>
                    {qty === 0 ? (
                      <Pressable
                        onPress={() => onSetQuantity(tt, 1)}
                        className="rounded-lg px-5 py-2.5"
                        style={({ pressed }) => ({
                          borderWidth: 1.5,
                          borderColor: THEME.dark.foreground,
                          backgroundColor: pressed ? THEME.dark.muted : 'transparent',
                        })}>
                        <Text className="font-primary-bold text-base" style={{ color: THEME.dark.foreground }}>
                          Add
                        </Text>
                      </Pressable>
                    ) : (
                      <View className="flex-row items-center gap-3">
                        <Pressable
                          onPress={() => onSetQuantity(tt, qty - 1)}
                          className="w-8 h-8 rounded-lg items-center justify-center"
                          style={{
                            borderWidth: 1.5,
                            borderColor: THEME.dark.foreground,
                          }}>
                          <Minus size={16} color={THEME.dark.foreground} />
                        </Pressable>
                        <Text className="font-primary-bold text-foreground text-lg min-w-7 text-center">
                          {qty}
                        </Text>
                        <Pressable
                          onPress={() => onSetQuantity(tt, Math.min(tt.max_per_order, qty + 1))}
                          disabled={qty >= tt.max_per_order || qty >= tt.available}
                          className="w-8 h-8 rounded-lg items-center justify-center"
                          style={{
                            borderWidth: 1.5,
                            borderColor:
                              qty >= tt.max_per_order || qty >= tt.available
                                ? THEME.dark.border
                                : THEME.dark.foreground,
                            opacity: qty >= tt.max_per_order || qty >= tt.available ? 0.4 : 1,
                          }}>
                          <Plus size={16} color={THEME.dark.foreground} />
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
