import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { fetchZoneTypes } from '../api/booking.api';
import type { SelectedSeat, Show, ZoneType } from '../types/booking.types';

interface ZoneSelectionStepProps {
  eventId: string;
  show: Show;
  selectedSeats: SelectedSeat[];
  onSeatAdded: (seat: SelectedSeat) => void;
  onSeatRemoved: (seatId: string) => void;
  onContinue: (pendingSeats?: SelectedSeat[]) => void;
}

function getZoneQty(selectedSeats: SelectedSeat[], zoneId: string): number {
  return selectedSeats.filter((s) => s.id.startsWith(`zone-${zoneId}-`)).length;
}

function makeZoneSeatId(zoneId: string, n: number): string {
  return `zone-${zoneId}-${n}`;
}

export function ZoneSelectionStep({
  eventId,
  show,
  selectedSeats,
  onSeatAdded,
  onSeatRemoved,
  onContinue,
}: ZoneSelectionStepProps) {
  const [zones, setZones] = useState<ZoneType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchZoneTypes(eventId)
      .then(setZones)
      .finally(() => setIsLoading(false));
  }, [eventId]);

  const totalSeats = selectedSeats.length;
  const totalAmount = selectedSeats.reduce((sum, s) => sum + (s.pricing?.price ?? 0), 0);

  const handleIncrement = (zone: ZoneType) => {
    const qty = getZoneQty(selectedSeats, zone.id);
    if (qty >= zone.max_per_order || qty >= zone.available) return;
    onSeatAdded({
      id: makeZoneSeatId(zone.id, qty + 1),
      label: zone.name,
      category: { label: zone.name },
      pricing: { price: zone.price, formattedPrice: `₹${zone.price.toLocaleString('en-IN')}` },
    });
  };

  const handleDecrement = (zone: ZoneType) => {
    const qty = getZoneQty(selectedSeats, zone.id);
    if (qty === 0) return;
    onSeatRemoved(makeZoneSeatId(zone.id, qty));
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-3">
        <ActivityIndicator size="large" color={THEME.dark.foreground} />
        <Text style={{ color: THEME.dark.mutedForeground, fontSize: 13 }}>Loading zones…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        <Text className="text-base font-primary-semibold text-foreground">Select Zone</Text>

        {zones.map((zone) => {
          const qty = getZoneQty(selectedSeats, zone.id);
          const isSoldOut = zone.is_sold_out || zone.available === 0;

          return (
            <View
              key={zone.id}
              style={{
                backgroundColor: THEME.dark.card,
                borderWidth: 1,
                borderColor: qty > 0 ? THEME.dark.primary : THEME.dark.border,
                borderRadius: 14,
                padding: 16,
                opacity: isSoldOut ? 0.5 : 1,
              }}>
              <View className="flex-row items-start justify-between gap-3">
                <View style={{ flex: 1 }}>
                  <Text className="font-primary-semibold text-foreground text-base">{zone.name}</Text>
                  {zone.description ? (
                    <Text
                      className="text-xs mt-0.5"
                      style={{ color: THEME.dark.mutedForeground }}
                      numberOfLines={2}>
                      {zone.description}
                    </Text>
                  ) : null}
                  <Text className="text-sm font-primary-bold mt-2 text-foreground">
                    ₹{zone.price.toLocaleString('en-IN')}
                    <Text className="font-normal text-xs" style={{ color: THEME.dark.mutedForeground }}>
                      {' '}/ person
                    </Text>
                  </Text>
                  {!isSoldOut && (
                    <Text className="text-xs mt-0.5" style={{ color: THEME.dark.mutedForeground }}>
                      {zone.available} available · max {zone.max_per_order} per order
                    </Text>
                  )}
                  {isSoldOut && (
                    <Text className="text-xs mt-1 font-primary-semibold" style={{ color: THEME.dark.destructive }}>
                      Sold out
                    </Text>
                  )}
                </View>

                {/* Quantity control */}
                {!isSoldOut && (
                  <View className="flex-row items-center gap-3" style={{ marginTop: 2 }}>
                    <Pressable
                      onPress={() => handleDecrement(zone)}
                      disabled={qty === 0}
                      style={({ pressed }) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          qty === 0
                            ? THEME.dark.muted
                            : pressed
                              ? THEME.dark.brandMedium
                              : THEME.dark.primary,
                      })}>
                      <Minus size={16} color={qty === 0 ? THEME.dark.mutedForeground : THEME.dark.primaryForeground} />
                    </Pressable>

                    <Text className="text-lg font-primary-bold text-foreground" style={{ minWidth: 24, textAlign: 'center' }}>
                      {qty}
                    </Text>

                    <Pressable
                      onPress={() => handleIncrement(zone)}
                      disabled={qty >= zone.max_per_order || qty >= zone.available}
                      style={({ pressed }) => ({
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          qty >= zone.max_per_order || qty >= zone.available
                            ? THEME.dark.muted
                            : pressed
                              ? THEME.dark.brandMedium
                              : THEME.dark.primary,
                      })}>
                      <Plus
                        size={16}
                        color={
                          qty >= zone.max_per_order || qty >= zone.available
                            ? THEME.dark.mutedForeground
                            : THEME.dark.primaryForeground
                        }
                      />
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom bar */}
      {totalSeats > 0 && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: THEME.dark.border,
            paddingTop: 14,
            paddingBottom: 4,
            marginTop: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
          <View style={{ flex: 1 }}>
            <Text className="text-sm font-primary-semibold text-foreground">
              {totalSeats} {totalSeats === 1 ? 'ticket' : 'tickets'}
            </Text>
            <Text className="text-xs mt-0.5" style={{ color: THEME.dark.mutedForeground }}>
              Total: ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
          <Pressable
            onPress={onContinue}
            style={({ pressed }) => ({
              backgroundColor: pressed ? THEME.dark.brandMedium : THEME.dark.primary,
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
            })}>
            <Text className="font-primary-semibold text-sm" style={{ color: THEME.dark.primaryForeground }}>
              Continue
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
