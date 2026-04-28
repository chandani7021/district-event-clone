import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Info } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import type { SelectedSeat, SelectedTicket, Show, TicketType } from '../types/booking.types';
import { TicketSelectionStep } from './ticket-selection-step';
import { ZONE_PRICING, SEAT_CATEGORY_PRICING } from '../constants';
import { SeatsioSeatingChart } from './seatsio-seating-chart';
import SeatsioSeatingChartSDK from '@seatsio/seatsio-react-native';

const WORKSPACE_KEY =
  process.env.EXPO_PUBLIC_SEATSIO_WORKSPACE_KEY ?? '61f08cf2-64a2-473d-a216-b02abf29633e';
const REGION = process.env.EXPO_PUBLIC_SEATSIO_REGION ?? 'eu';

function getDeterministicPrice(label: string, fallback: number): number {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const multiplier = 1 + (Math.abs(hash) % 5) * 0.25;
  return Math.round((fallback * multiplier) / 100) * 100;
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface SeatSelectionStepProps {
  show: Show;
  selectedSeats: SelectedSeat[];
  onSeatAdded: (seat: SelectedSeat) => void;
  onSeatRemoved: (seatId: string) => void;
  /** Called when the user is ready to proceed. For zone-based flows, passes the
   *  seats that were just added in the same synchronous call so callers can use
   *  them before the reducer state has re-rendered. */
  onContinue: (pendingSeats?: SelectedSeat[]) => void;
  /** Called with a handler when zone sub-view is active, null when back at zone chart */
  onRegisterBackHandler?: (handler: (() => void) | null) => void;
  /** Fallback price per seat when seatsio does not return pricing (e.g. test charts) */
  pricePerSeat?: number;
  /** Seat IDs to deselect in the chart (e.g. removed from review screen) */
  seatsToDeselect?: string[];
  /** Whether there are already seats selected from a different show (multi-day) */
  hasPreviousSeats?: boolean;
  /** Called when user taps "Clear selection" to clear all previously selected seats */
  onClearSeats?: () => void;
}

// ── Root ───────────────────────────────────────────────────────────────────────
export function SeatSelectionStep(props: SeatSelectionStepProps) {
  if (props.show.seating_mode === 'zone') {
    return <SeatsioZoneScenario {...props} />;
  }
  return <SeatsioScenario {...props} />;
}


// ── Zone scenario ──────────────────────────────────────────────────────────────
interface ClickedZone {
  id: string;
  label: string;
  category?: { label: string; key: string };
  pricing?: { price: number };
}

type ZoneView = 'chart' | 'tickets' | 'seat-picking';

function SeatsioZoneScenario(props: SeatSelectionStepProps) {
  const {
    show,
    selectedSeats,
    onSeatAdded,
    onSeatRemoved,
    onContinue,
    onRegisterBackHandler,
    pricePerSeat,
  } = props;
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [view, setView] = useState<ZoneView>('chart');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  useEffect(() => {
    if (view !== 'chart') {
      onRegisterBackHandler?.(() => setView('chart'));
    } else {
      onRegisterBackHandler?.(null);
    }
    return () => onRegisterBackHandler?.(null);
  }, [view, onRegisterBackHandler]);

  const [clickedZone, setClickedZone] = useState<ClickedZone | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [zoneSeatEventKey, setZoneSeatEventKey] = useState<string | null>(null);
  const [zoneSeatCategory, setZoneSeatCategory] = useState<string | undefined>(undefined);
  const [zoneSeatSelected, setZoneSeatSelected] = useState<SelectedSeat[]>([]);

  const uniquePrices = useMemo(
    () => [...new Set((show.zone_pricing ?? []).map((p) => p.price))].sort((a, b) => a - b),
    [show.zone_pricing],
  );

  const filteredCategories = useMemo(
    () =>
      selectedPrice !== null
        ? (show.zone_pricing ?? []).filter((p) => p.price === selectedPrice).map((p) => p.category)
        : undefined,
    [selectedPrice, show.zone_pricing],
  );

  const unavailableCategories = useMemo(
    () =>
      filteredCategories
        ? (show.zone_pricing ?? ZONE_PRICING).map((p) => p.category).filter((cat) => !filteredCategories.includes(cat))
        : undefined,
    [filteredCategories, show.zone_pricing],
  );

  const zonePricing = show.zone_pricing ?? (ZONE_PRICING as unknown as readonly { category: string; price: number }[]);

  // Sync internal quantities with props.selectedSeats whenever view or selectedSeats change
  useEffect(() => {
    const newQuantities: Record<string, number> = {};
    for (const seat of selectedSeats) {
      // Zone tickets have IDs like "zoneId-1", "zoneId-2"
      const zoneId = seat.id.split('-')[0];
      if (zoneId) {
        newQuantities[zoneId] = (newQuantities[zoneId] ?? 0) + 1;
      }
    }
    setQuantities(newQuantities);
  }, [selectedSeats]);

  if (!show.seatsio_event_key) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <Text className="text-sm text-center" style={{ color: THEME.dark.mutedForeground }}>
          Seat map is not configured for this show.
        </Text>
      </View>
    );
  }

  const handleZoneClick = (obj: any) => {
    const zone = obj as ClickedZone;
    const categoryLabel = (zone.category?.label ?? zone.label).toLowerCase();

    if (filteredCategories) {
      const isAllowed = filteredCategories.some((cat) => cat.toLowerCase() === categoryLabel);
      if (!isAllowed) return;
    }

    const seatEventKey = show.zone_seat_charts?.[categoryLabel];
    if (seatEventKey) {
      setZoneSeatEventKey(seatEventKey);
      setZoneSeatCategory(zone.category?.label ?? zone.label);
      // Pre-populate with already selected seats in this zone
      setZoneSeatSelected(selectedSeats.filter(s => s.id.startsWith(`${zone.id}-`) || s.category?.label === zone.category?.label));
      setClickedZone(zone);
      setView('seat-picking');
    } else {
      setClickedZone(zone);
      setView('tickets');
    }
  };

  const handleSeatPickingContinue = () => {
    // When the user clicks Checkout in the individual seat map, we proceed to review.
    onContinue();
  };

  const handleTicketsContinue = () => {
    if (!clickedZone) return;
    const targetQty = quantities[clickedZone.id] ?? 0;
    const currentSeats = selectedSeats.filter((s: SelectedSeat) => s.id.startsWith(`${clickedZone.id}-`));
    const currentQty = currentSeats.length;

    if (targetQty === currentQty) {
      onContinue();
      return;
    }

    const price =
      clickedZone.pricing?.price ??
      ZONE_PRICING.find(
        (p) => p.category === (clickedZone.category?.label ?? clickedZone.label).toLowerCase(),
      )?.price ?? (pricePerSeat ? getDeterministicPrice(clickedZone.category?.label ?? clickedZone.label, pricePerSeat) : 0);

    const pendingSeats: SelectedSeat[] = [];

    if (targetQty > currentQty) {
      // Add more
      for (let i = currentQty; i < targetQty; i++) {
        const formattedPrice = `\u20B9${price.toLocaleString('en-IN')}`;
        const seat: SelectedSeat = {
          id: `${clickedZone.id}-${i + 1}`,
          label: clickedZone.category?.label ?? clickedZone.label,
          category: { label: clickedZone.category?.label ?? clickedZone.label },
          pricing: { price, formattedPrice },
        };
        pendingSeats.push(seat);
        onSeatAdded(seat);
      }
    } else {
      // Remove some
      const toRemove = currentQty - targetQty;
      for (let i = 0; i < toRemove; i++) {
        onSeatRemoved(currentSeats[currentQty - 1 - i].id);
      }
    }
    // After updating current zone selections, we proceed to review.
    onContinue(pendingSeats.length > 0 ? pendingSeats : undefined);
  };

  // ── Seat picking within a zone — reuses SeatsioScenario with a synthetic show ──
  if (view === 'seat-picking' && zoneSeatEventKey) {
    const syntheticShow: Show = {
      ...show,
      seatsio_event_key: zoneSeatEventKey,
      seating_mode: 'individual',
    };
    return (
      <SeatsioScenario
        show={syntheticShow}
        selectedSeats={selectedSeats}
        onSeatAdded={(seat) => {
          setZoneSeatSelected((prev) => [...prev, seat]);
          onSeatAdded(seat);
        }}
        onSeatRemoved={(id) => {
          setZoneSeatSelected((prev) => prev.filter((s) => s.id !== id));
          onSeatRemoved(id);
        }}
        onContinue={handleSeatPickingContinue}
        categoryFilter={zoneSeatCategory}
        pricePerSeat={pricePerSeat}
        seatsToDeselect={props.seatsToDeselect}
      />
    );
  }

  // ── Ticket qty within a zone ───────────────────────────────────────────────
  if (view === 'tickets' && clickedZone) {
    const rawLabel = clickedZone.category?.label ?? clickedZone.label;
    // Format raw seatsio IDs like "diamond-right" → "Diamond Right"
    const formattedLabel = rawLabel
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const price =
      clickedZone.pricing?.price ??
      ZONE_PRICING.find(
        (p) => p.category === rawLabel.toLowerCase(),
      )?.price ?? (pricePerSeat ? getDeterministicPrice(rawLabel, pricePerSeat) : 0);

    const zoneTicketType: TicketType = {
      id: clickedZone.id,
      name: formattedLabel,
      price,
      currency: 'INR',
      description: `${formattedLabel} zone. Entry for one individual.`,
      max_per_order: 10,
      available: 999,
      is_sold_out: false,
    };

    const zoneQty = quantities[clickedZone.id] ?? 0;
    const selectedTickets: SelectedTicket[] = zoneQty > 0
      ? [{ type: zoneTicketType, quantity: zoneQty }]
      : [];

    const otherZonesSeats = selectedSeats.filter((s: SelectedSeat) => !s.id.startsWith(`${clickedZone.id}-`));
    const otherZonesAmount = otherZonesSeats.reduce((s: number, seat: SelectedSeat) => s + (seat.pricing?.price ?? 0), 0);
    
    const globalTotalQty = otherZonesSeats.length + zoneQty;
    const globalTotalAmount = otherZonesAmount + (zoneQty * price);

    // Can checkout if this zone has qty > 0, OR if other zones already have seats selected
    const canCheckout = zoneQty > 0 || otherZonesSeats.length > 0;

    return (
      <View className='flex-1'>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} className='mt-8'>
          <TicketSelectionStep
            ticketTypes={[zoneTicketType]}
            selectedTickets={selectedTickets}
            onSetQuantity={(_tt, q) =>
              setQuantities((prev) => ({ ...prev, [clickedZone.id]: Math.max(0, q) }))
            }
          />
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: Math.max(bottomInset + 8, 20),
            borderTopWidth: 1,
            borderTopColor: THEME.dark.border,
            backgroundColor: THEME.dark.background,
          }}>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-shrink-0">
              <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
                {globalTotalQty} {globalTotalQty === 1 ? 'ticket' : 'tickets'}
              </Text>
              {globalTotalAmount > 0 && (
                <Text className="text-xl font-primary-bold text-foreground">
                  {'\u20B9'}{globalTotalAmount.toLocaleString('en-IN')}
                </Text>
              )}
            </View>
            <Pressable
              onPress={handleTicketsContinue}
              disabled={!canCheckout}
              className="w-1/2 rounded-xl p-4 items-center justify-center bg-foreground"
              style={{ opacity: canCheckout ? 1 : 0.4 }}>
              <Text className="font-primary-bold text-base text-background">
                Checkout
              </Text>
            </Pressable>
          </View>

        </View>
      </View>
    );
  }


  const globalTotalQty = selectedSeats.length;
  const globalTotalAmount = selectedSeats.reduce((s: number, seat: SelectedSeat) => s + (seat.pricing?.price ?? 0), 0);


  // ── Zone overview chart ────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1 }}>
      <SeatsioSeatingChart
        workspaceKey={WORKSPACE_KEY}
        event={show.seatsio_event_key}
        region={REGION}
        pricing={zonePricing}
        filteredCategories={filteredCategories}
        unavailableCategories={unavailableCategories}
        objectPopover={
          filteredCategories
            ? { showLabel: false, showCategory: true, showPricing: true, showUnavailableNotice: false }
            : undefined
        }
        onObjectClicked={handleZoneClick}
      />
      {globalTotalQty > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: Math.max(bottomInset + 8, 20),
            borderTopWidth: 1,
            borderTopColor: THEME.dark.border,
            backgroundColor: THEME.dark.background,
            zIndex: 10,
          }}>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-shrink-0">
              <Text className="text-xs" style={{ color: THEME.dark.mutedForeground }}>
                {globalTotalQty} {globalTotalQty === 1 ? 'ticket' : 'tickets'}
              </Text>
              {globalTotalAmount > 0 && (
                <Text className="text-xl font-primary-bold text-foreground">
                  {'\u20B9'}{globalTotalAmount.toLocaleString('en-IN')}
                </Text>
              )}
            </View>
            <Pressable
              onPress={() => onContinue()}
              className="w-1/2 rounded-xl p-4 items-center justify-center bg-foreground">
              <Text className="font-primary-bold text-base text-background">
                Checkout
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {uniquePrices.length > 1 && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 2 }}>
            Select a section
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: 'center' }}>
            <Text style={{ color: THEME.dark.mutedForeground, fontSize: 13, fontWeight: '500', marginRight: 4 }}>
              Filters:
            </Text>
            {uniquePrices.map((price) => (
              <Pressable
                key={price}
                onPress={() => setSelectedPrice(selectedPrice === price ? null : price)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: selectedPrice === price ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <Text style={{ color: selectedPrice === price ? '#ffffff' : THEME.dark.mutedForeground, fontSize: 13, fontWeight: '500' }}>
                  ₹{price.toLocaleString('en-IN')}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ── Individual seat chart ──────────────────────────────────────────────────────
interface SeatsioScenarioProps extends SeatSelectionStepProps {
  /** Optional seatsio category key — restricts available seats to this category only */
  categoryFilter?: string;
}

function SeatsioScenario({
  show,
  selectedSeats,
  onSeatAdded,
  onSeatRemoved,
  onContinue,
  categoryFilter,
  pricePerSeat,
  seatsToDeselect,
  hasPreviousSeats,
  onClearSeats,
}: SeatsioScenarioProps) {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [showInfo, setShowInfo] = useState(false);
  const chartRef = useRef<any>(null);
  // True once the user picks at least one new seat on the current show
  const [hasNewSeats, setHasNewSeats] = useState(false);
  // True after user taps "Clear selection" — keeps bottom bar visible with Checkout
  const [clearedForCurrentShow, setClearedForCurrentShow] = useState(false);

  // Deselect seats that were removed externally (e.g. removed from review screen)
  useEffect(() => {
    if (seatsToDeselect?.length && chartRef.current) {
      chartRef.current.deselectObjects(seatsToDeselect);
    }
  }, [seatsToDeselect]);

  if (!show.seatsio_event_key) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <Text className="text-sm text-center" style={{ color: THEME.dark.mutedForeground }}>
          Seat map is not configured for this show.
        </Text>
      </View>
    );
  }

  const globalTotalQty = selectedSeats.length;
  const globalTotalAmount = selectedSeats.reduce(
    (sum, s) => sum + (s.pricing?.price ?? (pricePerSeat ? getDeterministicPrice(s.category?.label ?? s.label, pricePerSeat) : 0)),
    0,
  );


  const seatsByCategory: Record<string, string[]> = {};
  for (const seat of selectedSeats) {
    const cat = seat.category?.label ?? 'Other';
    if (!seatsByCategory[cat]) seatsByCategory[cat] = [];
    seatsByCategory[cat].push(seat.label);
  }

  const categoryEntries = Object.entries(seatsByCategory);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#09090b' }}>
        <SeatsioSeatingChartSDK
          workspaceKey={WORKSPACE_KEY}
          event={show.seatsio_event_key}
          region={REGION}
          colorScheme="dark"
          showMinimap={true}
          minimap={{ enabled: true, showOnMobile: true, position: 'top-right' }}
          showZoomOutButtonOnMobile={true}
          availableCategories={categoryFilter ? [categoryFilter] : undefined}
          chartJsUrl={`https://cdn-${REGION}.seatsio.net/chart.js`}
          onChartRendered={(chart) => {
            chartRef.current = chart;
            // Select already selected seats if any
            if (selectedSeats.length > 0) {
              chart.selectObjects(selectedSeats.map(s => s.id));
            }
          }}
          onObjectSelected={(obj) => {
            const seat: SelectedSeat = {
              id: obj.id,
              label: obj.label,
              category: { label: obj.category ? obj.category.label : '' },
              pricing: obj.pricing
                ? { price: obj.pricing.price, formattedPrice: obj.pricing.formattedPrice || '' }
                : undefined,
            };

            const catLabel = seat.category?.label ?? seat.label;
            if (!seat.pricing || !seat.pricing.price) {
              const catUpper = catLabel.toUpperCase();
              const categoryKey = Object.keys(SEAT_CATEGORY_PRICING).find(k => k.toUpperCase() === catUpper);
              const fallbackPrice = (categoryKey ? SEAT_CATEGORY_PRICING[categoryKey] : null)
                ?? (pricePerSeat ? getDeterministicPrice(catLabel, pricePerSeat) : 0);

              seat.pricing = {
                price: fallbackPrice,
                formattedPrice: `\u20B9${fallbackPrice.toLocaleString('en-IN')}`,
              };
            }
            setHasNewSeats(true);
            setClearedForCurrentShow(false);
            onSeatAdded(seat);
          }}
          onObjectDeselected={(obj) => {
            onSeatRemoved(obj.id);
          }}
        />
      </View>

      {(selectedSeats.length > 0 || clearedForCurrentShow) && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopWidth: 1,
            borderTopColor: THEME.dark.border,
            backgroundColor: THEME.dark.card,
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: Math.max(bottomInset + 8, 14),
            zIndex: 10,
          }}>
          {/* Row 1: label + info — only when seats selected */}
          {selectedSeats.length > 0 && (
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-primary-semibold" style={{ color: THEME.dark.mutedForeground }}>
                TICKETS
              </Text>
              <Pressable
                onPress={() => setShowInfo(true)}
                hitSlop={8}
                style={({ pressed }) => ({
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: THEME.dark.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pressed ? THEME.dark.muted : 'transparent',
                })}>
                <Info size={14} color={THEME.dark.mutedForeground} />
              </Pressable>
            </View>
          )}
          {/* Row 2: seat labels — only when seats selected */}
          {selectedSeats.length > 0 && (
            <Text className="text-sm font-primary-bold text-foreground mb-3" numberOfLines={1}>
              {categoryEntries.map(([cat, labels]) => `${cat} (${labels.join(', ')})`).join(', ')}
            </Text>
          )}
          {/* Row 3: price + button */}
          <View className="flex-row items-end justify-between gap-4">
            <View className="flex-shrink-0">
              {selectedSeats.length > 0 && (
                <Text className="text-xs mt-0.5" style={{ color: THEME.dark.mutedForeground }}>
                  {globalTotalQty} {globalTotalQty === 1 ? 'ticket' : 'tickets'}
                </Text>
              )}
              {globalTotalAmount > 0 && (
                <Text className="text-xl font-primary-bold text-foreground">
                  {'\u20B9'}{globalTotalAmount.toLocaleString('en-IN')}
                </Text>
              )}
            </View>

            {hasPreviousSeats && !hasNewSeats && !clearedForCurrentShow ? (
              <Pressable
                onPress={() => { setClearedForCurrentShow(true); onClearSeats?.(); }}
                className="w-1/2 rounded-xl p-4 items-center justify-center bg-foreground">
                <Text className="font-primary-bold text-base text-background">Clear selection</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => onContinue()}
                disabled={selectedSeats.length === 0}
                className="w-1/2 rounded-xl p-4 items-center justify-center bg-foreground"
                style={({ pressed }) => ({ opacity: selectedSeats.length === 0 ? 0.45 : pressed ? 0.8 : 1 })}>
                <Text className="font-primary-bold text-base text-background">Checkout</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Seat info modal */}
      <Modal visible={showInfo} transparent animationType="fade" onRequestClose={() => setShowInfo(false)}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
          onPress={() => setShowInfo(false)}>
          <Pressable
            style={{
              backgroundColor: THEME.dark.card,
              borderRadius: 20,
              padding: 24,
              width: '100%',
              maxWidth: 360,
              borderWidth: 1,
              borderColor: THEME.dark.border,
            }}
            onPress={() => { }}>
            <Text className="text-lg font-primary-bold text-foreground mb-4">Selected seats</Text>
            {categoryEntries.length === 0 ? (
              <Text style={{ color: THEME.dark.mutedForeground, fontSize: 13 }}>
                No seats selected.
              </Text>
            ) : (
              categoryEntries.map(([cat, labels]) => (
                <View key={cat} style={{ marginBottom: 12 }}>
                  <Text className="text-sm font-primary-semibold text-foreground">{cat}</Text>
                  <Text className="text-xs mt-0.5" style={{ color: THEME.dark.mutedForeground }}>
                    {labels.join(', ')}
                  </Text>
                </View>
              ))
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
