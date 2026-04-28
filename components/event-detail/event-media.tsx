import { VideoView, type VideoPlayer } from 'expo-video';
import NativeVideoModule from 'expo-video/build/NativeVideoModule';
import { useEffect, useMemo } from 'react';
import { Dimensions, Image, Pressable, View } from 'react-native';
import { ArrowLeft, Bookmark, Image as ImageIcon, Share2, Volume2, VolumeX } from 'lucide-react-native';

const { height } = Dimensions.get('window');
const SHEET_TOP = height * 0.6;

import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '@/lib/theme';
import type { EventMediaProps } from '@/interfaces/event-detail.interface';
import { isVideo } from '@/lib/utils';

function useCustomVideoPlayer(source: string | null): VideoPlayer | null {
  const player = useMemo(() => {
    if (!source) return null;
    try {
      const NativePlayer = (NativeVideoModule as unknown as { VideoPlayer: new (src: { uri: string }) => VideoPlayer }).VideoPlayer;
      return new NativePlayer({ uri: source });
    } catch (e) {
      console.error("Failed to initialize NativeVideoModule.VideoPlayer:", e);
      return null;
    }
  }, [source]);

  useEffect(() => {
    return () => {
      if (player && typeof (player as unknown as { release?: () => void }).release === 'function') {
        (player as unknown as { release: () => void }).release();
      }
    };
  }, [player]);

  return player;
}

export function EventMedia({ images, onGalleryPress, isHotlisted, onHotlistToggle, onSharePress, isMuted, onMuteToggle, showMute }: EventMediaProps) {
  const insets = useSafeAreaInsets();

  const mainMedia = images[0] ?? '';
  const isMainMediaVideo = isVideo(mainMedia);

  const player = useCustomVideoPlayer(isMainMediaVideo ? mainMedia : null);

  useEffect(() => {
    if (!isMainMediaVideo || !player) return;
    try {
      player.loop = true;
      player.muted = isMuted ?? true;
      player.play();
    } catch (e) {
      console.warn("Player setup error:", e);
    }
  }, [isMainMediaVideo, player, isMuted]);

  return (
    <View className="w-full h-full">
      {isMainMediaVideo && player ? (
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
        />
      ) : (
        <Image
          source={{ uri: mainMedia }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          resizeMode="cover"
        />
      )}

      {/* Top row: back + bookmark + share */}
      <View
        className="absolute left-0 right-0 flex-row justify-between px-4"
        style={{ top: insets.top + 8, zIndex: 10 }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="w-10 h-10 bg-white/10 border border-white/10 items-center justify-center"
          style={{ borderRadius: 20, overflow: 'hidden' }}
        >
          <ArrowLeft size={20} color={THEME.dark.foreground} />
        </Pressable>

        <View className="flex-row gap-3">
          <Pressable
            onPress={onHotlistToggle}
            hitSlop={8}
            className="w-10 h-10 bg-white/10 border border-white/10 items-center justify-center"
            style={{ borderRadius: 20, overflow: 'hidden' }}
          >
            <Bookmark size={20} color={isHotlisted ? THEME.dark.primary : THEME.dark.foreground} fill={isHotlisted ? THEME.dark.primary : 'transparent'} />
          </Pressable>
          <Pressable
            onPress={onSharePress}
            hitSlop={8}
            className="w-10 h-10 bg-white/10 border border-white/10 items-center justify-center"
            style={{ borderRadius: 20, overflow: 'hidden' }}
          >
            <Share2 size={20} color={THEME.dark.foreground} />
          </Pressable>
        </View>
      </View>

      {/* Bottom row: mute + gallery — pinned just above where the sheet starts */}
      <View
        className="absolute left-0 right-0 flex-row justify-between px-4"
        style={{ top: SHEET_TOP - 56 }}>
        {showMute ? (
          <Pressable
            onPress={onMuteToggle}
            hitSlop={8}
            className="w-10 h-10 bg-white/10 border border-white/10 items-center justify-center"
            style={{ borderRadius: 20, overflow: 'hidden' }}
          >
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
          className="w-10 h-10 bg-white/10 border border-white/10 items-center justify-center"
          style={{ borderRadius: 20, overflow: 'hidden' }}
        >
          <ImageIcon size={20} color={THEME.dark.foreground} />
        </Pressable>
      </View>
    </View>
  );
}
