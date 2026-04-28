import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { TrendingCard } from './trending-card';
import { getTrending } from '@/services/search.service';
import { getCurrentLocation } from '@/services/navigation.service';
import { Skeleton } from '@/components/ui/skeleton';
import type { TrendingEvent } from '@/interfaces/search.interface';

function TrendingCardSkeleton() {
  return (
    <View className="flex-1 flex-row items-center gap-3">
      <Skeleton width={64} height={64} borderRadius={8} />
      <View className="flex-1 gap-1.5">
        <Skeleton height={14} borderRadius={5} />
        <Skeleton width={60} height={12} borderRadius={5} />
      </View>
    </View>
  );
}

import { DUMMY_EVENTS } from '@/lib/dummy-events';

export function TrendingSection() {
  const [items, setItems] = useState<TrendingEvent[]>([]);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation().then((loc) => {
      setCityName(loc.city);
      getTrending(loc.city).then((data) => {
        // Filter trending events to only show those that have details in the system (DUMMY_EVENTS)
        const filteredData = data.filter((item) => DUMMY_EVENTS.some((e) => e.id === item.id));
        setItems(filteredData);
        setLoading(false);
      });
    });
  }, []);


  if (loading) {
    return (
      <View className="px-5 gap-3">
        <Skeleton width={180} height={18} borderRadius={6} />
        {[0, 1, 2].map((i) => (
          <View key={i} className="flex-row gap-4">
            <TrendingCardSkeleton />
            <TrendingCardSkeleton />
          </View>
        ))}
      </View>
    );
  }

  if (items.length === 0) return null;

  const rows: TrendingEvent[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <View className="px-5 gap-3">
      <Text className="text-foreground text-2xl font-primary-bold">
        Trending in {cityName}
      </Text>

      {rows.map((row) => (
        <View key={row[0]?.id || Math.random()} className="flex-row gap-4">
          {row.map((item) => (
            <TrendingCard key={item.id} item={item} />
          ))}
          {row.length === 1 && <View className="flex-1" />}
        </View>
      ))}
    </View>
  );
}
