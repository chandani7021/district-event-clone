import { useState } from 'react';
import { FlatList, Pressable, View, Platform } from 'react-native';
import { Text } from '@/components/ui/text';

import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { HotlistIcon } from '@/components/hotlist/hotlist-icon';
import { CreateHotlistModal } from '@/components/hotlist/create-hotlist-modal';
import { useHotlists } from '@/hooks/use-hotlists';
import { THEME } from '@/lib/theme';
import type { Hotlist } from '@/store/hotlist-store';
import {
  HOTLIST_TITLE,
  HOTLIST_ALL_HOTLISTS,
  HOTLIST_CREATE_BUTTON,
  HOTLIST_STARTER_LABEL,
  HOTLIST_ITEMS_LABEL,
} from '@/constants/hotlist.constants';
import { COMMON_BACK } from '@/constants/profile.constants';

export default function HotlistsScreen() {
  const { hotlists } = useHotlists();
  const [createVisible, setCreateVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-xl font-primary-bold text-foreground">{HOTLIST_TITLE}</Text>
        <Pressable
          onPress={() => setCreateVisible(true)}
          className='bg-secondary rounded-full py-2.5 px-4 flex-row items-center gap-1'
        >
          <Plus size={Platform.OS === 'ios' ? 22 : 14} color={THEME.dark.foreground} />
          <Text className={Platform.OS === 'ios' ? 'text-foreground ml-1 text-sm font-primary-medium' : 'text-foreground text-sm font-primary-medium'}>
            Create new
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={hotlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <Text className="text-foreground text-lg font-primary-bold" style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
            {HOTLIST_ALL_HOTLISTS}
          </Text>
        }
        columnWrapperStyle={{ paddingHorizontal: 16, gap: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <HotlistCard
            hotlist={item}
            onPress={() =>
              router.push({ pathname: '/hotlist/[id]', params: { id: item.id } })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Create Button */}
      <View className="px-lg pb-md">
        <Pressable
          className="bg-foreground rounded-full py-[14px] items-center"
          onPress={() => setCreateVisible(true)}
        >
          <Text className="text-background text-base font-primary-semibold">{HOTLIST_CREATE_BUTTON}</Text>
        </Pressable>
      </View>

      <CreateHotlistModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreate={() => { }}
      />
    </SafeAreaView>
  );
}

function HotlistCard({ hotlist, onPress }: { hotlist: Hotlist; onPress: () => void }) {
  return (
    <Pressable className="flex-1 mb-md" onPress={onPress}>
      <LinearGradient
        colors={hotlist.gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full mb-sm"
        style={{ borderRadius: 16, aspectRatio: 1.5, alignItems: 'center', justifyContent: 'center' }}
      >
        <HotlistIcon iconType={hotlist.iconType} size={36} />
      </LinearGradient>
      <Text className="text-foreground text-sm font-primary-bold mt-2" numberOfLines={1}>
        {hotlist.name}
      </Text>
      <Text className="text-muted-foreground text-xs mt-0.5" numberOfLines={1}>
        {hotlist.isStarter ? `${HOTLIST_STARTER_LABEL} • ` : ''}{hotlist.itemCount} {HOTLIST_ITEMS_LABEL}
      </Text>
    </Pressable>
  );
}
