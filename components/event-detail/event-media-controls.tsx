import { Pressable, View } from 'react-native';
import { Image as ImageIcon, Volume2, VolumeX } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import type { EventMediaControlsProps } from '@/interfaces/event-detail.interface';

export function EventMediaControls({ isMuted, onMuteToggle, onGalleryPress, showMute }: EventMediaControlsProps) {
  return (
    <View className="flex-row justify-between px-4 pb-4">
      {showMute ? (
        <Pressable
          onPress={onMuteToggle}
          hitSlop={8}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          {isMuted ? (
            <VolumeX size={20} color={THEME.dark.foreground} />
          ) : (
            <Volume2 size={20} color={THEME.dark.foreground} />
          )}
        </Pressable>
      ) : (
        <View />
      )}
      <Pressable
        onPress={onGalleryPress}
        hitSlop={8}
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <ImageIcon size={20} color={THEME.dark.foreground} />
      </Pressable>
    </View>
  );
}
